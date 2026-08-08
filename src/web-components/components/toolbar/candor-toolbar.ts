import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../utils/host-aria';

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

/**
 * A grouped set of controls sharing **one tab stop**.
 *
 * That is the whole point of the component, and the thing to understand before
 * slotting anything in. It implements a roving tabindex: exactly one child is
 * tabbable at a time, and arrow keys move between them (Left/Right when
 * horizontal, Up/Down when vertical, plus Home and End). A toolbar of eight
 * buttons therefore costs a keyboard user one Tab rather than eight.
 *
 * The consequence is that **the component rewrites its children's `tabindex`**.
 * Setting `tabindex` on a slotted control will be overwritten on the next
 * slotchange or focus change; do not try to make a second child tabbable.
 *
 * Only recognised interactive elements join the rotation — buttons, links, and
 * elements carrying the button, checkbox or radio roles, each excluded while
 * `aria-disabled="true"`. Slotting a control the matcher does not recognise
 * leaves it unreachable by arrow key *and* untabbable, which is worse than not
 * using a toolbar at all. Check the selector list before slotting a custom
 * widget.
 *
 * Name it: pass `aria-label` on the host, or `aria-labelledby` pointing at
 * visible text. An unnamed toolbar is announced only as "toolbar".
 *
 * `orientation` sets both the layout and which arrow keys navigate, so it must
 * match the visual direction or the keyboard model contradicts the picture.
 *
 * Emits no custom events — the slotted controls emit their own.
 */
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
      /* On narrow viewports a full toolbar scrolls in a single row instead of
         overflowing the page. Roving-tabindex nav already scrolls focus into
         view, so keyboard users follow the row as they arrow through it. */
      max-width: 100%;
      overflow-x: auto;
    }
    /* Keep each item at its natural size so the row scrolls rather than the
       items squashing (flex children shrink by default). */
    ::slotted(*) { flex-shrink: 0; }
    .toolbar--vertical {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: fit-content;
      max-width: 100%;
      overflow-x: visible;
    }
  `;

  @property({ attribute: 'aria-labelledby' }) ariaLabelledby = '';
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming — see utils/host-aria.ts).
  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

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
        aria-label="${this._ariaLabel || nothing}"
        aria-labelledby="${this.ariaLabelledby || nothing}"
        aria-orientation="${this.orientation}"
        @keydown="${this._onKeydown}"
        @focusin="${this._onFocusin}"
      >
        <slot @slotchange="${() => this._initTabindexes()}"></slot>
      </div>
    `;
  }
}

/**
 * A visual divider between groups of controls inside `candor-toolbar`.
 *
 * Carries `role="separator"` with an orientation, so it conveys the grouping
 * structurally as well as visually. It is not interactive and is not part of the
 * toolbar's arrow-key rotation — inserting one does not cost a stop.
 *
 * Note its `orientation` is the axis of the *rule*, and therefore the opposite
 * of the toolbar's: a horizontal toolbar takes vertical separators, which is why
 * the default here is `vertical` while `candor-toolbar` defaults to
 * `horizontal`.
 *
 * Grouping is the only reason to use one. A separator between every control is
 * noise that makes the real groups harder to see.
 *
 * Emits no custom events.
 */
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
