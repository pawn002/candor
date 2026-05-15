import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="checkbox"]:not([aria-disabled="true"])',
  '[role="radio"]:not([aria-disabled="true"])',
].join(', ');

let _nextId = 0;

@customElement('candor-toolbar')
export class CandorToolbar extends LitElement {
  static override styles = css`
    *, ::before, ::after { box-sizing: border-box; }
    :host { display: block; }
    .toolbar {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-2xs);
      padding: var(--spacing-2xs);
      background: var(--color-bg-surface);
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-md);
    }
    .toolbar--vertical {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: fit-content;
    }
  `;

  @property({ attribute: 'aria-label' }) ariaLabel_ = '';
  @property({ attribute: 'aria-labelledby' }) ariaLabelledBy_ = '';
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  private _toolbarId = `toolbar-${_nextId++}`;

  private _getItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[];
  }

  private _initTabindexes() {
    const items = this._getItems();
    items.forEach((item, i) => item.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  }

  override firstUpdated() {
    // Set up roving tabindex after slot content renders
    requestAnimationFrame(() => this._initTabindexes());
  }

  private _onKeydown(e: KeyboardEvent) {
    const isHorizontal = this.orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    if (![prevKey, nextKey, 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const items = this._getItems();
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (current === -1) return;
    let target = current;
    if (e.key === nextKey) target = Math.min(current + 1, items.length - 1);
    if (e.key === prevKey) target = Math.max(current - 1, 0);
    if (e.key === 'Home') target = 0;
    if (e.key === 'End') target = items.length - 1;
    if (target !== current) {
      items[current].setAttribute('tabindex', '-1');
      items[target].setAttribute('tabindex', '0');
      items[target].focus();
    }
  }

  private _onFocusin(e: FocusEvent) {
    const items = this._getItems();
    const focused = e.target as HTMLElement;
    if (!items.includes(focused)) return;
    items.forEach(item => item.setAttribute('tabindex', item === focused ? '0' : '-1'));
  }

  override render() {
    return html`
      <div
        role="toolbar"
        id="${this._toolbarId}"
        class="toolbar ${this.orientation === 'vertical' ? 'toolbar--vertical' : ''}"
        aria-label="${this.ariaLabel_ || nothing}"
        aria-labelledby="${this.ariaLabelledBy_ || nothing}"
        aria-orientation="${this.orientation}"
        @keydown="${this._onKeydown}"
        @focusin="${this._onFocusin}"
      >
        <slot @slotchange="${() => this._initTabindexes()}"></slot>
      </div>
    `;
  }
}

@customElement('candor-toolbar-separator')
export class CandorToolbarSeparator extends LitElement {
  static override styles = css`
    *, ::before, ::after { box-sizing: border-box; }
    :host { display: contents; }
    .separator {
      flex-shrink: 0;
      align-self: stretch;
      width: var(--border-width-thin);
      background-color: var(--color-border-strong);
      margin: var(--spacing-2xs) var(--spacing-xs);
    }
    .separator--horizontal {
      width: auto;
      height: var(--border-width-thin);
      align-self: auto;
      margin: var(--spacing-xs) var(--spacing-2xs);
    }
  `;

  @property({ reflect: true }) orientation: 'vertical' | 'horizontal' = 'vertical';

  override render() {
    return html`
      <span
        role="separator"
        aria-orientation="${this.orientation}"
        class="separator ${this.orientation === 'horizontal' ? 'separator--horizontal' : ''}"
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'candor-toolbar': CandorToolbar;
    'candor-toolbar-separator': CandorToolbarSeparator;
  }
}
