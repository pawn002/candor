import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('candor-checkbox')
export class CandorCheckbox extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: inline-flex; }
    .checkbox-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-md);
      color: var(--color-text-default);
    }
    .checkbox-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }
    .checkbox {
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      border: var(--border-width-medium) solid var(--color-border-control);
      border-radius: var(--radius-sm);
      background-color: var(--color-bg-page);
      cursor: pointer;
      accent-color: var(--color-action-primary);
    }
    .checkbox:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .checkbox:disabled { cursor: not-allowed; }
    .checkbox-label { letter-spacing: 0.02em; }
  `;

  @property() label?: string;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property() name?: string;

  private _id = `candor-checkbox-${Math.random().toString(36).slice(2, 9)}`;

  private _onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this._internals.setFormValue(this.checked ? 'on' : null);
    this.dispatchEvent(new CustomEvent('change', { detail: this.checked, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <label class="checkbox-wrapper ${this.disabled ? 'checkbox-wrapper--disabled' : ''}" for="${this._id}">
        <input
          class="checkbox"
          type="checkbox"
          id="${this._id}"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
        />
        ${this.label ? html`<span class="checkbox-label">${this.label}</span>` : nothing}
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-checkbox': CandorCheckbox; }
}
