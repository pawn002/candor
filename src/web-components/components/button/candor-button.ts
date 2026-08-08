import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../utils/host-aria';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * A button.
 *
 * **It dispatches no custom events.** Bind `@click` on the host — the inner
 * `<button>`'s click crosses the shadow boundary, so a host listener receives
 * it. There is no `press`, `activate` or `button-click`; a listener bound to one
 * of those never fires and nothing reports it.
 *
 * **Sizes are `small`, `medium` and `large`. There is no `size="icon"`.** An
 * unrecognised value is accepted silently, produces no class, and renders at the
 * default size — so the mistake is invisible. For an icon-only button, use a
 * size and supply `aria-label`.
 *
 * `aria-label` on the host is supported: it is mirrored onto the inner button
 * and stripped from the host, so the name is announced once rather than twice.
 * An icon-only button needs it, since the glyph carries no text.
 *
 * `type="submit"` works inside a native `<form>`.
 *
 * **A disabled button needs an adjacent explanation, and it must not be a
 * tooltip.** Native `disabled` removes the button from the tab order, so a
 * hover- or focus-gated tooltip is unreachable by keyboard and screen reader —
 * the users most likely to need it. WCAG 1.4.3 exempts the dimmed label from
 * contrast, and that dimming does signal "unavailable"; what it can no longer
 * carry is *why*, or what would unlock it. Put that in a readable,
 * enabled-contrast element next to the button, where it sits in document order
 * and everyone meets it. There is deliberately no `hint` property — the
 * consumer supplies the adjacent element.
 *
 * `variant="destructive"` is for irreversible actions. It is a colour, not a
 * confirmation: pair it with one where the action warrants it.
 *
 * Emits no custom events.
 */
@customElement('candor-button')
export class CandorButton extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }
    .button {
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-bold);
      font-optical-sizing: auto;
      border: none;
      border-radius: var(--candor-button-radius, var(--radius-md));
      cursor: pointer;
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      text-decoration: none;
    }
    .button:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .button:disabled { cursor: not-allowed; opacity: 0.5; }
    /* Density knobs — each defaults to the per-size token, so a consumer can
       override padding/font-size/min-height (e.g. to go denser than 'small',
       #165) without forking: candor-button { --candor-button-min-height: 1.75rem; } */
    .button--small {
      font-size: var(--candor-button-font-size, var(--font-size-sm));
      font-weight: var(--font-weight-bold);
      letter-spacing: 0.01em;
      padding: var(--candor-button-padding-y, var(--spacing-button-padding-y-sm)) var(--candor-button-padding-x, var(--spacing-button-padding-x-sm));
      min-height: var(--candor-button-min-height, 2rem);
    }
    .button--medium {
      font-size: var(--candor-button-font-size, var(--font-size-md));
      padding: var(--candor-button-padding-y, var(--spacing-button-padding-y)) var(--candor-button-padding-x, var(--spacing-button-padding-x));
      min-height: var(--candor-button-min-height, var(--hit-target-aaa));
    }
    .button--large {
      font-size: var(--candor-button-font-size, var(--font-size-lg));
      padding: var(--candor-button-padding-y, var(--spacing-button-padding-y-lg)) var(--candor-button-padding-x, var(--spacing-button-padding-x-lg));
      min-height: var(--candor-button-min-height, 3rem);
    }
    .button--primary { background-color: var(--color-action-primary); color: var(--color-text-on-action); }
    .button--primary:hover:not(:disabled) { background-color: var(--color-action-primary-hover); }
    .button--primary:active:not(:disabled) { background-color: var(--color-action-primary-active); }
    .button--secondary { background-color: transparent; color: var(--color-action-primary); border: var(--border-width-thin) solid var(--color-action-primary); }
    .button--secondary:hover:not(:disabled) { background-color: oklch(from var(--color-action-primary) l c h / 0.08); }
    .button--secondary:active:not(:disabled) { background-color: oklch(from var(--color-action-primary) l c h / 0.15); }
    .button--destructive { background-color: var(--color-action-destructive); color: var(--color-action-destructive-text); border: var(--border-width-thin) solid var(--color-action-destructive-border); }
    .button--destructive:hover:not(:disabled) { background-color: var(--color-action-destructive-hover); }
    .button--destructive:active:not(:disabled) { background-color: var(--color-action-destructive-active); }
    .button--tertiary { background-color: var(--color-action-tertiary); color: var(--color-action-tertiary-text); }
    .button--tertiary:hover:not(:disabled) { background-color: var(--color-action-tertiary-hover); }
    .button--tertiary:active:not(:disabled) { background-color: oklch(from var(--color-action-tertiary-hover) calc(l - 0.04) c h); }
    .button--ghost { background-color: transparent; color: var(--color-text-default); }
    .button--ghost:hover:not(:disabled) { background-color: var(--color-bg-surface); }
    .button--ghost:active:not(:disabled) { background-color: oklch(from var(--color-bg-surface) calc(l - 0.06) c h); }
  `;

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'medium';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming on icon-only buttons — see utils/host-aria.ts).
  @state() private _ariaLabel: string | null = null;
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

  override render() {
    return html`
      <button
        part="button"
        class="button button--${this.variant} button--${this.size}"
        ?disabled="${this.disabled}"
        type="${this.type}"
        aria-label="${this._ariaLabel ?? nothing}"
      ><slot></slot></button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-button': CandorButton; }
}
