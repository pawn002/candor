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
      gap: var(--spacing-sm);
      cursor: pointer;
      position: relative;
    }
    .checkbox-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }
    .checkbox-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .checkbox-input:focus-visible + .checkbox-box {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .checkbox-input:checked + .checkbox-box {
      background-color: var(--color-action-primary);
      border-color: var(--color-action-primary);
    }
    .checkbox-input:checked + .checkbox-box::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 6px;
      height: 12px;
      border: solid var(--color-text-on-action);
      border-width: 0 var(--border-width-medium) var(--border-width-medium) 0;
      transform: rotate(45deg);
    }
    .checkbox-input:disabled + .checkbox-box {
      background-color: var(--color-bg-surface);
      border-color: var(--color-border-default);
      cursor: not-allowed;
    }
    .checkbox-box {
      width: 20px;
      height: 20px;
      border: var(--border-width-medium) solid var(--color-border-control);
      border-radius: var(--radius-sm);
      background-color: var(--color-bg-page);
      position: relative;
      flex-shrink: 0;
      transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    }
    .checkbox-box:hover {
      border-color: var(--color-action-primary);
    }
    .checkbox-label {
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-md);
      color: var(--color-text-default);
      user-select: none;
      letter-spacing: 0.02em;
    }
  `;

  @property() label?: string;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property() name?: string;

  private _id = `candor-checkbox-${Math.random().toString(36).slice(2, 9)}`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('checked')) {
      this._internals.setFormValue(this.checked ? 'on' : null);
    }
  }

  private _onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(new CustomEvent('change', { detail: this.checked, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <label class="checkbox-wrapper ${this.disabled ? 'checkbox-wrapper--disabled' : ''}" for="${this._id}">
        <input
          class="checkbox-input"
          type="checkbox"
          id="${this._id}"
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
        />
        <span class="checkbox-box"></span>
        ${this.label ? html`<span class="checkbox-label">${this.label}</span>` : nothing}
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-checkbox': CandorCheckbox; }
}
