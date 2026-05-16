import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('candor-radio')
export class CandorRadio extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: inline-flex; }
    .radio-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      position: relative;
    }
    .radio-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }
    .radio-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .radio-input:focus-visible + .radio-circle {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .radio-input:checked + .radio-circle {
      border-color: var(--color-action-primary);
    }
    .radio-input:checked + .radio-circle::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--color-action-primary);
    }
    .radio-input:disabled + .radio-circle {
      background-color: var(--color-bg-surface);
      border-color: var(--color-border-default);
      cursor: not-allowed;
    }
    .radio-circle {
      width: 20px;
      height: 20px;
      border: var(--border-width-medium) solid var(--color-border-control);
      border-radius: 50%;
      background-color: var(--color-bg-page);
      position: relative;
      flex-shrink: 0;
      transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    }
    .radio-circle:hover {
      border-color: var(--color-action-primary);
    }
    .radio-label {
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-md);
      color: var(--color-text-default);
      user-select: none;
      letter-spacing: 0.02em;
    }
  `;

  @property() label?: string;
  @property() value = '';
  @property() name?: string;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _id = `candor-radio-${Math.random().toString(36).slice(2, 9)}`;

  private _onChange(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      this.checked = true;
      this._internals.setFormValue(this.value);
      this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
    }
  }

  override render() {
    return html`
      <label class="radio-wrapper ${this.disabled ? 'radio-wrapper--disabled' : ''}" for="${this._id}">
        <input
          class="radio-input"
          type="radio"
          id="${this._id}"
          .value="${this.value}"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
        />
        <span class="radio-circle"></span>
        ${this.label ? html`<span class="radio-label">${this.label}</span>` : nothing}
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-radio': CandorRadio; }
}
