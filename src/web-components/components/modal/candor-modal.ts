import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { phX } from '../../icons';

type ModalSize = 'sm' | 'md' | 'lg';

@customElement('candor-modal')
export class CandorModal extends LitElement {
  static override styles = css`
    :host { display: contents; }
    dialog {
      border: none;
      padding: 0;
      background: transparent;
      max-width: none;
      max-height: none;
      overflow: visible;
    }
    dialog::backdrop {
      background-color: var(--color-overlay);
      backdrop-filter: blur(2px);
    }

    .modal__panel {
      background-color: var(--color-bg-elevated);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-modal);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      width: 90vw;
      overflow: hidden;
    }
    .modal__panel--sm { max-width: 400px; }
    .modal__panel--md { max-width: 560px; }
    .modal__panel--lg { max-width: 768px; }

    /* Header */
    .modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-md) var(--spacing-sm);
      border-bottom: var(--border-width-thin) solid var(--color-border-default);
      flex-shrink: 0;
    }
    .modal__title {
      font-family: var(--font-family-display);
      font-optical-sizing: auto;
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      color: var(--color-text-default);
      margin: 0;
    }

    /* Close */
    .modal__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: var(--radius-sm);
      color: var(--color-text-subtle);
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .modal__close:hover {
      background-color: var(--color-action-tertiary-hover);
      color: var(--color-text-default);
    }
    .modal__close:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }

    /* Body */
    .modal__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md);
      color: var(--color-text-default);
      font-family: var(--font-family-base);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }
    .modal__body:focus { outline: none; }
    .modal__body:focus-visible {
      outline: 2px solid var(--color-focus);
      outline-offset: -2px;
    }

    /* Footer (projected via [slot=footer]) */
    .modal__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-top: var(--border-width-thin) solid var(--color-border-default);
      flex-shrink: 0;
    }
    .modal__footer--empty { display: none; }
  `;

  @property({ type: Boolean }) open = false;
  @property() heading = '';
  @property({ reflect: true }) size: ModalSize = 'md';

  @query('dialog') private _dialog!: HTMLDialogElement;

  @state() private _hasFooter = false;

  private _titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this._dialog?.showModal();
      } else {
        this._dialog?.close();
      }
    }
  }

  private _close() {
    this._dialog?.close();
    this.open = false;
    this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
  }

  private _onBackdropClick(e: MouseEvent) {
    if (e.target === this._dialog) this._close();
  }

  private _onFooterSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasFooter = slot.assignedElements().length > 0;
  }

  override render() {
    return html`
      <dialog
        aria-labelledby="${this._titleId}"
        aria-modal="true"
        @click="${this._onBackdropClick}"
        @close="${this._close}"
        @cancel="${(e: Event) => { e.preventDefault(); this._close(); }}"
      >
        <div class="modal__panel modal__panel--${this.size}">
          <header class="modal__header" role="none">
            <h2 class="modal__title" id="${this._titleId}">${this.heading}</h2>
            <button class="modal__close" type="button" aria-label="Close" @click="${this._close}">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phX}"/></svg>
            </button>
          </header>
          <div class="modal__body" tabindex="0" aria-label="Dialog content"><slot></slot></div>
          <div class="modal__footer ${this._hasFooter ? '' : 'modal__footer--empty'}">
            <slot name="footer" @slotchange="${this._onFooterSlotChange}"></slot>
          </div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-modal': CandorModal; }
}
