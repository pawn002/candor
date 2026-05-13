import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

let _nextId = 0;

@customElement('candor-disclosure')
export class CandorDisclosure extends LitElement {
  static styles = css`
    :host { display: block; }
    .disclosure__trigger {
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.5rem; width: 100%; padding: 0;
      background: none; border: none; cursor: pointer;
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); text-align: left;
    }
    .disclosure__trigger:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); border-radius: var(--radius-sm); }
    .disclosure__label { flex: 1; }
    .disclosure__icon { font-size: 1rem; color: var(--color-text-subtle); transition: transform 0.2s ease; flex-shrink: 0; }
    .disclosure__icon--open { transform: rotate(180deg); }
    .disclosure__panel[hidden] { display: none; }
    .disclosure__content { padding-top: var(--spacing-sm); font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); line-height: var(--line-height-normal); }
  `;

  @property() label = '';
  @property({ type: Boolean, reflect: true }) open = false;

  private _id = _nextId++;
  private _triggerId = `disclosure-trigger-${this._id}`;
  private _panelId = `disclosure-panel-${this._id}`;

  private _toggle() {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('toggle', { detail: this.open, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="disclosure">
        <button
          class="disclosure__trigger"
          id="${this._triggerId}"
          aria-expanded="${this.open}"
          aria-controls="${this._panelId}"
          @click="${this._toggle}"
        >
          <span class="disclosure__label">${this.label}</span>
          <span class="disclosure__icon ${this.open ? 'disclosure__icon--open' : ''}" aria-hidden="true">▾</span>
        </button>
        <div class="disclosure__panel" id="${this._panelId}" ?hidden="${!this.open}">
          <div class="disclosure__content"><slot></slot></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-disclosure': CandorDisclosure; }
}
