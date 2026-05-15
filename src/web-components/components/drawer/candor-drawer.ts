import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { phX } from '../../icons';

type DrawerPosition = 'left' | 'right' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

@customElement('candor-drawer')
export class CandorDrawer extends LitElement {
  static override styles = css`
    :host { display: contents; }
    dialog { border: none; padding: 0; background: transparent; max-width: 100vw; max-height: 100dvh; }
    dialog::backdrop { background-color: var(--color-overlay); }
    .drawer { display: flex; height: 100%; }
    .drawer--left   { justify-content: flex-start; }
    .drawer--right  { justify-content: flex-end; }
    .drawer--bottom { align-items: flex-end; }
    dialog[open] { display: flex; width: 100vw; max-width: 100vw; }
    .drawer--bottom dialog[open] { height: auto; }
    .drawer__panel {
      background-color: var(--color-bg-elevated);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .drawer--left .drawer__panel, .drawer--right .drawer__panel {
      height: 100dvh;
      max-height: 100dvh;
    }
    .drawer--bottom .drawer__panel { width: 100%; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
    .drawer--sm .drawer__panel    { width: min(20rem, 85vw); }
    .drawer--md .drawer__panel    { width: min(28rem, 85vw); }
    .drawer--lg .drawer__panel    { width: min(40rem, 90vw); }
    .drawer--full .drawer__panel  { width: 100vw; }
    .drawer__header {
      display: flex; align-items: center; justify-content: space-between;
      padding: var(--spacing-md); border-bottom: var(--border-width-thin) solid var(--color-border-default); flex-shrink: 0;
    }
    .drawer__title { font-family: var(--font-family-base); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0; font-optical-sizing: auto; }
    .drawer__close {
      display: inline-flex; align-items: center; justify-content: center;
      width: 2rem; height: 2rem; padding: 0; border: none; background: none; cursor: pointer;
      border-radius: var(--radius-sm); color: var(--color-text-subtle); transition: background-color 0.15s ease;
    }
    .drawer__close:hover { background-color: var(--color-bg-surface); color: var(--color-text-default); }
    .drawer__close:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .drawer__body { flex: 1; overflow-y: auto; padding: var(--spacing-md); }
  `;

  @property({ type: Boolean }) open = false;
  @property() heading = '';
  @property({ reflect: true }) position: DrawerPosition = 'right';
  @property({ reflect: true }) size: DrawerSize = 'md';
  @property({ type: Boolean, attribute: 'dismiss-on-backdrop' }) dismissOnBackdrop = true;

  @query('dialog') private _dialog!: HTMLDialogElement;

  private _titleId = `drawer-title-${Math.random().toString(36).slice(2, 9)}`;

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
    if (this.dismissOnBackdrop && e.target === this._dialog) this._close();
  }

  override render() {
    return html`
      <dialog
        class="drawer drawer--${this.position} drawer--${this.size}"
        aria-labelledby="${this.heading ? this._titleId : nothing}"
        aria-label="${!this.heading ? 'Drawer' : nothing}"
        @click="${this._onBackdropClick}"
        @close="${this._close}"
        @cancel="${(e: Event) => { e.preventDefault(); this._close(); }}"
      >
        <div class="drawer__panel">
          <header class="drawer__header" role="none">
            ${this.heading ? html`<h2 class="drawer__title" id="${this._titleId}">${this.heading}</h2>` : html`<span></span>`}
            <button class="drawer__close" type="button" aria-label="Close" @click="${this._close}">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phX}"/></svg>
            </button>
          </header>
          <div class="drawer__body" tabindex="0" aria-label="Drawer content"><slot></slot></div>
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-drawer': CandorDrawer; }
}
