import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

const ICONS: Record<ToastVariant, string> = {
  info:    'ℹ',
  success: '✓',
  warning: '⚠',
  error:   '✕',
};

@customElement('candor-toast')
export class CandorToast extends LitElement {
  static styles = css`
    :host { display: block; }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid;
      font-family: var(--font-family-accessible);
      min-width: 18rem;
      max-width: 28rem;
    }
    .toast--info    { background-color: var(--color-bg-surface); border-color: var(--color-border-strong); }
    .toast--success { background-color: var(--color-status-success-bg); border-color: var(--color-status-success); }
    .toast--warning { background-color: var(--color-status-warning-bg); border-color: var(--color-status-warning); }
    .toast--error   { background-color: var(--color-status-error-bg); border-color: var(--color-status-error); }
    .toast__icon { flex-shrink: 0; font-size: 1rem; line-height: 1.5; }
    .toast--info    .toast__icon { color: var(--color-text-subtle); }
    .toast--success .toast__icon { color: var(--color-status-success); }
    .toast--warning .toast__icon { color: var(--color-status-warning); }
    .toast--error   .toast__icon { color: var(--color-status-error); }
    .toast__content { flex: 1; min-width: 0; }
    .toast__title { font-weight: var(--font-weight-semibold); color: var(--color-toast-message); font-size: var(--font-size-md); margin-bottom: 0.2rem; }
    .toast__message { color: var(--color-toast-message); font-size: var(--font-size-md); letter-spacing: 0.02em; }
    .toast__dismiss {
      flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
      width: 1.5rem; height: 1.5rem; padding: 0; border: none; background: none; cursor: pointer;
      border-radius: var(--radius-sm); color: var(--color-text-subtle); transition: color 0.15s ease, background-color 0.15s ease;
    }
    .toast__dismiss:hover { color: var(--color-text-default); background-color: oklch(from currentColor l c h / 0.1); }
    .toast__dismiss:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
  `;

  @property({ reflect: true }) variant: ToastVariant = 'info';
  @property() heading = '';
  @property() message = '';
  @property({ type: Boolean }) dismissible = true;

  render() {
    const role = this.variant === 'warning' || this.variant === 'error' ? 'alert' : 'status';
    return html`
      <div class="toast toast--${this.variant}" role="${role}">
        <span class="toast__icon" aria-hidden="true">${ICONS[this.variant]}</span>
        <div class="toast__content">
          ${this.heading ? html`<div class="toast__title">${this.heading}</div>` : nothing}
          <div class="toast__message">${this.message}</div>
        </div>
        ${this.dismissible ? html`
          <button class="toast__dismiss" aria-label="Dismiss notification" @click="${this._dismiss}">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ` : nothing}
      </div>
    `;
  }

  private _dismiss() {
    this.dispatchEvent(new CustomEvent('dismissed', { bubbles: true, composed: true }));
  }
}

@customElement('candor-toast-container')
export class CandorToastContainer extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      max-width: 32rem;
      pointer-events: none;
    }
    :host([position='top-right'])    { top: 0; right: 0; }
    :host([position='top-left'])     { top: 0; left: 0; }
    :host([position='bottom-right']) { bottom: 0; right: 0; }
    :host([position='bottom-left'])  { bottom: 0; left: 0; }
    ::slotted(*) { pointer-events: all; }
  `;

  @property({ reflect: true }) position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'candor-toast': CandorToast;
    'candor-toast-container': CandorToastContainer;
  }
}
