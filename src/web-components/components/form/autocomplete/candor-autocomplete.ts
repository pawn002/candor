import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../../utils/host-aria';

let _nextId = 0;

/**
 * A free-text input that offers non-binding suggestions as the user types —
 * the web-component analogue of a native `<input list>` + `<datalist>`.
 *
 * The distinction from `candor-combobox` is the whole point of this component:
 * here the committed value is ALWAYS the raw text the user typed. Suggestions
 * are hints, never a constraint — the user may pick one or ignore them and type
 * anything. `candor-combobox`, by contrast, constrains the value to its option
 * set and emits the chosen `ComboboxOption`. Reach for autocomplete when the
 * field accepts open input but a known set of values is worth surfacing (model
 * names discovered from an endpoint, previously-used tags, common cities).
 *
 * Events follow the Candor two-event rule (see events.ts / #164): `input` fires
 * the live text on every keystroke; `change` fires the committed text on blur,
 * on Enter, and when a suggestion is chosen. Both carry a plain string — the
 * same shape as candor-input — because the value is always free text.
 *
 * See `candor-select` for the four-way comparison across all the pickers.
 *
 * @fires input - detail: string — the live text, on every keystroke
 * @fires change - detail: string — the committed text, on blur, Enter, or suggestion choice
 */
@customElement('candor-autocomplete')
export class CandorAutocomplete extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .autocomplete-wrapper {
      display: flex; flex-direction: column; gap: var(--spacing-xs); position: relative;
    }
    .autocomplete-wrapper--disabled .autocomplete__label { color: var(--color-text-disabled); }
    .autocomplete__label {
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold); color: var(--color-text-default); letter-spacing: var(--letter-spacing-relaxed);
    }
    .autocomplete__required { color: var(--color-status-error-text); margin-left: 0.25em; }
    .autocomplete__control { position: relative; display: flex; align-items: center; }
    .autocomplete__input {
      width: 100%; min-height: var(--hit-target-aaa);
      padding: var(--candor-autocomplete-padding-y, var(--spacing-input-padding-y)) var(--candor-autocomplete-padding-x, var(--spacing-input-padding-x));
      font-family: var(--font-family-base); font-size: var(--candor-autocomplete-font-size, var(--font-size-md));
      color: var(--color-text-default); background-color: var(--color-bg-page);
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--candor-autocomplete-radius, var(--radius-md)); box-sizing: border-box;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .autocomplete__input::placeholder { color: var(--color-text-subtle); }
    .autocomplete__input:hover:not(:disabled) { border-color: var(--color-text-subtle); }
    .autocomplete__input:focus {
      outline: none; border-color: var(--color-action-primary);
      box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-action-primary) l c h / 0.2);
    }
    .autocomplete__input:disabled {
      background-color: var(--color-bg-surface); color: var(--color-text-disabled);
      border-color: var(--color-border-default); cursor: not-allowed;
    }
    .autocomplete__control--error .autocomplete__input { border-color: var(--color-status-error); }
    .autocomplete__control--error .autocomplete__input:focus {
      border-color: var(--color-status-error);
      box-shadow: 0 0 0 var(--focus-ring-width) oklch(from var(--color-status-error) l c h / 0.2);
    }
    .autocomplete__dropdown {
      position: absolute; top: calc(100% + var(--spacing-2xs)); left: 0; right: 0; z-index: 200;
      margin: 0; max-height: 16rem; overflow-y: auto;
      background: var(--color-bg-elevated);
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md); box-shadow: var(--shadow-modal); padding: var(--spacing-2xs) 0;
      list-style: none;
    }
    .autocomplete__option {
      display: flex; align-items: center;
      padding: var(--spacing-input-padding-y) var(--spacing-input-padding-x);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); cursor: pointer; user-select: none;
    }
    .autocomplete__option--active { background-color: var(--color-bg-surface); }
    .autocomplete__option-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .autocomplete__hint {
      margin-top: calc(-1 * var(--spacing-xs));
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      letter-spacing: var(--letter-spacing-italic); color: var(--color-text-subtle);
    }
    .autocomplete__description {
      font-family: var(--font-family-accessible); font-size: var(--font-size-sm);
      letter-spacing: var(--letter-spacing-italic); min-height: var(--hit-target-aa);
    }
    .autocomplete__error { color: var(--color-status-error-text); font-size: var(--font-size-md); }
  `;

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property() error = '';
  @property() hint = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  /** Non-binding suggestions surfaced as the user types. The value is never
   * constrained to this list — picking one just fills the field. */
  @property({ type: Array }) suggestions: string[] = [];
  /** Cap on how many filtered suggestions to show at once (discovered lists can
   * be long). 0 or negative means no cap. */
  @property({ type: Number, attribute: 'max-suggestions' }) maxSuggestions = 8;

  @state() private _open = false;
  @state() private _activeIndex = -1;
  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;

  @query('.autocomplete__input') private _input!: HTMLInputElement;

  private _id = _nextId++;
  private _inputId = `candor-autocomplete-input-${this._id}`;
  private _listId = `candor-autocomplete-list-${this._id}`;
  private _hintId = `candor-autocomplete-hint-${this._id}`;
  private _errId = `candor-autocomplete-err-${this._id}`;

  private get _filtered(): string[] {
    const q = this.value.trim().toLowerCase();
    // On an empty field show everything (datalist-on-focus behaviour); once the
    // user types, substring-filter but never hide an exact match of what they
    // typed — the suggestion is a hint, not a gate.
    const matches = q
      ? this.suggestions.filter((s) => s.toLowerCase().includes(q))
      : this.suggestions;
    return this.maxSuggestions > 0 ? matches.slice(0, this.maxSuggestions) : matches;
  }

  private get _activeOptionId(): string {
    return this._activeIndex >= 0
      ? `candor-autocomplete-opt-${this._id}-${this._activeIndex}`
      : '';
  }

  private _commit() {
    this._internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
  }

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this._open = true;
    this._activeIndex = -1;
    this._internals.setFormValue(this.value);
    // The inner field's native `input` is composed and would escape the shadow
    // root on its own — stop it so consumers get exactly one typed `input`.
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('input', { detail: this.value, bubbles: true, composed: true }));
  }

  /** Native `change` (blur / Enter without an active suggestion) — composed:false,
   * so it never escapes the shadow root; we re-dispatch the committed value. */
  private _onNativeChange(e: Event) {
    e.stopPropagation();
    this._commit();
  }

  private _select(suggestion: string) {
    this.value = suggestion;
    this._open = false;
    this._activeIndex = -1;
    this._commit();
    this._input?.focus();
  }

  private _onKeydown(e: KeyboardEvent) {
    const opts = this._filtered;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this._open && opts.length) { this._open = true; }
        this._activeIndex = Math.min(this._activeIndex + 1, opts.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._activeIndex = Math.max(this._activeIndex - 1, -1);
        break;
      case 'Enter':
        // Only intercept Enter to accept a highlighted suggestion; otherwise let
        // it through so the field commits / submits its form naturally.
        if (this._open && this._activeIndex >= 0 && opts[this._activeIndex]) {
          e.preventDefault();
          this._select(opts[this._activeIndex]);
        }
        break;
      case 'Escape':
        // Close the list but keep the typed value — free text is never discarded.
        if (this._open) { e.stopPropagation(); this._open = false; this._activeIndex = -1; }
        break;
    }
  }

  private _onDocumentClick = (e: MouseEvent) => {
    if (this._open && !this.contains(e.target as Node)) {
      this._open = false;
      this._activeIndex = -1;
    }
  };

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this._internals.setFormValue(this.value);
    }
    if (changed.has('value') || changed.has('required')) {
      if (this.required && !this.value) {
        this._internals.setValidity({ valueMissing: true }, 'Please fill in this field', this._input);
      } else {
        this._internals.setValidity({});
      }
    }
  }

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
    const filtered = this._filtered;
    const describedBy = [this.hint ? this._hintId : '', this._errId].filter(Boolean).join(' ');
    const open = this._open && filtered.length > 0;
    return html`
      <div class="autocomplete-wrapper ${this.disabled ? 'autocomplete-wrapper--disabled' : ''}">
        ${this.label ? html`
          <label part="label" for="${this._inputId}" class="autocomplete__label">
            ${this.label}
            ${this.required ? html`<span class="autocomplete__required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        ${this.hint ? html`<span part="hint" id="${this._hintId}" class="autocomplete__hint">${this.hint}</span>` : nothing}
        <div style="position:relative">
          <div class="autocomplete__control ${this.error ? 'autocomplete__control--error' : ''}">
            <input
              part="input"
              id="${this._inputId}"
              class="autocomplete__input"
              type="text"
              role="combobox"
              autocomplete="off"
              aria-label="${this._ariaLabel || nothing}"
              aria-autocomplete="list"
              aria-expanded="${open}"
              aria-controls="${this._listId}"
              aria-activedescendant="${this._activeOptionId || nothing}"
              aria-required="${this.required || nothing}"
              aria-invalid="${this.error ? 'true' : nothing}"
              aria-describedby="${describedBy}"
              .value="${this.value}"
              placeholder="${this.placeholder}"
              ?disabled="${this.disabled}"
              @input="${this._onInput}"
              @change="${this._onNativeChange}"
              @focus="${() => { if (this._filtered.length) this._open = true; }}"
              @click="${() => { if (this._filtered.length) this._open = true; }}"
              @keydown="${this._onKeydown}"
            >
          </div>
          ${open ? html`
            <ul id="${this._listId}" role="listbox" class="autocomplete__dropdown">
              ${filtered.map((s, i) => html`
                <li
                  id="candor-autocomplete-opt-${this._id}-${i}"
                  role="option"
                  class="autocomplete__option ${i === this._activeIndex ? 'autocomplete__option--active' : ''}"
                  aria-selected="${i === this._activeIndex}"
                  @mousedown="${(e: Event) => { e.preventDefault(); this._select(s); }}"
                  @mouseenter="${() => this._activeIndex = i}"
                >
                  <span class="autocomplete__option-label">${s}</span>
                </li>
              `)}
            </ul>
          ` : nothing}
        </div>
        <span part="error-message" id="${this._errId}" class="autocomplete__description autocomplete__error" role="alert">${this.error}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-autocomplete': CandorAutocomplete; }
}
