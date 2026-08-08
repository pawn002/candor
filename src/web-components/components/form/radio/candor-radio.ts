import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../../utils/host-aria';

/**
 * A single radio button. **Groups are resolved structurally, not by `name`** —
 * this is the one thing to know before using it.
 *
 * Each radio lives in its own shadow root, so the browser cannot tie
 * shared-`name` inputs into a mutually-exclusive, arrow-navigable set the way it
 * does for native inputs. The component reimplements both behaviours by querying
 * sibling `candor-radio[name="…"]` elements within a scope — and that scope is
 * `closest('fieldset')`, falling back to `parentElement`.
 *
 * The practical consequence: wrap every group in a `<fieldset>` with a
 * `<legend>`. Any real layout puts each option in its own wrapper element, and
 * without the fieldset the scope collapses to that wrapper — so each radio sees
 * only itself. **Arrow-key navigation and mutual exclusion both stop, silently.**
 * No error is raised, nothing is logged, and the control still looks correct.
 *
 * ```html
 * <fieldset>
 *   <legend>Notification frequency</legend>
 *   <div><candor-radio name="freq" value="all" label="Everything"></candor-radio></div>
 *   <div><candor-radio name="freq" value="none" label="Nothing"></candor-radio></div>
 * </fieldset>
 * ```
 *
 * The `<legend>` is not decorative: it is what names the group for assistive
 * technology, and each radio's own label names only the option.
 *
 * `aria-label` on the host is mirrored onto the inner input and stripped from
 * the host, the same as every other Candor form control. Note what it names,
 * though: **this one option, not the group.** A group with no `<legend>` is not
 * fixed by putting `aria-label` on its radios — that renames the options and
 * leaves the group anonymous.
 *
 * A disabled radio needs an adjacent explanation of why — a locked control with
 * no reason reads as broken. See the disabled-hint convention in CLAUDE.md.
 *
 * @fires change - detail: string — this radio's `value`, when the user selects it
 */
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
      letter-spacing: var(--letter-spacing-italic);
    }
  `;

  @property() label?: string;
  @property() value = '';
  /**
   * Group identity — but **not** the grouping mechanism, unlike a native
   * `<input type="radio">`. Radios with the same `name` are only tied together
   * if they also share a `<fieldset>` (see the class comment): `name` selects
   * the siblings, the fieldset bounds the search. Setting `name` alone on radios
   * in separate wrappers produces a group that silently does not group.
   *
   * Leaving it unset opts out of grouping entirely — `_groupSiblings` returns
   * empty, so arrow keys and mutual exclusion do nothing.
   */
  @property() name?: string;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

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

  private _id = `candor-radio-${Math.random().toString(36).slice(2, 9)}`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('checked') || changed.has('value')) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  private _onChange(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      this._select();
    }
  }

  // KB-1 fix: bridges the gap left by native radio grouping not working across
  // shadow-DOM boundaries. Each <candor-radio> lives in its own shadow root, so
  // the browser can't tie sibling inputs with a shared `name` into a single
  // arrow-navigable group. We re-implement the APG Radio Group keyboard model:
  // ArrowDown/Right → next, ArrowUp/Left → previous (both wrap), Home/End jump
  // to first/last in-group, disabled siblings are skipped, and focus + selection
  // move together to match native behavior.
  private _onKeydown(e: KeyboardEvent) {
    const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    const home = e.key === 'Home';
    const end = e.key === 'End';
    if (!fwd && !back && !home && !end) return;
    if (!this.name) return;

    const group = this._groupSiblings();
    if (group.length < 2) return;
    const idx = group.indexOf(this);
    if (idx < 0) return;

    let next: CandorRadio;
    if (home) next = group[0];
    else if (end) next = group[group.length - 1];
    else if (fwd) next = group[(idx + 1) % group.length];
    else next = group[(idx - 1 + group.length) % group.length];

    if (next === this) return;
    e.preventDefault();
    next._selectAndFocus();
  }

  private _groupSiblings(): CandorRadio[] {
    if (!this.name) return [];
    const scope = this.closest('fieldset') || this.parentElement || document;
    return Array.from(
      scope.querySelectorAll<CandorRadio>(`candor-radio[name="${CSS.escape(this.name)}"]`),
    ).filter((r) => !r.disabled);
  }

  private _select() {
    // Native radio mutual exclusion doesn't cross shadow-DOM boundaries —
    // each <candor-radio> has its own shadow root so the browser can't see
    // the sibling inputs as a group. Uncheck siblings explicitly so checking
    // this one actually means "exclusively this one." Applies to both the
    // click/change path and the keyboard-nav path.
    for (const r of this._groupSiblings()) {
      if (r !== this && r.checked) {
        r.checked = false;
        r._internals.setFormValue(null);
      }
    }
    this.checked = true;
    this._internals.setFormValue(this.value);
    this.dispatchEvent(new CustomEvent('change', { detail: this.value, bubbles: true, composed: true }));
  }

  private _selectAndFocus() {
    this._select();
    this.shadowRoot?.querySelector<HTMLInputElement>('input')?.focus();
  }

  override render() {
    return html`
      <label class="radio-wrapper ${this.disabled ? 'radio-wrapper--disabled' : ''}" for="${this._id}">
        <input
          class="radio-input"
          type="radio"
          id="${this._id}"
          .value="${this.value}"
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          aria-label="${this._ariaLabel || nothing}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
          @keydown="${this._onKeydown}"
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
