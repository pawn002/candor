import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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
 * The bubble renders inside this element's shadow root, so **an ancestor with
 * `overflow: hidden` or `overflow: auto` will clip it** — a real constraint
 * inside cards, toolbars and scroll containers. There is no portalling. Where
 * clipping occurs, either give the ancestor room or move the text into the
 * layout, which the point above suggests anyway.
 *
 * `position` is a preference, not collision detection: the bubble does not flip
 * to stay on screen.
 *
 * Emits no custom events.
 */
@customElement('candor-tooltip')
export class CandorTooltip extends LitElement {
  static override styles = css`
    :host { display: inline-flex; position: relative; }
    .tooltip__bubble {
      position: absolute;
      z-index: 100;
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
      /* display:none takes the bubble out of layout entirely while hidden, so
         it cannot contribute to the host's scrollWidth (#107). Combined with
         @starting-style + transition-behavior:allow-discrete below, the
         display:none <-> display:block flip still fades — same technique
         candor-drawer uses for its dialog[open] transitions. */
      display: none;
      opacity: 0;
      transition: opacity 0.15s ease, display 0.15s ease allow-discrete;
    }
    .tooltip__bubble--visible {
      display: block;
      opacity: 1;
    }
    @starting-style {
      .tooltip__bubble--visible { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .tooltip__bubble { transition: none; }
    }

    .tooltip__bubble--top {
      bottom: calc(100% + var(--spacing-xs));
      left: 50%;
      transform: translateX(-50%);
    }
    .tooltip__bubble--top::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--bottom {
      top: calc(100% + var(--spacing-xs));
      left: 50%;
      transform: translateX(-50%);
    }
    .tooltip__bubble--bottom::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-bottom-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--left {
      right: calc(100% + var(--spacing-xs));
      top: 50%;
      transform: translateY(-50%);
    }
    .tooltip__bubble--left::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--right {
      left: calc(100% + var(--spacing-xs));
      top: 50%;
      transform: translateY(-50%);
    }
    .tooltip__bubble--right::after {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: var(--color-bg-inverse);
    }
  `;

  @property() text = '';
  @property({ reflect: true }) position: TooltipPosition = 'top';
  @state() private _visible = false;

  override render() {
    return html`
      <slot
        @mouseenter="${() => this._visible = true}"
        @mouseleave="${() => this._visible = false}"
        @focusin="${() => this._visible = true}"
        @focusout="${() => this._visible = false}"
        @keydown="${(e: KeyboardEvent) => e.key === 'Escape' && (this._visible = false)}"
      ></slot>
      <div
        aria-hidden="true"
        class="tooltip__bubble tooltip__bubble--${this.position} ${this._visible ? 'tooltip__bubble--visible' : ''}"
      >${this.text}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-tooltip': CandorTooltip; }
}
