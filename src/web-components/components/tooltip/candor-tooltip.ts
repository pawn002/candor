import { LitElement, css, html, type PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { customElement } from '../../utils/define';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * A short label revealed on hover or focus. Wraps its trigger: slot the control,
 * set `text`.
 *
 * **Supplementary only.** The content is reachable only by hovering or focusing,
 * so anything a user must read to act belongs in the layout instead — a `hint`
 * on the form control, or a `candor-accessible-text role_="annotation"` beside
 * it. If losing the tooltip would leave the interface ambiguous, it is carrying
 * too much.
 *
 * **Never put a disabled control's explanation in one.** Native `disabled`
 * elements are not focusable and do not reliably fire hover events, so the
 * tooltip is unreachable precisely for keyboard and screen-reader users. Use
 * adjacent text.
 *
 * The bubble is shown as a popover, in the top layer, so no ancestor's
 * `overflow` or stacking context can clip or cover it. That includes
 * `candor-card`, `candor-toolbar` and a consumer's own scroll panes (#259). It
 * is placed in viewport coordinates from the trigger's position when shown, and
 * re-placed on scroll and resize while it is open.
 *
 * `position` is a preference, not collision detection: the bubble does not flip
 * to stay on screen.
 *
 * Emits no custom events.
 */
@customElement('candor-tooltip')
export class CandorTooltip extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }
    .tooltip__bubble {
      /* A manual popover (#259). The top layer escapes every ancestor clip;
         position: fixed and the --_anchor-* coordinates set on show place it
         against the trigger. The UA popover defaults (inset, margin, border,
         padding, overflow, colours) are reset here. */
      position: fixed;
      inset: auto;
      margin: 0;
      border: 0;
      overflow: visible;
      padding: var(--spacing-2xs) var(--spacing-xs);
      background-color: var(--color-bg-inverse);
      color: var(--color-text-inverse);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
      letter-spacing: 0.02em;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      pointer-events: none;
      /* A closed popover is display:none, so a hidden bubble adds nothing to
         the host's scrollWidth (#107, #175). The display and overlay
         transitions keep the fade on both the way in and the way out. */
      opacity: 0;
      transition: opacity 0.15s ease, display 0.15s ease allow-discrete, overlay 0.15s ease allow-discrete;
    }
    .tooltip__bubble:popover-open { opacity: 1; }
    @starting-style {
      .tooltip__bubble:popover-open { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .tooltip__bubble { transition: none; }
    }
    .tooltip__bubble::after {
      content: '';
      position: absolute;
      border: 5px solid transparent;
    }

    .tooltip__bubble--top {
      top: calc(var(--_anchor-top) - var(--spacing-xs));
      left: var(--_anchor-center-x);
      transform: translate(-50%, -100%);
    }
    .tooltip__bubble--top::after {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--bottom {
      top: calc(var(--_anchor-bottom) + var(--spacing-xs));
      left: var(--_anchor-center-x);
      transform: translateX(-50%);
    }
    .tooltip__bubble--bottom::after {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--left {
      top: var(--_anchor-center-y);
      left: calc(var(--_anchor-left) - var(--spacing-xs));
      transform: translate(-100%, -50%);
    }
    .tooltip__bubble--left::after {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--right {
      top: var(--_anchor-center-y);
      left: calc(var(--_anchor-right) + var(--spacing-xs));
      transform: translateY(-50%);
    }
    .tooltip__bubble--right::after {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: var(--color-bg-inverse);
    }
  `;

  @property() text = '';
  @property({ reflect: true }) position: TooltipPosition = 'top';
  @state() private _visible = false;
  @query('.tooltip__bubble') private _bubble!: HTMLElement;

  override disconnectedCallback() {
    this._stopTracking();
    super.disconnectedCallback();
  }

  override updated(changed: PropertyValues<this>) {
    if (!changed.has('_visible' as keyof CandorTooltip)) return;
    const bubble = this._bubble;
    if (this._visible) {
      this._place();
      if (!bubble.matches(':popover-open')) bubble.showPopover();
      window.addEventListener('scroll', this._place, { capture: true, passive: true });
      window.addEventListener('resize', this._place, { passive: true });
    } else {
      this._stopTracking();
      if (bubble.matches(':popover-open')) bubble.hidePopover();
    }
  }

  /** Copies the trigger's viewport rect onto the bubble as custom properties. */
  private _place = () => {
    const r = this.getBoundingClientRect();
    const set = (name: string, px: number) => this._bubble.style.setProperty(name, `${px}px`);
    set('--_anchor-top', r.top);
    set('--_anchor-bottom', r.bottom);
    set('--_anchor-left', r.left);
    set('--_anchor-right', r.right);
    set('--_anchor-center-x', r.left + r.width / 2);
    set('--_anchor-center-y', r.top + r.height / 2);
  };

  private _stopTracking() {
    window.removeEventListener('scroll', this._place, { capture: true });
    window.removeEventListener('resize', this._place);
  }

  override render() {
    return html`
      <slot
        @mouseenter="${() => this._visible = true}"
        @mouseleave="${() => this._visible = false}"
        @focusin="${() => this._visible = true}"
        @focusout="${() => this._visible = false}"
        @keydown="${(e: KeyboardEvent) => e.key === 'Escape' && (this._visible = false)}"
      ></slot>
      <div aria-hidden="true" popover="manual" class="tooltip__bubble tooltip__bubble--${this.position}">${this.text}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-tooltip': CandorTooltip; }
}
