import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { phInfoFill, phCheckCircleFill, phWarningFill, phXCircleFill, phX } from '../../icons';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

@customElement('candor-alert')
export class CandorAlert extends LitElement {
  static override styles = css`
    :host { display: block; }
    .alert {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      border: var(--border-width-thin) solid;
      font-family: var(--font-family-accessible);
    }
    .alert--info    { background-color: var(--color-bg-surface); border-color: var(--color-border-strong); }
    .alert--success { background-color: var(--color-status-success-bg); border-color: var(--color-status-success); }
    .alert--warning { background-color: var(--color-status-warning-bg); border-color: var(--color-status-warning); }
    .alert--error   { background-color: var(--color-status-error-bg); border-color: var(--color-status-error); }
    .alert__icon { flex-shrink: 0; width: 1.25rem; height: 1.25rem; margin-top: 0.125rem; }
    .alert--info    .alert__icon { color: var(--color-text-subtle); }
    .alert--success .alert__icon { color: var(--color-status-success); }
    .alert--warning .alert__icon { color: var(--color-status-warning); }
    .alert--error   .alert__icon { color: var(--color-status-error); }
    .alert__content { flex: 1; min-width: 0; }
    .alert__title {
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-default);
      font-size: var(--font-size-md);
      line-height: var(--line-height-tight);
      margin-bottom: 0.25rem;
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
    }
    .alert__message {
      color: var(--color-text-default);
      font-size: var(--font-size-md);
      line-height: var(--line-height-normal);
      letter-spacing: 0.02em;
      overflow-wrap: break-word;
    }
    .alert__dismiss {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: var(--radius-sm);
      color: var(--color-text-subtle);
      transition: color 0.15s ease, background-color 0.15s ease;
    }
    .alert__dismiss svg { width: 1rem; height: 1rem; }
    .alert__dismiss:hover { color: var(--color-text-default); background-color: oklch(from currentColor l c h / 0.1); }
    .alert__dismiss:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
  `;

  @property({ reflect: true }) variant: AlertVariant = 'info';
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
      <div class="alert alert--${this.variant}" role="${role}">
        <svg class="alert__icon" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${this._iconPath()}"/></svg>
        <div class="alert__content">
          ${this.heading ? html`<div class="alert__title">${this.heading}</div>` : ''}
          <div class="alert__message">${this.message ? this.message : html`<slot></slot>`}</div>
        </div>
        ${this.dismissible ? html`
          <button class="alert__dismiss" @click="${this._dismiss}" aria-label="Dismiss">
            <svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phX}"/></svg>
          </button>
        ` : ''}
      </div>
    `;
  }

  private _dismiss() {
    this.dispatchEvent(new CustomEvent('dismissed', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-alert': CandorAlert; }
}
