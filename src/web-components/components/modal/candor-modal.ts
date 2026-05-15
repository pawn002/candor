import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { phX } from '../../icons';

type ModalSize = 'sm' | 'md' | 'lg';

@customElement('candor-modal')
export class CandorModal extends LitElement {
  static override styles = css`
    :host { display: contents; }
    dialog {
      border: none;
      padding: 0;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-modal);
      background: transparent;
      max-width: 100vw;
      max-height: 100dvh;
    }
    dialog::backdrop { background-color: var(--color-overlay); }
    .modal__panel {
      background-color: var(--color-bg-elevated);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      max-height: 90dvh;
      overflow: hidden;
    }
    .modal__panel--sm { width: min(24rem, 90vw); }
    .modal__panel--md { width: min(36rem, 90vw); }
    .modal__panel--lg { width: min(52rem, 90vw); }
    .modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md);
      border-bottom: var(--border-width-thin) solid var(--color-border-default);
      flex-shrink: 0;
    }
    .modal__title { font-family: var(--font-family-base); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0; font-optical-sizing: auto; }
    .modal__close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 2rem; height: 2rem; padding: 0;
      border: none; background: none; cursor: pointer;
      border-radius: var(--radius-sm); color: var(--color-text-subtle);
      transition: background-color 0.15s ease;
    }
    .modal__close:hover { background-color: var(--color-bg-surface); color: var(--color-text-default); }
    .modal__close:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .modal__body { flex: 1; overflow-y: auto; padding: var(--spacing-md); }
    .modal__footer { flex-shrink: 0; padding: var(--spacing-md); border-top: var(--border-width-thin) solid var(--color-border-default); }
    .modal__footer:empty { display: none; }
  `;

  @property({ type: Boolean }) open = false;
  @property() heading = '';
  @property({ reflect: true }) size: ModalSize = 'md';

  @query('dialog') private _dialog!: HTMLDialogElement;

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
          <div class="modal__footer"><slot name="footer"></slot></div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-modal': CandorModal; }
}
