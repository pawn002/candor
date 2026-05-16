import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state, query, queryAll } from 'lit/decorators.js';
import { phCaretDownBold } from '../../icons';

export interface MenuItem {
  label: string;
  disabled?: boolean;
}

export type MenuEntry = MenuItem | 'separator';

@customElement('candor-menu')
export class CandorMenu extends LitElement {
  static override styles = css`
    :host { display: inline-block; position: relative; }
    .menu-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: var(--spacing-sm) var(--spacing-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-default);
      background-color: var(--color-bg-surface);
      border: var(--border-width-thin) solid var(--color-border-strong);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .menu-trigger:hover {
      background-color: var(--color-bg-elevated);
      border-color: var(--color-border-control);
    }
    .menu-trigger:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .menu-trigger[aria-expanded='true'] {
      background-color: var(--color-bg-elevated);
      border-color: var(--color-action-primary);
    }
    .menu-trigger[aria-expanded='true'] .menu-trigger__chevron {
      transform: rotate(180deg);
    }
    .menu-trigger__chevron {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    .menu-panel {
      position: absolute;
      top: calc(100% + 0.375rem);
      left: 0;
      z-index: 200;
      min-width: 10rem;
      padding: 0.25rem;
      margin: 0;
      list-style: none;
      background-color: var(--color-bg-elevated);
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }
    .menu-item {
      display: block;
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      letter-spacing: 0.02em;
      color: var(--color-text-default);
      background: none;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-align: left;
      transition: background-color 0.1s ease;
    }
    .menu-item:hover:not(.menu-item--disabled),
    .menu-item:focus:not(.menu-item--disabled) {
      background-color: var(--color-bg-surface);
      outline: none;
    }
    .menu-item:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: calc(-1 * var(--focus-ring-offset));
    }
    .menu-item--disabled {
      color: var(--color-text-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }
    .menu-separator {
      height: var(--border-width-thin);
      background-color: var(--color-border-default);
      margin: 0.25rem 0.75rem;
    }
  `;

  @property() label = 'Options';
  @property({ type: Array }) entries: MenuEntry[] = [];

  @state() private _open = false;
  @state() private _focusedIndex = 0;

  private _menuId = `candor-menu-${Math.random().toString(36).slice(2, 9)}`;
  private _triggerId = `candor-menu-trigger-${Math.random().toString(36).slice(2, 9)}`;

  @query('.menu-trigger') private _trigger!: HTMLButtonElement;
  @queryAll('.menu-item') private _items!: NodeListOf<HTMLButtonElement>;

  private get _itemEntries(): MenuItem[] {
    return this.entries.filter((e): e is MenuItem => e !== 'separator');
  }

  private _open_() {
    this._open = true;
    this._focusedIndex = 0;
    requestAnimationFrame(() => this._focusItem(0));
  }

  private _close() {
    this._open = false;
    this._trigger?.focus();
  }

  private _toggle() {
    this._open ? this._close() : this._open_();
  }

  private _select(entry: MenuItem) {
    if (entry.disabled) return;
    this.dispatchEvent(new CustomEvent('selected', { detail: entry, bubbles: true, composed: true }));
    this._close();
  }

  private _focusItem(index: number) {
    this._focusedIndex = index;
    const buttons = Array.from(this._items || []);
    buttons[index]?.focus();
  }

  private _onTriggerKeydown(e: KeyboardEvent) {
    if (['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); this._open_(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this._open = true; this._focusedIndex = this._itemEntries.length - 1; requestAnimationFrame(() => this._focusItem(this._itemEntries.length - 1)); }
  }

  private _onMenuKeydown(e: KeyboardEvent) {
    const items = this._itemEntries;
    const cur = this._focusedIndex;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); this._focusItem(Math.min(cur + 1, items.length - 1)); break;
      case 'ArrowUp': e.preventDefault(); this._focusItem(Math.max(cur - 1, 0)); break;
      case 'Home': e.preventDefault(); this._focusItem(0); break;
      case 'End': e.preventDefault(); this._focusItem(items.length - 1); break;
      case 'Escape': case 'Tab': this._close(); break;
      case 'Enter': case ' ': e.preventDefault(); { const entry = items[cur]; if (entry) this._select(entry); } break;
    }
  }

  private _onDocumentClick = (e: MouseEvent) => {
    if (this._open && !this.contains(e.target as Node)) this._close();
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onDocumentClick);
  }

  override render() {
    return html`
      <button
        class="menu-trigger"
        id="${this._triggerId}"
        aria-haspopup="menu"
        aria-expanded="${this._open}"
        aria-controls="${this._menuId}"
        @click="${this._toggle}"
        @keydown="${this._onTriggerKeydown}"
      >
        ${this.label}
        <svg class="menu-trigger__chevron" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
      </button>
      ${this._open ? html`
        <ul
          id="${this._menuId}"
          role="menu"
          class="menu-panel"
          aria-labelledby="${this._triggerId}"
          @keydown="${this._onMenuKeydown}"
        >
          ${this.entries.map((entry, i) =>
            entry === 'separator'
              ? html`<li role="none"><div class="menu-separator"></div></li>`
              : html`<li role="none">
                  <button
                    role="menuitem"
                    class="menu-item ${entry.disabled ? 'menu-item--disabled' : ''}"
                    aria-disabled="${entry.disabled || nothing}"
                    tabindex="${this._focusedIndex === this._getItemIndex(i) ? '0' : '-1'}"
                    @click="${() => this._select(entry)}"
                    @mouseenter="${() => this._focusedIndex = this._getItemIndex(i)}"
                  >${entry.label}</button>
                </li>`
          )}
        </ul>
      ` : nothing}
    `;
  }

  private _getItemIndex(domIndex: number): number {
    let count = 0;
    for (let i = 0; i < domIndex; i++) {
      if (this.entries[i] !== 'separator') count++;
    }
    return count;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-menu': CandorMenu; }
}
