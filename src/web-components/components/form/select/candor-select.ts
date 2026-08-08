import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { phCaretDownBold } from '../../../icons';
import { observeHostAriaLabel } from '../../../utils/host-aria';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * A dropdown backed by a **native `<select>`**. Options come from the `options`
 * array, not from slotted `<option>` markup.
 *
 * Candor has four option-pickers and they are easy to confuse. The axes are
 * whether the value is constrained to the option set, and what arrives in
 * `change.detail`:
 *
 * | | constrained | filterable | `change.detail` |
 * |---|---|---|---|
 * | `candor-select` | yes | no | `string` |
 * | `candor-listbox` | yes | no | `ListboxOption` |
 * | `candor-combobox` | yes | yes | `ComboboxOption \| null` |
 * | `candor-autocomplete` | no | yes | `string` |
 *
 * Reach for this one first. Being a real `<select>`, it gets the platform's own
 * picker — which on mobile is a native wheel or sheet that no custom popup
 * matches for usability, and which needs no focus-trap or dismiss handling.
 * Choose `candor-listbox` only when the trigger or options need styling the
 * native control does not allow.
 *
 * `aria-label` on the host is supported: it is mirrored inward and stripped from
 * the host so the name is announced once.
 *
 * A disabled select must carry a `hint` explaining the lock — commonly this
 * control is disabled because it has no options yet, which is invisible to the
 * user unless said.
 *
 * @fires change - detail: string — the selected option's `value`
 */
@customElement('candor-select')
export class CandorSelect extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .select-wrapper { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .select-label { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); display: flex; gap: var(--spacing-xs); letter-spacing: var(--letter-spacing-relaxed); }
    .select-required { color: var(--color-status-error-text); }
    .select-hint {
      margin-top: calc(-1 * var(--spacing-xs));
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      letter-spacing: var(--letter-spacing-italic); color: var(--color-text-subtle);
    }
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
      min-height: var(--hit-target-aaa);
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
    .select-error-live { display: contents; }
    .select-error-message {
      font-family: var(--font-family-accessible); font-size: var(--font-size-md);
      letter-spacing: var(--letter-spacing-italic); color: var(--color-status-error-text);
    }
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

  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;
  @query('select') private _select?: HTMLSelectElement;

  private _id = `candor-select-${Math.random().toString(36).slice(2, 9)}`;
  private _hintId = `${this._id}-hint`;
  private _errId = `${this._id}-err`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('options')) {
      this._internals.setFormValue(this.value || null);
    }
    if (changed.has('value') || changed.has('required')) {
      if (this.required && !this.value) {
        this._internals.setValidity({ valueMissing: true }, 'Please select an option', this._select);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback() {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

  private _onChange(e: Event) {
    this.value = (e.target as HTMLSelectElement).value;
    this._internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
  }

  override render() {
    const describedBy = [this.hint ? this._hintId : '', this._errId].filter(Boolean).join(' ');
    return html`
      <div class="select-wrapper">
        ${this.label ? html`
          <label class="select-label" for="${this._id}">
            ${this.label}
            ${this.required ? html`<span class="select-required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        ${this.hint ? html`<span id="${this._hintId}" class="select-hint">${this.hint}</span>` : nothing}
        <div class="select-control ${this.error ? 'select-control--error' : ''} ${this.disabled ? 'select-control--disabled' : ''}">
          <select
            id="${this._id}"
            class="select ${this.error ? 'select--error' : ''}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            aria-invalid="${this.error ? 'true' : nothing}"
            aria-describedby="${describedBy}"
            aria-label="${this._ariaLabel || nothing}"
            name="${this.name || nothing}"
            @change="${this._onChange}"
          >
            ${this.placeholder ? html`<option value="" .selected="${!this.value}" disabled>${this.placeholder}</option>` : nothing}
            ${this.options.map(opt => html`
              <option value="${opt.value}" ?disabled="${opt.disabled || false}" .selected="${opt.value === this.value}">${opt.label}</option>
            `)}
          </select>
          <svg class="select__caret" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
        </div>
        <div id="${this._errId}" class="select-error-live" role="alert" aria-live="polite" aria-atomic="true">
          ${this.error ? html`<span class="select-error-message">${this.error}</span>` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-select': CandorSelect; }
}
