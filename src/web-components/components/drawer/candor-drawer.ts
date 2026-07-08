import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { phX } from '../../icons';

type DrawerPosition = 'left' | 'right' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

@customElement('candor-drawer')
export class CandorDrawer extends LitElement {
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
    dialog[open] {
      display: flex;
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    dialog::backdrop { background-color: var(--color-overlay); }

    /* Non-modal mode: the dialog is still a full-viewport layer (for edge-anchored
       positioning), but it must not intercept pointer events across the page — only
       the panel itself should be clickable. The modal property reflects as the string
       "true"/"false" (see the custom converter below), so non-modal is modal="false". */
    :host([modal='false']) dialog[open] { pointer-events: none; }
    :host([modal='false']) .drawer__panel { pointer-events: auto; }

    /* Position layout */
    .drawer--right  dialog[open] { justify-content: flex-end; align-items: stretch; }
    .drawer--left   dialog[open] { justify-content: flex-start; align-items: stretch; }
    .drawer--bottom dialog[open] { flex-direction: column; justify-content: flex-end; align-items: stretch; }

    /* Panel */
    .drawer__panel {
      background-color: var(--color-bg-elevated);
      box-shadow: var(--shadow-modal);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 250ms cubic-bezier(0.25, 0, 0.1, 1);
    }
    .drawer--left .drawer__panel,
    .drawer--right .drawer__panel {
      height: 100%;
    }
    .drawer--bottom .drawer__panel {
      width: 100%;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }

    /* Slide-in animations */
    .drawer--right .drawer__panel { transform: translateX(0); }
    @starting-style {
      .drawer--right dialog[open] .drawer__panel { transform: translateX(100%); }
    }
    .drawer--left .drawer__panel { transform: translateX(0); }
    @starting-style {
      .drawer--left dialog[open] .drawer__panel { transform: translateX(-100%); }
    }
    .drawer--bottom .drawer__panel { transform: translateY(0); }
    @starting-style {
      .drawer--bottom dialog[open] .drawer__panel { transform: translateY(100%); }
    }

    /* Size defaults — consumers may override per-instance:
       candor-drawer { --candor-drawer-size: 400px; --candor-drawer-height: 60vh; } */
    :host { --candor-drawer-size: 480px; --candor-drawer-height: 50vh; }
    :host([size='sm'])   { --candor-drawer-size: 320px; --candor-drawer-height: 30vh; }
    :host([size='lg'])   { --candor-drawer-size: 640px; --candor-drawer-height: 75vh; }
    :host([size='full']) { --candor-drawer-size: 100vw; --candor-drawer-height: 100vh; }

    .drawer--right .drawer__panel,
    .drawer--left  .drawer__panel { width: min(var(--candor-drawer-size), 100vw); }
    .drawer--bottom .drawer__panel { max-height: var(--candor-drawer-height); }
    .drawer--bottom.drawer--full .drawer__panel { border-radius: 0; }

    @media (prefers-reduced-motion: reduce) {
      .drawer__panel { transition: none; }
    }

    /* Header */
    .drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-bottom: var(--border-width-thin) solid var(--color-border-default);
      flex-shrink: 0;
    }
    .drawer__title {
      font-family: var(--font-family-display);
      font-optical-sizing: auto;
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      color: var(--color-text-default);
      margin: 0;
    }

    /* Close */
    .drawer__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      margin-left: auto;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--color-text-subtle);
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .drawer__close:hover {
      background: var(--color-action-tertiary-hover);
      color: var(--color-text-default);
    }
    .drawer__close:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }

    /* Body */
    .drawer__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md);
      color: var(--color-text-default);
      font-family: var(--font-family-base);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }
    .drawer__body:focus { outline: none; }
    .drawer__body:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: calc(-1 * var(--focus-ring-offset));
    }

    /* Footer (projected via [slot=footer]) */
    .drawer__footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-top: var(--border-width-thin) solid var(--color-border-default);
      flex-shrink: 0;
    }
    .drawer__footer--empty { display: none; }
  `;

  @property({ type: Boolean }) open = false;
  @property() heading = '';
  @property({ reflect: true }) position: DrawerPosition = 'right';
  @property({ reflect: true }) size: DrawerSize = 'md';
  /** Whether clicking the backdrop dismisses the drawer. Default true. Set
   * `dismiss-on-backdrop="false"` to require an explicit close (data-loss guard
   * for flows where an accidental outside-click would discard unsaved work).
   *
   * A custom converter (not `type: Boolean`) is required so
   * `dismiss-on-backdrop="false"` parses to `false`: Lit's boolean converter
   * treats *any* present attribute — including the string "false" — as `true`,
   * which would silently keep backdrop-dismiss on. Same trap as `modal` below. */
  @property({
    attribute: 'dismiss-on-backdrop',
    converter: {
      fromAttribute: (value: string | null) => value !== 'false',
      toAttribute: (value: unknown) => (value ? 'true' : 'false'),
    },
  })
  dismissOnBackdrop = true;
  /** Default true preserves current (modal) behavior. Set `modal="false"` for a
   * non-modal side panel — e.g. a persistent assistant, inspector, or filter panel
   * the user works alongside — that doesn't trap focus or dim the page.
   *
   * A custom converter (not `type: Boolean`) is required so `modal="false"` parses
   * to `false`: Lit's boolean converter treats *any* present attribute — including
   * the string "false" — as `true`, which would make `modal="false"` silently modal.
   * Reflected as "true"/"false" so CSS can target the non-modal state via
   * `:host([modal='false'])`. */
  @property({
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => value !== 'false',
      toAttribute: (value: unknown) => (value ? 'true' : 'false'),
    },
  })
  modal = true;

  @query('dialog') private _dialog!: HTMLDialogElement;

  @state() private _hasFooter = false;

  private _titleId = `drawer-title-${Math.random().toString(36).slice(2, 9)}`;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this.removeAttribute('inert');
        // Non-modal panels deliberately don't steal focus — showModal() auto-focuses
        // the dialog, but show() doesn't, so the user keeps working wherever focus
        // already was in the page. Do not add autofocus for the non-modal path.
        if (this.modal) {
          this._dialog?.showModal();
        } else {
          this._dialog?.show();
        }
      } else {
        this._dialog?.close();
        this.setAttribute('inert', '');
      }
    }
  }

  private _close() {
    this._dialog?.close();
    this.open = false;
    this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
  }

  private _onBackdropClick(e: MouseEvent) {
    // In non-modal mode the dialog has no backdrop and is `pointer-events: none`
    // outside the panel, so this click handler simply never fires there — a
    // non-modal panel relies on the close button or consumer control to dismiss,
    // not an outside click. No guard needed.
    if (this.dismissOnBackdrop && e.target === this._dialog) this._close();
  }

  private _onFooterSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasFooter = slot.assignedElements().length > 0;
  }

  override render() {
    return html`
      <div class="drawer drawer--${this.position} drawer--${this.size}">
        <dialog
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
            <div class="drawer__footer ${this._hasFooter ? '' : 'drawer__footer--empty'}">
              <slot name="footer" @slotchange="${this._onFooterSlotChange}"></slot>
            </div>
          </div>
        </dialog>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-drawer': CandorDrawer; }
}
