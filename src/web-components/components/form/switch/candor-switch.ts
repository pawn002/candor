import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('candor-switch')
export class CandorSwitch extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: inline-block; }
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
      letter-spacing: 0.02em;
    }
  `;

  @property() label?: string;
  @property({ attribute: 'aria-label' }) ariaLabel_?: string;
  @property() name?: string;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;

  private _id = `candor-switch-${Math.random().toString(36).slice(2, 9)}`;

  private _onChange(e: Event) {
    this.checked = (e.target as HTMLInputElement).checked;
    this._internals.setFormValue(this.checked ? 'on' : null);
    this.dispatchEvent(new CustomEvent('change', { detail: this.checked, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <label class="switch-wrapper ${this.disabled ? 'switch-wrapper--disabled' : ''}" for="${this._id}">
        <input
          class="switch-input"
          type="checkbox"
          role="switch"
          id="${this._id}"
          ?checked="${this.checked}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          aria-label="${this.ariaLabel_ || nothing}"
          name="${this.name || nothing}"
          @change="${this._onChange}"
        />
        <span class="switch-track">
          <span class="switch-thumb"></span>
        </span>
        ${this.label ? html`<span class="switch-label">${this.label}</span>` : nothing}
        <slot></slot>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-switch': CandorSwitch; }
}
