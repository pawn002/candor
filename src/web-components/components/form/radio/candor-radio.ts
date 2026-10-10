import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../../utils/host-aria';

/**
 * A single radio button. **Groups are resolved structurally, not by `name`** —
 * this is the one thing to know before using it.
 *
 * Each radio lives in its own shadow root, so the browser cannot tie
 * shared-`name` inputs into a mutually-exclusive, arrow-navigable set the way it
 * does for native inputs. The component reimplements that grouping by querying
 * sibling `candor-radio[name="…"]` elements within a scope — and that scope is
 * `closest('fieldset')`, falling back to `parentElement`. From the group it
 * supplies what the platform would have: mutual exclusion, arrow-key movement,
 * a single tab stop (the checked option, else the first enabled one), and each
 * option's position in the set, so a screen reader can say "2 of 5". A
 * `<fieldset>` holding only this group is given `role="radiogroup"` unless it
 * already carries a role.
 *
 * The practical consequence: wrap every group in a `<fieldset>` with a
 * `<legend>`. Any real layout puts each option in its own wrapper element, and
 * without the fieldset the scope collapses to that wrapper — so each radio sees
 * only itself. **Arrow-key navigation and mutual exclusion both stop.** The
 * control still looks correct; the one signal is a console warning, raised when
 * a named radio finds no other radio of that name in its group.
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
 * **Two slots, and they are not interchangeable (#263).** The default slot sits
 * *inside* the `<label>`, so whatever it holds becomes part of this control's
 * accessible name — use it for label text only, as an alternative to `label`.
 * Anything interactive (a help button, a link) goes in `slot="end"`, which
 * renders *beside* the label: projecting a `<button>` into the default slot
 * makes the document invalid (a `<label>` may hold only its own control) and
 * folds the button's text into the option's name, so a reader hears
 * "OKCA About OKCA, radio button" and then the button again.
 *
 * ```html
 * <candor-radio label="OKCA" name="metric" value="okca">
 *   <candor-button slot="end" variant="ghost" size="small">About OKCA</candor-button>
 * </candor-radio>
 * ```
 *
 * @slot - Label text, rendered inside the `<label>` and so part of the accessible name. Text only — see above.
 * @slot end - Content beside the option, outside its label — help buttons, links. Not part of the accessible name.
 * @fires change - detail: string — this radio's `value`, when the user selects it
 */
@customElement('candor-radio')
export class CandorRadio extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: inline-flex; align-items: center; gap: var(--spacing-sm); }
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

  // Group-derived state, written by whichever radio in the group last synced
  // (see _syncGroup). Undefined position/size means "not in a group" and
  // renders no aria-posinset/aria-setsize.
  @state() private _tabStop = true;
  @state() private _posInSet?: number;
  @state() private _setSize?: number;

  // The scope the group was resolved in, remembered so that a radio being
  // removed can still tell its former siblings to re-sync — once disconnected,
  // closest('fieldset') no longer finds anything.
  private _scope?: ParentNode;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
    this._syncGroup();
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    const scope = this._scope;
    const name = this.name;
    super.disconnectedCallback();
    if (scope && name) {
      scope.querySelector<CandorRadio>(`candor-radio[name="${CSS.escape(name)}"]`)?._syncGroup();
    }
  }

  override firstUpdated(): void {
    // A named radio that resolves a group of one is always a mistake, and the
    // failure is otherwise silent: arrow keys and mutual exclusion stop, and
    // nothing else changes (#262). Checked a frame later rather than now, so a
    // framework that attaches the element before setting `name` or appending
    // its siblings has finished — the case that rules out the equivalent
    // warning for an unnamed control.
    requestAnimationFrame(() => {
      if (!this.isConnected || !this.name) return;
      if (this._groupMembers().length < 2) {
        console.warn(
          `<candor-radio name="${this.name}"> found no other radio with that name in its group. ` +
          'Groups are resolved within the nearest <fieldset> (falling back to the parent element), ' +
          'so arrow keys and mutual exclusion will not work. Wrap the group in a <fieldset> with a <legend>.',
          this,
        );
      }
    });
  }

  private _id = `candor-radio-${Math.random().toString(36).slice(2, 9)}`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('checked') || changed.has('value')) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
    // Any of these can move the tab stop or change who is in the group — on
    // this radio's siblings as well as itself, which is why the sync is
    // group-wide rather than local.
    if (changed.has('checked') || changed.has('disabled') || changed.has('name')) {
      this._syncGroup();
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

  private _resolveScope(): ParentNode {
    return this.closest('fieldset') || this.parentElement || document;
  }

  /** Every radio in this group, in document order — disabled ones included. */
  private _groupMembers(): CandorRadio[] {
    if (!this.name) return [];
    return Array.from(
      this._resolveScope().querySelectorAll<CandorRadio>(`candor-radio[name="${CSS.escape(this.name)}"]`),
    );
  }

  /** The members a keyboard user can move to and select: enabled ones only. */
  private _groupSiblings(): CandorRadio[] {
    return this._groupMembers().filter((r) => !r.disabled);
  }

  /**
   * Recompute the group-wide state on every member: which one is the group's
   * single tab stop, and each option's position in the set (#262).
   *
   * Native radios get all of this from the platform — one tab stop per group,
   * arrows within it, and the "2 of 5" a screen reader announces. None of it
   * forms here, because each input is alone in its own shadow root, so the
   * component supplies it. The tab stop is the checked option, or the first
   * enabled one when nothing is checked; without that fallback an unanswered
   * group would be unreachable by keyboard.
   *
   * Set position counts disabled options, as a native group does: they are
   * still options, merely unavailable, and leaving them out would make the
   * announced size disagree with what a sighted user sees.
   */
  private _syncGroup(): void {
    if (!this.isConnected) return;
    const members = this._groupMembers();
    if (members.length < 2) {
      this._scope = this.name ? this._resolveScope() : undefined;
      this._tabStop = true;
      this._posInSet = undefined;
      this._setSize = undefined;
      return;
    }
    const enabled = members.filter((r) => !r.disabled);
    const stop = enabled.find((r) => r.checked) ?? enabled[0];
    const scope = this._resolveScope();
    members.forEach((r, i) => {
      r._scope = scope;
      r._tabStop = r === stop;
      r._posInSet = i + 1;
      r._setSize = members.length;
    });
    this._markRadioGroup(scope, members);
  }

  /**
   * Give the group's `<fieldset>` the `radiogroup` role, so assistive
   * technology is told the options are mutually exclusive rather than merely
   * related — a fieldset's implicit role is `group`.
   *
   * Deliberately narrow, since this writes to the consumer's own markup: only a
   * `<fieldset>` (never the parent-element fallback, which is usually a layout
   * wrapper), only when the consumer has not set a role themselves, and only
   * when every radio inside it belongs to this one group. A fieldset holding two
   * named groups is not a radiogroup, and marking it one would be a lie.
   */
  private _markRadioGroup(scope: ParentNode, members: CandorRadio[]): void {
    if (!(scope instanceof HTMLFieldSetElement) || scope.hasAttribute('role')) return;
    if (scope.querySelectorAll('candor-radio').length !== members.length) return;
    scope.setAttribute('role', 'radiogroup');
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
          tabindex="${this._tabStop ? 0 : -1}"
          aria-label="${this._ariaLabel || nothing}"
          aria-posinset="${this._posInSet ?? nothing}"
          aria-setsize="${this._setSize ?? nothing}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
          @keydown="${this._onKeydown}"
        />
        <span class="radio-circle"></span>
        ${this.label ? html`<span class="radio-label">${this.label}</span>` : nothing}
        <slot></slot>
      </label>
      <slot name="end"></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-radio': CandorRadio; }
}
