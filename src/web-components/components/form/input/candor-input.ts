import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('candor-input')
export class CandorInput extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .input-wrapper { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .input-label { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); display: flex; letter-spacing: var(--letter-spacing-relaxed); }
    .input-required { margin-left: 0.25em; color: var(--color-status-error-text); }
    .input {
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--radius-md);
      background-color: var(--color-bg-page);
      color: var(--color-text-default);
      transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      min-height: var(--hit-target-aaa);
      width: 100%;
      box-sizing: border-box;
    }
    .input::placeholder { color: var(--color-text-disabled); }
    .input:hover:not(:disabled) { border-color: var(--color-text-subtle); }
    .input:focus { outline: none; border-color: var(--color-action-primary); box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-action-primary) l c h / 0.2); }
    .input--error { border-color: var(--color-status-error); }
    .input--error:focus { border-color: var(--color-status-error); box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-status-error) l c h / 0.2); }
    .input--textarea { min-height: unset; line-height: var(--line-height-normal); }
    .input:disabled { background-color: var(--color-bg-surface); color: var(--color-text-disabled); cursor: not-allowed; border-color: var(--color-border-default); }
    .input-hint { margin-top: calc(-1 * var(--spacing-xs)); font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-italic); color: var(--color-text-subtle); }
    .input-error-message { font-family: var(--font-family-accessible); font-size: var(--font-size-md); letter-spacing: var(--letter-spacing-italic); color: var(--color-status-error-text); }
    .input-error-live { display: contents; }
  `;

  @property() label?: string;
  @property() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @property() placeholder?: string;
  @property() error?: string;
  @property() hint?: string;
  @property({ type: Boolean }) required = false;
  @property() name?: string;
  @property({ type: Boolean }) multiline = false;
  @property({ type: Number }) rows = 3;
  @property() resize: 'none' | 'vertical' | 'both' = 'vertical';
  @property({ type: Boolean }) disabled = false;
  @property() value = '';

  private _id = `candor-input-${Math.random().toString(36).slice(2, 9)}`;
  private _hintId = `${this._id}-hint`;
  private _errorId = `${this._id}-error`;

  @query('input, textarea') private _field?: HTMLInputElement | HTMLTextAreaElement;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('required')) {
      this._internals.setFormValue(this.value);
      if (this.required && !this.value) {
        this._internals.setValidity({ valueMissing: true }, 'Please fill in this field', this._field);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _onInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('input-change', { detail: this.value, bubbles: true, composed: true }));
  }

  override render() {
    const inputCls = ['input', this.error ? 'input--error' : '', this.multiline ? 'input--textarea' : ''].filter(Boolean).join(' ');
    const describedBy = [this.hint ? this._hintId : '', this._errorId].filter(Boolean).join(' ');
    return html`
      <div class="input-wrapper">
        ${this.label ? html`
          <label class="input-label" for="${this._id}">
            ${this.label}
            ${this.required ? html`<span class="input-required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        ${this.hint ? html`<span id="${this._hintId}" class="input-hint">${this.hint}</span>` : nothing}
        ${this.multiline
          ? html`<textarea
              id="${this._id}"
              class="${inputCls}"
              .rows="${this.rows}"
              style="resize:${this.resize}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
              .placeholder="${this.placeholder || ''}"
              .value="${this.value}"
              aria-invalid="${this.error ? 'true' : nothing}"
              aria-describedby="${describedBy}"
              name="${this.name || nothing}"
              @input="${this._onInput}"
            ></textarea>`
          : html`<input
              id="${this._id}"
              class="${inputCls}"
              type="${this.type}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
              .placeholder="${this.placeholder || ''}"
              .value="${this.value}"
              aria-invalid="${this.error ? 'true' : nothing}"
              aria-describedby="${describedBy}"
              name="${this.name || nothing}"
              @input="${this._onInput}"
            />`}
        <div id="${this._errorId}" class="input-error-live" role="alert" aria-live="polite" aria-atomic="true">
          ${this.error ? html`<span class="input-error-message">${this.error}</span>` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-input': CandorInput; }
}
