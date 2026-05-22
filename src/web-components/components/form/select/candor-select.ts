import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { phCaretDownBold } from '../../../icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@customElement('candor-select')
export class CandorSelect extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .select-wrapper { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .select-label { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); display: flex; gap: var(--spacing-xs); }
    .select-required { color: var(--color-status-error-text); }
    .select-control { position: relative; display: flex; align-items: center; }
    .select {
      width: 100%;
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      padding-right: calc(var(--spacing-input-padding-x) + 1.75rem);
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-page);
      color: var(--color-text-default);
      appearance: none;
      cursor: pointer;
      transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      min-height: 2.5rem;
    }
    .select:hover:not(:disabled) { border-color: var(--color-text-subtle); }
    .select:focus { outline: none; border-color: var(--color-action-primary); box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-action-primary) l c h / 0.2); }
    .select--error { border-color: var(--color-status-error); }
    .select--error:focus { border-color: var(--color-status-error); box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-status-error) l c h / 0.2); }
    .select:disabled { background-color: var(--color-bg-surface); color: var(--color-text-disabled); cursor: not-allowed; border-color: var(--color-border-default); }
    .select__caret {
      position: absolute;
      right: var(--spacing-input-padding-x);
      width: 1rem;
      height: 1rem;
      pointer-events: none;
      color: var(--color-text-subtle);
      transition: color 0.15s ease;
    }
    .select-control:focus-within .select__caret { color: var(--color-action-primary); }
    .select-control--error .select__caret { color: var(--color-status-error); }
    .select-control--disabled .select__caret { color: var(--color-text-disabled); }
    .select-description { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); }
    .select-error-message { color: var(--color-status-error-text); font-size: var(--font-size-md); }
    .select-hint { color: var(--color-text-subtle); }
  `;

  @property({ type: Array }) options: SelectOption[] = [];
  @property() label?: string;
  @property() placeholder?: string;
  @property() error?: string;
  @property() hint?: string;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property() value = '';
  @property() name?: string;

  private _id = `candor-select-${Math.random().toString(36).slice(2, 9)}`;
  private _descId = `${this._id}-desc`;

  private _onChange(e: Event) {
    this.value = (e.target as HTMLSelectElement).value;
    this._internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div class="select-wrapper">
        ${this.label ? html`
          <label class="select-label" for="${this._id}">
            ${this.label}
            ${this.required ? html`<span class="select-required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        <div class="select-control ${this.error ? 'select-control--error' : ''} ${this.disabled ? 'select-control--disabled' : ''}">
          <select
            id="${this._id}"
            class="select ${this.error ? 'select--error' : ''}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            aria-invalid="${this.error ? 'true' : nothing}"
            aria-describedby="${this._descId}"
            name="${this.name || nothing}"
            @change="${this._onChange}"
          >
            ${this.placeholder ? html`<option value="" ?disabled="${true}" ?selected="${!this.value}">${this.placeholder}</option>` : nothing}
            ${this.options.map(opt => html`
              <option value="${opt.value}" ?disabled="${opt.disabled || false}" ?selected="${opt.value === this.value}">${opt.label}</option>
            `)}
          </select>
          <svg class="select__caret" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
        </div>
        <div id="${this._descId}" class="select-description" aria-live="polite" aria-atomic="true">
          ${this.error ? html`<span class="select-error-message">${this.error}</span>` : nothing}
          ${!this.error && this.hint ? html`<span class="select-hint">${this.hint}</span>` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-select': CandorSelect; }
}
