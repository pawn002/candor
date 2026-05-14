import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive';
type ButtonSize = 'small' | 'medium' | 'large';

@customElement('candor-button')
export class CandorButton extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }
    .button {
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-medium);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }
    .button:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .button:disabled { cursor: not-allowed; opacity: 0.5; }
    .button--small {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      letter-spacing: 0.01em;
      padding: var(--spacing-button-padding-y-sm) var(--spacing-button-padding-x-sm);
      min-height: 2rem;
    }
    .button--medium {
      font-size: var(--font-size-md);
      padding: var(--spacing-button-padding-y) var(--spacing-button-padding-x);
      min-height: 2.5rem;
    }
    .button--large {
      font-size: var(--font-size-lg);
      padding: var(--spacing-button-padding-y-lg) var(--spacing-button-padding-x-lg);
      min-height: 3rem;
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
  @property({ attribute: 'aria-label' }) override ariaLabel: string | null = null;

  override render() {
    return html`
      <button
        class="button button--${this.variant} button--${this.size}"
        ?disabled="${this.disabled}"
        type="${this.type}"
        aria-label="${this.ariaLabel ?? nothing}"
        @click="${this._onClick}"
      ><slot></slot></button>
    `;
  }

  private _onClick(e: Event) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('clicked', { detail: e, bubbles: true, composed: true }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-button': CandorButton; }
}
