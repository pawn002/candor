import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { phCaretDownBold } from '../../../icons';
import { observeHostAriaLabel } from '../../../utils/host-aria';

export interface ListboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

let _nextId = 0;

@customElement('candor-listbox')
export class CandorListbox extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .listbox-wrapper {
      display: flex; flex-direction: column; gap: var(--spacing-xs); position: relative;
    }
    .listbox-wrapper--disabled .listbox__label { color: var(--color-text-disabled); }
    .listbox__label {
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold); color: var(--color-text-default); letter-spacing: var(--letter-spacing-relaxed);
    }
    .listbox__required { color: var(--color-status-error-text); margin-left: 0.25em; }
    .listbox__hint {
      margin-top: calc(-1 * var(--spacing-xs));
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      letter-spacing: var(--letter-spacing-italic); color: var(--color-text-subtle);
    }
    .listbox__trigger {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; min-height: var(--hit-target-aaa);
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); background-color: var(--color-bg-page);
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--radius-md); cursor: pointer; text-align: left;
      gap: var(--spacing-xs); transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .listbox__trigger:hover:not(:disabled) { border-color: var(--color-text-subtle); }
    .listbox__trigger:focus-visible {
      outline: none; border-color: var(--color-action-primary);
      box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-action-primary) l c h / 0.2);
    }
    .listbox__trigger--error { border-color: var(--color-status-error); }
    .listbox__trigger--error:focus-visible {
      border-color: var(--color-status-error);
      box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-status-error) l c h / 0.2);
    }
    .listbox__trigger:disabled {
      background-color: var(--color-bg-surface); color: var(--color-text-disabled);
      border-color: var(--color-border-default); cursor: not-allowed;
    }
    .listbox__trigger-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .listbox__caret {
      flex-shrink: 0; width: 1rem; height: 1rem; color: var(--color-text-subtle);
      transition: transform 200ms ease, color 200ms ease;
    }
    .listbox__caret--open { transform: rotate(180deg); color: var(--color-action-primary); }
    .listbox__trigger:disabled .listbox__caret { color: var(--color-text-disabled); }
    .listbox__dropdown {
      position: absolute; top: calc(100% + var(--spacing-2xs)); left: 0; right: 0; z-index: 200;
      margin: 0; max-height: 16rem; overflow-y: auto;
      background: var(--color-bg-elevated);
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md); box-shadow: var(--shadow-modal); padding: var(--spacing-2xs) 0;
    }
    .listbox__option {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); cursor: pointer; user-select: none; gap: var(--spacing-xs);
    }
    .listbox__option--active { background-color: var(--color-bg-surface); }
    .listbox__option--selected { color: var(--color-action-primary); font-weight: var(--font-weight-medium); }
    .listbox__option--active.listbox__option--selected { background-color: var(--color-bg-surface); }
    .listbox__option--disabled { color: var(--color-text-disabled); cursor: not-allowed; pointer-events: none; }
    .listbox__option-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .listbox__option-check { flex-shrink: 0; color: var(--color-action-primary); font-size: 1rem; }
    .listbox__error-live { display: contents; }
    .listbox__error-message {
      font-family: var(--font-family-accessible); font-size: var(--font-size-md);
      letter-spacing: var(--letter-spacing-italic); color: var(--color-status-error-text);
    }
  `;

  @property() label = '';
  @property() value = '';
  @property() placeholder = 'Select an option';
  @property() error = '';
  @property() hint = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Array }) options: ListboxOption[] = [];

  @state() private _open = false;
  @state() private _activeIndex = -1;
  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;

  @query('button') private _trigger?: HTMLButtonElement;

  private _id = _nextId++;
  private _triggerId = `candor-listbox-trigger-${this._id}`;
  private _listId = `candor-listbox-list-${this._id}`;
  private _hintId = `candor-listbox-hint-${this._id}`;
  private _errId = `candor-listbox-err-${this._id}`;

  private get _selectedOption(): ListboxOption | undefined {
    return this.options.find(o => o.value === this.value);
  }

  private get _activeOptionId(): string {
    return this._activeIndex >= 0
      ? `candor-listbox-opt-${this._id}-${this._activeIndex}`
      : '';
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('options')) {
      this._internals.setFormValue(this.value || null);
    }
    if (changed.has('value') || changed.has('required')) {
      if (this.required && !this.value) {
        this._internals.setValidity({ valueMissing: true }, 'Please select an option', this._trigger);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  private _open_() {
    if (this.disabled) return;
    this._open = true;
    const idx = this.options.findIndex(o => o.value === this.value);
    this._activeIndex = idx >= 0 ? idx : 0;
  }

  private _close() {
    this._open = false;
    this._activeIndex = -1;
    this.shadowRoot?.getElementById(this._triggerId)?.focus();
  }

  private _select(opt: ListboxOption) {
    if (opt.disabled) return;
    this.value = opt.value;
    this._internals.setFormValue(opt.value);
    this.dispatchEvent(new CustomEvent('change', { detail: opt, bubbles: true, composed: true }));
    this._close();
  }

  private _onTriggerKeydown(e: KeyboardEvent) {
    if (['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); this._open_(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this._open_(); }
    else if (e.key === 'Escape') this._close();
  }

  private _onListKeydown(e: KeyboardEvent) {
    const cur = this._activeIndex;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._activeIndex = Math.min(cur + 1, this.options.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._activeIndex = Math.max(cur - 1, 0);
        break;
      case 'Home': e.preventDefault(); this._activeIndex = 0; break;
      case 'End': e.preventDefault(); this._activeIndex = this.options.length - 1; break;
      case 'Enter': case ' ':
        e.preventDefault();
        if (cur >= 0) this._select(this.options[cur]);
        break;
      case 'Escape': case 'Tab': this._close(); break;
    }
  }

  private _onDocumentClick = (e: MouseEvent) => {
    if (this._open && !this.contains(e.target as Node)) this._close();
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }
  override disconnectedCallback() {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
    document.removeEventListener('click', this._onDocumentClick);
  }

  override render() {
    const selected = this._selectedOption;
    const describedBy = [this.hint ? this._hintId : '', this._errId].filter(Boolean).join(' ');
    return html`
      <div class="listbox-wrapper ${this.disabled ? 'listbox-wrapper--disabled' : ''}">
        ${this.label ? html`
          <label id="${this._triggerId}-label" class="listbox__label">
            ${this.label}
            ${this.required ? html`<span class="listbox__required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        ${this.hint ? html`<span id="${this._hintId}" class="listbox__hint">${this.hint}</span>` : nothing}
        <div style="position:relative">
          <button
            id="${this._triggerId}"
            class="listbox__trigger ${this.error ? 'listbox__trigger--error' : ''}"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded="${this._open}"
            aria-controls="${this._listId}"
            aria-labelledby="${this.label ? this._triggerId + '-label' : nothing}"
            aria-label="${this._ariaLabel || nothing}"
            aria-required="${this.required || nothing}"
            aria-invalid="${this.error ? 'true' : nothing}"
            aria-describedby="${describedBy}"
            ?disabled="${this.disabled}"
            @click="${() => this._open ? this._close() : this._open_()}"
            @keydown="${this._onTriggerKeydown}"
          >
            <span class="listbox__trigger-text">
              ${selected ? selected.label : html`<span style="color:var(--color-text-subtle)">${this.placeholder}</span>`}
            </span>
            <svg class="listbox__caret ${this._open ? 'listbox__caret--open' : ''}" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
          </button>
          ${this._open ? html`
            <ul
              id="${this._listId}"
              role="listbox"
              class="listbox__dropdown"
              aria-activedescendant="${this._activeOptionId || nothing}"
              tabindex="-1"
              @keydown="${this._onListKeydown}"
            >
              ${this.options.map((opt, i) => html`
                <li
                  id="candor-listbox-opt-${this._id}-${i}"
                  role="option"
                  class="listbox__option
                    ${i === this._activeIndex ? 'listbox__option--active' : ''}
                    ${opt.value === this.value ? 'listbox__option--selected' : ''}
                    ${opt.disabled ? 'listbox__option--disabled' : ''}"
                  aria-selected="${opt.value === this.value}"
                  aria-disabled="${opt.disabled || nothing}"
                  @click="${() => this._select(opt)}"
                  @mouseenter="${() => this._activeIndex = i}"
                >
                  <span class="listbox__option-label">${opt.label}</span>
                  ${opt.value === this.value ? html`<span class="listbox__option-check" aria-hidden="true">✓</span>` : nothing}
                </li>
              `)}
            </ul>
          ` : nothing}
        </div>
        <div id="${this._errId}" class="listbox__error-live" role="alert" aria-live="polite" aria-atomic="true">
          ${this.error ? html`<span class="listbox__error-message">${this.error}</span>` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-listbox': CandorListbox; }
}
