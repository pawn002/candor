import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { phX } from '../../icons';

type ModalSize = 'sm' | 'md' | 'lg';

/**
 * A modal dialog, backed by the native `<dialog>` element and `showModal()` —
 * so the focus trap, inertness of the page behind, and Escape-to-close come from
 * the platform rather than from script.
 *
 * **Controlled.** `close` reports that the user dismissed it; the component does
 * not clear `open` for you. Set `open = false` in response or it reopens on the
 * next render.
 *
 * Set `alert` for a decision the user cannot postpone — it switches the role to
 * `alertdialog`, which tells assistive technology to announce the content
 * immediately. Use it for destructive confirmations, not for ordinary forms.
 *
 * **Do not put `<header>` or `<footer>` in slotted content.** They carry
 * implicit `banner` and `contentinfo` landmark roles, which are not suppressed
 * inside a dialog, so they leak page-level landmarks into the dialog. The
 * component's own header already sets `role="none"` for this reason; use `<div>`
 * in anything you slot.
 *
 * The body is focusable and named, so a scrollable dialog can be reached and
 * scrolled by keyboard — a scroll region that cannot receive focus is
 * unreachable without a pointer.
 *
 * Choose against `candor-drawer` on interruption, not on size: a modal blocks
 * the task until answered; a drawer is a panel alongside it. If the user could
 * reasonably keep working, it is a drawer.
 *
 * @fires close - detail: none — the user dismissed the dialog; the consumer must clear `open`
 */
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
    /* Max-width — consumers may override per-instance:
       candor-modal { --candor-modal-max-width: 700px; } */
    :host { --candor-modal-max-width: 560px; }
    :host([size='sm']) { --candor-modal-max-width: 400px; }
    :host([size='lg']) { --candor-modal-max-width: 768px; }
    .modal__panel { max-width: var(--candor-modal-max-width); }

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
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: calc(-1 * var(--focus-ring-offset));
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
  @property({ type: Boolean }) alert = false;
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
    // The native <dialog> `close` event is wired to this same handler, and the
    // `close()` below fires it synchronously — so a single user close re-enters
    // here. Guard on `open`, and clear it *before* closing the dialog, or the
    // re-entrant call still sees `open === true` and dispatches a second time
    // (#234).
    if (!this.open) return;
    this.open = false;
    this._dialog?.close();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
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
        role="${this.alert ? 'alertdialog' : nothing}"
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
