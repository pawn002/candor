import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { phInfoFill, phCheckCircleFill, phWarningFill, phXCircleFill, phX } from '../../icons';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

@customElement('candor-toast')
export class CandorToast extends LitElement {
  static override styles = css`
    /* Width — consumers may override per-instance:
       candor-toast { --candor-toast-min-width: 24rem; } */
    :host {
      display: block;
      --candor-toast-min-width: 18rem;
      --candor-toast-max-width: 28rem;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      box-sizing: border-box;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid;
      border-left-width: var(--border-width-thick);
      font-family: var(--font-family-base);
      min-width: min(var(--candor-toast-min-width), 100%);
      max-width: min(var(--candor-toast-max-width), 100%);
    }
    .toast--info    { background-color: var(--color-bg-surface); border-color: var(--color-border-default); }
    .toast--success { background-color: var(--color-status-success-bg); border-color: var(--color-status-success); }
    .toast--warning { background-color: var(--color-status-warning-bg); border-color: var(--color-status-warning); }
    .toast--error   { background-color: var(--color-status-error-bg); border-color: var(--color-status-error); }
    .toast__icon { flex-shrink: 0; width: 1.25rem; height: 1.25rem; margin-top: 0.125rem; }
    .toast--info    .toast__icon { color: var(--color-text-subtle); }
    .toast--success .toast__icon { color: var(--color-status-success); }
    .toast--warning .toast__icon { color: var(--color-status-warning); }
    .toast--error   .toast__icon { color: var(--color-status-error); }
    .toast__content { flex: 1; min-width: 0; }
    .toast__title {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-default);
      font-size: var(--font-size-base);
      line-height: var(--line-height-tight);
      margin-bottom: var(--spacing-2xs);
    }
    .toast__message {
      color: var(--color-toast-message);
      font-size: var(--font-size-md);
      line-height: var(--line-height-normal);
    }
    .toast__dismiss {
      flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
      width: 1.5rem; height: 1.5rem; padding: 0; border: none; background: none; cursor: pointer;
      border-radius: var(--radius-sm); color: var(--color-text-subtle);
      font-size: 1rem;
      line-height: 1;
      transition: color 0.15s ease, background-color 0.15s ease;
    }
    .toast__dismiss:hover { color: var(--color-text-default); background-color: var(--color-bg-surface); }
    .toast__dismiss:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
  `;

  @property({ reflect: true }) variant: ToastVariant = 'info';
  @property() heading = '';
  @property() message = '';
  @property({ type: Boolean }) dismissible = false;

  private _iconPath() {
    switch (this.variant) {
      case 'info':    return phInfoFill;
      case 'success': return phCheckCircleFill;
      case 'warning': return phWarningFill;
      case 'error':   return phXCircleFill;
    }
  }

  override render() {
    const role = this.variant === 'warning' || this.variant === 'error' ? 'alert' : 'status';
    return html`
      <div class="toast toast--${this.variant}" role="${role}">
        <svg class="toast__icon" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${this._iconPath()}"/></svg>
        <div class="toast__content">
          ${this.heading ? html`<div class="toast__title">${this.heading}</div>` : nothing}
          <div class="toast__message">${this.message}</div>
        </div>
        ${this.dismissible ? html`
          <button class="toast__dismiss" aria-label="Dismiss notification" @click="${this._dismiss}">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phX}"/></svg>
          </button>
        ` : nothing}
      </div>
    `;
  }

  private _dismiss() {
    this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }));
  }
}

@customElement('candor-toast-container')
export class CandorToastContainer extends LitElement {
  static override styles = css`
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

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'candor-toast': CandorToast;
    'candor-toast-container': CandorToastContainer;
  }
}
