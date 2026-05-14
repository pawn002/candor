import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('candor-switch')
export class CandorSwitch extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host { display: inline-flex; }
    .switch-wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-md);
    }
    .switch-wrapper--disabled { opacity: 0.5; cursor: not-allowed; }
    .switch-input { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
    .switch-track {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 2.75rem;
      height: 1.5rem;
      border-radius: var(--radius-full);
      background-color: var(--color-border-control);
      transition: background-color 0.2s ease;
      flex-shrink: 0;
    }
    .switch-input:checked + .switch-track { background-color: var(--color-action-primary); }
    .switch-input:focus-visible + .switch-track { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .switch-thumb {
      position: absolute;
      left: 0.2rem;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      background-color: white;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .switch-input:checked ~ .switch-thumb,
    .switch-input:checked + .switch-track .switch-thumb { transform: translateX(1.25rem); }
    .switch-label { color: var(--color-text-default); letter-spacing: 0.02em; }
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
