import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state, query, queryAll } from 'lit/decorators.js';

export interface MenuItem {
  label: string;
  disabled?: boolean;
}

export type MenuEntry = MenuItem | 'separator';

@customElement('candor-menu')
export class CandorMenu extends LitElement {
  static styles = css`
    :host { display: inline-block; position: relative; }
    .menu-trigger {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      background: var(--color-bg-surface); color: var(--color-text-default);
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md); cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .menu-trigger:hover { background-color: var(--color-action-tertiary); }
    .menu-trigger:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .menu-trigger__chevron { font-size: 0.8rem; transition: transform 0.2s ease; }
    .menu-panel {
      position: absolute; top: calc(100% + 4px); left: 0; z-index: 1000;
      min-width: 10rem; padding: 0.25rem 0;
      background: var(--color-bg-elevated); border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md); box-shadow: var(--shadow-md);
      list-style: none; margin: 0;
    }
    .menu-item {
      display: block; width: 100%; padding: 0.5rem var(--spacing-sm);
      font-family: var(--font-family-base); font-size: var(--font-size-md);
      color: var(--color-text-default); background: none; border: none;
      text-align: left; cursor: pointer; transition: background-color 0.1s ease;
    }
    .menu-item:hover:not(.menu-item--disabled) { background-color: var(--color-bg-surface); }
    .menu-item:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: -2px; }
    .menu-item--disabled { color: var(--color-text-disabled); cursor: not-allowed; }
    .menu-separator { height: 1px; background: var(--color-border-default); margin: 0.25rem 0; }
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

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onDocumentClick);
  }

  render() {
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
        <span class="menu-trigger__chevron" aria-hidden="true">▾</span>
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
