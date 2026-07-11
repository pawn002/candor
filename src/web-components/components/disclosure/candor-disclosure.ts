import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { phCaretDownBold } from '../../icons';

let _nextId = 0;

@customElement('candor-disclosure')
export class CandorDisclosure extends LitElement {
  static override styles = css`
    :host { display: block; }
    .disclosure__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: var(--spacing-xs);
      /* Trigger padding is reachable two ways (#173): uniform density via these
         custom props, or the asymmetric case (kill just the top when the
         disclosure is the first child of a padded box) via
         candor-disclosure::part(trigger) { padding-top: 0; } */
      padding: var(--candor-disclosure-trigger-padding-y, var(--spacing-sm)) var(--candor-disclosure-trigger-padding-x, 0);
      border: none;
      border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
      background: transparent;
      color: var(--color-text-default);
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      line-height: var(--line-height-tight);
      cursor: pointer;
      text-align: left;
    }
    .disclosure__trigger:hover { color: var(--color-action-primary); }
    .disclosure__trigger:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
      border-radius: var(--radius-sm);
    }
    .disclosure__label { flex: 1; }
    .disclosure__icon {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
      color: var(--color-text-subtle);
      transition: transform 200ms ease;
    }
    .disclosure__icon--open { transform: rotate(180deg); }
    .disclosure__panel { overflow: hidden; }
    .disclosure__panel[hidden] { display: none; }
    .disclosure__content {
      padding: var(--spacing-sm) 0;
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      color: var(--color-text-default);
      line-height: var(--line-height-relaxed);
    }
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

  override render() {
    return html`
      <div class="disclosure">
        <button
          part="trigger"
          class="disclosure__trigger"
          id="${this._triggerId}"
          aria-expanded="${this.open}"
          aria-controls="${this._panelId}"
          @click="${this._toggle}"
        >
          <span part="label" class="disclosure__label">${this.label}</span>
          <svg part="icon" class="disclosure__icon ${this.open ? 'disclosure__icon--open' : ''}" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
        </button>
        <div part="panel" class="disclosure__panel" id="${this._panelId}" ?hidden="${!this.open}">
          <div class="disclosure__content"><slot></slot></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-disclosure': CandorDisclosure; }
}
