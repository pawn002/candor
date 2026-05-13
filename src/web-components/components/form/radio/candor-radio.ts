import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('candor-radio')
export class CandorRadio extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static styles = css`
    :host { display: inline-flex; }
    .radio-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-md);
      color: var(--color-text-default);
    }
    .radio-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }
    .radio {
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      cursor: pointer;
      accent-color: var(--color-action-primary);
    }
    .radio:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .radio:disabled { cursor: not-allowed; }
    .radio-label { letter-spacing: 0.02em; }
  `;

  @property() label?: string;
  @property() value = '';
  @property() name?: string;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _id = `candor-radio-${Math.random().toString(36).slice(2, 9)}`;

  private _onChange(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      this._internals.setFormValue(this.value);
      this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
    }
  }

  render() {
    return html`
      <label class="radio-wrapper ${this.disabled ? 'radio-wrapper--disabled' : ''}" for="${this._id}">
        <input
          class="radio"
          type="radio"
          id="${this._id}"
          .value="${this.value}"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
        />
        ${this.label ? html`<span class="radio-label">${this.label}</span>` : nothing}
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-radio': CandorRadio; }
}
