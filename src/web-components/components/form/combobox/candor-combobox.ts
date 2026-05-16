import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { phCaretDownBold } from '../../../icons';

export interface ComboboxOption {
  value: string;
  label: string;
}

let _nextId = 0;

@customElement('candor-combobox')
export class CandorCombobox extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .combobox-wrapper {
      display: flex; flex-direction: column; gap: var(--spacing-xs); position: relative;
    }
    .combobox-wrapper--disabled .combobox__label { color: var(--color-text-disabled); }
    .combobox__label {
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold); color: var(--color-text-default); letter-spacing: 0.02em;
    }
    .combobox__required { color: var(--color-status-error); margin-left: 0.25em; }
    .combobox__control { position: relative; display: flex; align-items: center; }
    .combobox__input {
      width: 100%; min-height: 2.5rem;
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      padding-right: calc(var(--spacing-input-padding-x) + 1.75rem);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); background-color: var(--color-bg-page);
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--radius-md); box-sizing: border-box;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .combobox__input::placeholder { color: var(--color-text-subtle); }
    .combobox__input:hover:not(:disabled) { border-color: var(--color-text-subtle); }
    .combobox__input:focus {
      outline: none; border-color: var(--color-action-primary);
      box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-action-primary) l c h / 0.2);
    }
    .combobox__input:disabled {
      background-color: var(--color-bg-surface); color: var(--color-text-disabled);
      border-color: var(--color-border-default); cursor: not-allowed;
    }
    .combobox__control--error .combobox__input { border-color: var(--color-status-error); }
    .combobox__control--error .combobox__input:focus {
      border-color: var(--color-status-error);
      box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-status-error) l c h / 0.2);
    }
    .combobox__caret {
      position: absolute; right: var(--spacing-input-padding-x);
      width: 1rem; height: 1rem; color: var(--color-text-subtle); pointer-events: none;
      transition: transform 200ms ease, color 200ms ease;
    }
    .combobox__caret--open { transform: rotate(180deg); color: var(--color-action-primary); }
    .combobox__control:focus-within .combobox__caret { color: var(--color-action-primary); }
    .combobox__dropdown {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 200;
      max-height: 16rem; overflow-y: auto;
      background: var(--color-bg-elevated);
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md); box-shadow: var(--shadow-modal); padding: 0.25rem 0;
    }
    .combobox__option {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); cursor: pointer; user-select: none; gap: var(--spacing-xs);
    }
    .combobox__option--active { background-color: var(--color-bg-surface); }
    .combobox__option--selected { color: var(--color-action-primary); font-weight: var(--font-weight-medium); }
    .combobox__option-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .combobox__option-check { flex-shrink: 0; color: var(--color-action-primary); font-size: 1rem; }
    .combobox__no-results {
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-subtle); font-style: italic;
    }
    .combobox__description {
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      letter-spacing: 0.02em; min-height: 1.25em;
    }
    .combobox__error { color: var(--color-status-error); }
    .combobox__hint { color: var(--color-text-subtle); }
  `;

  @property() label = '';
  @property() value = '';
  @property() placeholder = 'Search…';
  @property() error = '';
  @property() hint = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Array }) options: ComboboxOption[] = [];

  @state() private _inputValue = '';
  @state() private _open = false;
  @state() private _activeIndex = -1;

  @query('.combobox__input') private _input!: HTMLInputElement;

  private _id = _nextId++;
  private _inputId = `candor-combobox-input-${this._id}`;
  private _listId = `candor-combobox-list-${this._id}`;

  private get _filtered(): ComboboxOption[] {
    if (!this._inputValue) return this.options;
    const q = this._inputValue.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  private get _activeOptionId(): string {
    return this._activeIndex >= 0
      ? `candor-combobox-opt-${this._id}-${this._activeIndex}`
      : '';
  }

  private _onInput(e: Event) {
    this._inputValue = (e.target as HTMLInputElement).value;
    this._open = true;
    this._activeIndex = -1;
    if (!this._inputValue) {
      this.value = '';
      this._internals.setFormValue('');
    }
  }

  private _select(opt: ComboboxOption) {
    this.value = opt.value;
    this._inputValue = opt.label;
    this._internals.setFormValue(opt.value);
    this.dispatchEvent(new CustomEvent('change', { detail: opt, bubbles: true, composed: true }));
    this._open = false;
    this._activeIndex = -1;
  }

  private _clear() {
    this.value = '';
    this._inputValue = '';
    this._internals.setFormValue('');
    this._open = false;
    this._input?.focus();
  }

  private _onKeydown(e: KeyboardEvent) {
    const opts = this._filtered;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._open = true;
        this._activeIndex = Math.min(this._activeIndex + 1, opts.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._activeIndex = Math.max(this._activeIndex - 1, -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (this._activeIndex >= 0 && opts[this._activeIndex]) {
          this._select(opts[this._activeIndex]);
        }
        break;
      case 'Escape':
        this._open = false;
        break;
    }
  }

  private _onDocumentClick = (e: MouseEvent) => {
    if (this._open && !this.contains(e.target as Node)) this._open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onDocumentClick);
  }

  override render() {
    const filtered = this._filtered;
    return html`
      <div class="combobox-wrapper ${this.disabled ? 'combobox-wrapper--disabled' : ''}">
        ${this.label ? html`
          <label for="${this._inputId}" class="combobox__label">
            ${this.label}
            ${this.required ? html`<span class="combobox__required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        <div style="position:relative">
          <div class="combobox__control ${this.error ? 'combobox__control--error' : ''}">
            <input
              id="${this._inputId}"
              class="combobox__input"
              type="text"
              role="combobox"
              autocomplete="off"
              aria-autocomplete="list"
              aria-expanded="${this._open}"
              aria-controls="${this._listId}"
              aria-activedescendant="${this._activeOptionId || nothing}"
              aria-required="${this.required || nothing}"
              aria-invalid="${this.error ? 'true' : nothing}"
              .value="${this._inputValue}"
              placeholder="${this.placeholder}"
              ?disabled="${this.disabled}"
              @input="${this._onInput}"
              @focus="${() => { this._open = true; }}"
              @keydown="${this._onKeydown}"
            >
            <svg class="combobox__caret ${this._open ? 'combobox__caret--open' : ''}" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
          </div>
          ${this._open && filtered.length > 0 ? html`
            <ul id="${this._listId}" role="listbox" class="combobox__dropdown">
              ${filtered.map((opt, i) => html`
                <li
                  id="candor-combobox-opt-${this._id}-${i}"
                  role="option"
                  class="combobox__option
                    ${i === this._activeIndex ? 'combobox__option--active' : ''}
                    ${opt.value === this.value ? 'combobox__option--selected' : ''}"
                  aria-selected="${opt.value === this.value}"
                  @mousedown="${(e: Event) => { e.preventDefault(); this._select(opt); }}"
                  @mouseenter="${() => this._activeIndex = i}"
                >
                  <span class="combobox__option-label">${opt.label}</span>
                  ${opt.value === this.value ? html`<span class="combobox__option-check" aria-hidden="true">✓</span>` : nothing}
                </li>
              `)}
            </ul>
          ` : this._open && this._inputValue && filtered.length === 0 ? html`
            <div class="combobox__dropdown">
              <div class="combobox__no-results">No results for "${this._inputValue}"</div>
            </div>
          ` : nothing}
        </div>
        ${this.error
          ? html`<span class="combobox__description combobox__error" role="alert">${this.error}</span>`
          : this.hint
            ? html`<span class="combobox__description combobox__hint">${this.hint}</span>`
            : html`<span class="combobox__description"></span>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-combobox': CandorCombobox; }
}
