import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../../utils/host-aria';

/**
 * Single- or multi-line text entry. Set `multiline` to render a `<textarea>`
 * instead of an `<input>`; `rows` and `resize` apply only in that mode.
 *
 * Two events, and the distinction is the usual one: `input` fires the live value
 * on every keystroke, `change` fires the committed value on blur. Both carry a
 * plain string in `detail`. There is no `changed` event — a listener bound to
 * that name never fires and nothing reports it.
 *
 * `error` renders the message in a pre-established live region and sets
 * `aria-invalid`, so assign it reactively rather than conditionally rendering
 * the element. Validation errors render at 16px here, which is deliberate:
 * must-read text is Tier 1, and Tier 1 regular text below 16px cannot meet its
 * contrast floor in any chromatic colour (#240). Prefer this built-in `error`
 * over a hand-placed message, which is easy to size at 14px by accident.
 *
 * `hint` is for standing guidance (format, constraints). A **disabled** input
 * must carry one explaining the lock — permission boundary, system constraint,
 * or something the user can change elsewhere — because a greyed field with no
 * explanation reads as broken.
 *
 * **Prefer `label` — but `aria-label` on the host works too**, mirrored onto the
 * inner control and stripped from the host so the name is announced once. Where
 * both are set the `aria-label` wins outright, so make it *contain* the visible
 * label text (WCAG 2.5.3) rather than replacing it with something unrelated.
 * Setting neither leaves the control unnamed, and nothing reports that.
 *
 * @fires input - detail: string — the live value, on every keystroke
 * @fires change - detail: string — the committed value, on blur
 */
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
      font-size: var(--candor-input-font-size, var(--font-size-md));
      padding: var(--candor-input-padding-y, var(--spacing-input-padding-y)) var(--candor-input-padding-x, var(--spacing-input-padding-x));
      border: var(--border-width-thin) solid var(--color-border-control);
      border-radius: var(--candor-input-radius, var(--radius-md));
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
  @property() autocomplete?: string;

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming — see utils/host-aria.ts).
  @state() private _ariaLabel?: string;
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

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
    // The inner control's native `input` is composed and would escape the shadow
    // root on its own — stop it so consumers don't get it *and* our typed event.
    e.stopPropagation();
    // Live value stream — fires on every keystroke, mirroring the native
    // `input` event but carrying the value as `detail` (see events.ts / #164).
    this.dispatchEvent(new CustomEvent('input', { detail: this.value, bubbles: true, composed: true }));
  }

  private _onChange() {
    // Committed value — fires on blur/Enter, mirroring the native `change`
    // event (see events.ts / #164).
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
  }

  override render() {
    const inputCls = ['input', this.error ? 'input--error' : '', this.multiline ? 'input--textarea' : ''].filter(Boolean).join(' ');
    const describedBy = [this.hint ? this._hintId : '', this._errorId].filter(Boolean).join(' ');
    return html`
      <div class="input-wrapper">
        ${this.label ? html`
          <label part="label" class="input-label" for="${this._id}">
            ${this.label}
            ${this.required ? html`<span class="input-required" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}
        ${this.hint ? html`<span part="hint" id="${this._hintId}" class="input-hint">${this.hint}</span>` : nothing}
        ${this.multiline
          ? html`<textarea
              part="input"
              id="${this._id}"
              class="${inputCls}"
              .rows="${this.rows}"
              style="resize:${this.resize}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
              .placeholder="${this.placeholder || ''}"
              .value="${this.value}"
              aria-label="${this._ariaLabel || nothing}"
              aria-invalid="${this.error ? 'true' : nothing}"
              aria-describedby="${describedBy}"
              name="${this.name || nothing}"
              autocomplete="${this.autocomplete || nothing}"
              @input="${this._onInput}"
              @change="${this._onChange}"
            ></textarea>`
          : html`<input
              part="input"
              id="${this._id}"
              class="${inputCls}"
              type="${this.type}"
              ?disabled="${this.disabled}"
              ?required="${this.required}"
              .placeholder="${this.placeholder || ''}"
              .value="${this.value}"
              aria-label="${this._ariaLabel || nothing}"
              aria-invalid="${this.error ? 'true' : nothing}"
              aria-describedby="${describedBy}"
              name="${this.name || nothing}"
              autocomplete="${this.autocomplete || nothing}"
              @input="${this._onInput}"
              @change="${this._onChange}"
            />`}
        <div id="${this._errorId}" class="input-error-live" role="alert" aria-live="polite" aria-atomic="true">
          ${this.error ? html`<span part="error-message" class="input-error-message">${this.error}</span>` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-input': CandorInput; }
}
