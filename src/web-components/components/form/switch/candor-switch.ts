import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../../utils/host-aria';

/**
 * A toggle for a setting that takes effect immediately.
 *
 * The choice against `candor-checkbox` is about *when* the change applies, not
 * about appearance: a switch commits on toggle, a checkbox commits when the
 * surrounding form is submitted. A switch inside a form with a Save button is
 * the wrong control — it promises immediacy the form does not deliver.
 *
 * `aria-label` on the host **is** supported here: it is mirrored onto the inner
 * control and stripped from the host, so screen readers announce the name once
 * rather than twice. Prefer the visible `label` where the design allows one.
 *
 * `hint` is the standing explanation slot. A disabled switch must use it to say
 * why the control is locked — for a switch especially, since the off state and
 * the disabled state look similar and the user cannot tell whether the setting
 * is off or unavailable.
 *
 * @fires change - detail: boolean — the new checked state, on user toggle
 */
@customElement('candor-switch')
export class CandorSwitch extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: block; }
    .switch-container { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .switch-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
    }
    .switch-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }
    .switch-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    .switch-input:focus-visible + .switch-track {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .switch-input:checked + .switch-track {
      background-color: var(--color-action-primary);
      border-color: var(--color-action-primary);
    }
    .switch-input:checked + .switch-track .switch-thumb {
      background-color: var(--color-text-on-action);
      transform: translateX(20px);
    }
    .switch-input:disabled + .switch-track {
      background-color: var(--color-bg-surface);
      border-color: var(--color-border-default);
      cursor: not-allowed;
    }
    .switch-track {
      display: inline-flex;
      align-items: center;
      width: 44px;
      height: 24px;
      border-radius: var(--radius-full);
      background-color: var(--color-bg-surface);
      border: var(--border-width-medium) solid var(--color-border-control);
      padding: 3px;
      flex-shrink: 0;
      transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
      box-sizing: border-box;
    }
    .switch-track:hover {
      border-color: var(--color-action-primary);
    }
    .switch-thumb {
      width: 18px;
      height: 18px;
      border-radius: var(--radius-full);
      background-color: var(--color-border-control);
      transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
      flex-shrink: 0;
    }
    .switch-label {
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-md);
      color: var(--color-text-default);
      user-select: none;
      letter-spacing: var(--letter-spacing-italic);
    }
    .switch-hint {
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      color: var(--color-text-subtle);
      letter-spacing: var(--letter-spacing-italic);
    }
  `;

  @property() label?: string;
  @property() hint?: string;
  @property() name?: string;

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
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;

  private _id = `candor-switch-${Math.random().toString(36).slice(2, 9)}`;
  private _hintId = `${this._id}-hint`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('checked')) {
      this._internals.setFormValue(this.checked ? 'on' : null);
    }
  }

  private _onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this._internals.setFormValue(this.checked ? 'on' : null);
    this.dispatchEvent(new CustomEvent('change', { detail: this.checked, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <div class="switch-container">
        <label class="switch-wrapper ${this.disabled ? 'switch-wrapper--disabled' : ''}" for="${this._id}">
          <input
            class="switch-input"
            type="checkbox"
            role="switch"
            id="${this._id}"
            .checked="${this.checked}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            aria-label="${this._ariaLabel || nothing}"
            aria-describedby="${this.hint ? this._hintId : nothing}"
            name="${this.name || nothing}"
            @change="${this._onChange}"
          />
          <span class="switch-track">
            <span class="switch-thumb"></span>
          </span>
          ${this.label ? html`<span class="switch-label">${this.label}</span>` : nothing}
          <slot></slot>
        </label>
        ${this.hint ? html`<span id="${this._hintId}" class="switch-hint">${this.hint}</span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-switch': CandorSwitch; }
}
