import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../utils/host-aria';

export interface TabItem {
  id: string;
  label: string;
}

/**
 * A tab set. The tab strip is built from the `tabs` array; the panels are
 * slotted `candor-tab-panel` elements.
 *
 * **The two halves are joined by id.** Each `TabItem.id` must match the
 * `panel-id` of a slotted panel. A mismatch is silent — the tab renders, the
 * click registers, and no panel appears.
 *
 * ```html
 * <candor-tabs .tabs=${[{id:'a',label:'Overview'},{id:'b',label:'Detail'}]} active-id="a">
 *   <candor-tab-panel panel-id="a">…</candor-tab-panel>
 *   <candor-tab-panel panel-id="b">…</candor-tab-panel>
 * </candor-tabs>
 * ```
 *
 * `active-id` is controlled: `change` reports the tab the user chose, and the
 * consumer assigns it back. Leaving it unset shows no panel.
 *
 * The strip implements the ARIA tabs keyboard model — arrow keys move between
 * tabs, and the strip is one tab stop, so Tab moves from the strip into the
 * panel rather than across the tabs.
 *
 * Tabs are for alternate views of *sibling* content. Content the user should
 * read in sequence, or that needs printing or linking, belongs on the page —
 * hiding it behind a tab makes it unfindable.
 *
 * @fires change - detail: string — the id of the newly selected tab
 */
@customElement('candor-tabs')
export class CandorTabs extends LitElement {
  static override styles = css`
    :host { display: block; }
    .tabs { display: block; }
    .tabs__list-wrapper {
      position: relative;
    }
    .tabs__list-wrapper::before,
    .tabs__list-wrapper::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: var(--spacing-xl);
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.15s ease;
    }
    .tabs__list-wrapper::before {
      left: 0;
      background: linear-gradient(to right, var(--color-bg-page), transparent);
    }
    .tabs__list-wrapper::after {
      right: 0;
      background: linear-gradient(to left, var(--color-bg-page), transparent);
    }
    .tabs--can-scroll-left .tabs__list-wrapper::before { opacity: 1; }
    .tabs--can-scroll-right .tabs__list-wrapper::after { opacity: 1; }

    .tabs__scroll-btn {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 2;
      display: none;
      align-items: center;
      padding: 0 var(--spacing-xs);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-subtle);
      transition: color 0.15s ease;
    }
    .tabs__scroll-btn:hover { color: var(--color-text-default); }
    .tabs__scroll-btn--left { left: 0; }
    .tabs__scroll-btn--right { right: 0; }
    .tabs--can-scroll-left .tabs__scroll-btn--left { display: flex; }
    .tabs--can-scroll-right .tabs__scroll-btn--right { display: flex; }

    .tabs__list {
      display: flex;
      flex-direction: row;
      border-bottom: var(--border-width-thin) solid var(--color-border-default);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs__list::-webkit-scrollbar { display: none; }
    .tabs--can-scroll-left .tabs__list { padding-left: var(--spacing-lg); }
    .tabs--can-scroll-right .tabs__list { padding-right: var(--spacing-lg); }

    .tabs__tab {
      appearance: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-family: var(--font-family-base);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-regular);
      color: var(--color-text-subtle);
      border-bottom: var(--border-width-medium) solid transparent;
      margin-bottom: calc(-1 * var(--border-width-thin));
      transition: color 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }
    .tabs__tab[aria-selected='true'] {
      color: var(--color-action-primary);
      border-bottom-color: var(--color-action-primary);
      font-weight: var(--font-weight-semibold);
    }
    .tabs__tab:hover { color: var(--color-text-default); }
    .tabs__tab:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }

    .tabs__panels { padding-top: var(--spacing-md); }

    /* Vertical orientation */
    .tabs--vertical {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }
    .tabs--vertical .tabs__list-wrapper::before,
    .tabs--vertical .tabs__list-wrapper::after { display: none; }
    .tabs--vertical .tabs__scroll-btn { display: none !important; }
    .tabs--vertical .tabs__list {
      flex-direction: column;
      flex-shrink: 0;
      min-width: 12rem;
      border-bottom: none;
      border-right: var(--border-width-thin) solid var(--color-border-default);
      overflow-x: visible;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .tabs--vertical .tabs__tab {
      text-align: left;
      border-bottom: none;
      border-right: var(--border-width-medium) solid transparent;
      margin-bottom: 0;
      margin-right: calc(-1 * var(--border-width-thin));
    }
    .tabs--vertical .tabs__tab[aria-selected='true'] {
      border-bottom-color: transparent;
      border-right-color: var(--color-action-primary);
    }
    .tabs--vertical .tabs__panels {
      flex: 1;
      padding-top: 0;
      padding-left: var(--spacing-md);
    }

    /* Inverse theme */
    .tabs--inverse .tabs__list-wrapper::before {
      background: linear-gradient(to right, var(--color-bg-inverse), transparent);
    }
    .tabs--inverse .tabs__list-wrapper::after {
      background: linear-gradient(to left, var(--color-bg-inverse), transparent);
    }
    .tabs--inverse .tabs__list {
      border-bottom-color: var(--color-border-on-inverse);
      background-color: var(--color-bg-inverse);
      padding: 0 var(--spacing-sm);
    }
    /* Restore scroll clearance when inverse + overflow — the padding shorthand above overrides
       the general can-scroll rules at equal specificity, so re-assert with 3-class selectors. */
    .tabs--inverse.tabs--can-scroll-left .tabs__list { padding-left: var(--spacing-lg); }
    .tabs--inverse.tabs--can-scroll-right .tabs__list { padding-right: var(--spacing-lg); }
    .tabs--inverse .tabs__scroll-btn { color: var(--color-text-subtle-on-inverse); }
    .tabs--inverse .tabs__scroll-btn:hover { color: var(--color-text-inverse); }
    .tabs--inverse .tabs__tab { color: var(--color-text-subtle-on-inverse); }
    .tabs--inverse .tabs__tab[aria-selected='true'] {
      color: var(--color-text-inverse);
      border-bottom-color: var(--color-text-inverse);
    }
    .tabs--inverse .tabs__tab:hover { color: var(--color-text-inverse); }
  `;

  @property({ type: Array }) tabs: TabItem[] = [];
  @property({ reflect: true }) theme: 'default' | 'inverse' = 'default';
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ attribute: 'active-id' }) activeId = '';

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming — see utils/host-aria.ts).
  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;

  @state() private _canScrollLeft = false;
  @state() private _canScrollRight = false;

  @query('.tabs__list') private _list!: HTMLDivElement;

  private _activate(id: string) {
    this.activeId = id;
    this.dispatchEvent(new CustomEvent('change', { detail: id, bubbles: true, composed: true }));
    this.requestUpdate();
    this.querySelectorAll('candor-tab-panel').forEach((panel: Element) => {
      (panel as CandorTabPanel).active = (panel as CandorTabPanel).panelId === id;
    });
  }

  private _onKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target.getAttribute('role') !== 'tab') return;
    const ids = this.tabs.map(t => t.id);
    const current = ids.indexOf(this.activeId);
    let next = -1;
    if (e.key === 'ArrowRight' || (this.orientation === 'vertical' && e.key === 'ArrowDown')) next = (current + 1) % ids.length;
    else if (e.key === 'ArrowLeft' || (this.orientation === 'vertical' && e.key === 'ArrowUp')) next = (current - 1 + ids.length) % ids.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = ids.length - 1;
    if (next >= 0) {
      e.preventDefault();
      this._activate(ids[next]);
      const btn = this.shadowRoot?.querySelector<HTMLButtonElement>(`#tab-${ids[next]}`);
      btn?.focus();
      btn?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  }

  private _updateScrollState = () => {
    if (!this._list || this.orientation === 'vertical') {
      this._canScrollLeft = false;
      this._canScrollRight = false;
      return;
    }
    this._canScrollLeft = this._list.scrollLeft > 0;
    this._canScrollRight = this._list.scrollLeft + this._list.clientWidth < this._list.scrollWidth - 1;
  };

  private _scrollTabs(dir: -1 | 1) {
    this._list.scrollBy({ left: dir * 200, behavior: 'smooth' });
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.activeId && this.tabs.length) this.activeId = this.tabs[0].id;
    window.addEventListener('resize', this._updateScrollState);
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._updateScrollState);
    this._stopObservingAriaLabel?.();
  }

  override firstUpdated() {
    this._updateScrollState();
  }

  override updated() {
    this.querySelectorAll('candor-tab-panel').forEach((panel: Element) => {
      const p = panel as CandorTabPanel;
      p.active = p.panelId === this.activeId;
      const tab = this.tabs.find(t => t.id === p.panelId);
      if (tab) p.tabLabel = tab.label;
    });
    this._updateScrollState();
  }

  override render() {
    const cls = [
      'tabs',
      this.theme === 'inverse' ? 'tabs--inverse' : '',
      this.orientation === 'vertical' ? 'tabs--vertical' : '',
      this._canScrollLeft ? 'tabs--can-scroll-left' : '',
      this._canScrollRight ? 'tabs--can-scroll-right' : '',
    ].filter(Boolean).join(' ');
    return html`
      <div class="${cls}">
        <div class="tabs__list-wrapper">
          <button
            class="tabs__scroll-btn tabs__scroll-btn--left"
            aria-label="Scroll tabs left"
            tabindex="-1"
            @click="${() => this._scrollTabs(-1)}"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L6 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div
            class="tabs__list"
            role="tablist"
            aria-label="${this._ariaLabel || nothing}"
            aria-orientation="${this.orientation}"
            @keydown="${this._onKeydown}"
            @scroll="${this._updateScrollState}"
          >
            ${this.tabs.map((tab, i) => html`
              <button
                class="tabs__tab"
                role="tab"
                id="tab-${tab.id}"
                aria-selected="${tab.id === this.activeId}"
                aria-controls="panel-${tab.id}"
                aria-setsize="${this.tabs.length}"
                aria-posinset="${i + 1}"
                tabindex="${tab.id === this.activeId ? '0' : '-1'}"
                @click="${() => this._activate(tab.id)}"
              >${tab.label}</button>
            `)}
          </div>
          <button
            class="tabs__scroll-btn tabs__scroll-btn--right"
            aria-label="Scroll tabs right"
            tabindex="-1"
            @click="${() => this._scrollTabs(1)}"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3L10 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="tabs__panels"><slot></slot></div>
      </div>
    `;
  }
}

/**
 * One panel in a `candor-tabs` set. Meaningless on its own.
 *
 * `panel-id` must match the `id` of a `TabItem` in the parent's `tabs` array —
 * that pairing is what binds tab to panel, and a mismatch fails silently.
 *
 * `active` is managed by the parent; do not set it by hand. The host is a
 * styling wrapper and the real `role="tabpanel"` lives inside it, so slotted
 * content sits in the panel rather than beside it.
 *
 * All panels stay in the DOM; inactive ones are hidden. Content is therefore
 * still findable by in-page search and still costs render time — do not use tabs
 * to defer expensive work.
 *
 * Emits no custom events — `candor-tabs` emits `change` for the whole set.
 */
@customElement('candor-tab-panel')
export class CandorTabPanel extends LitElement {
  static override styles = css`
    :host { display: block; }
    :host(:not([active])) { display: none; }
  `;

  @property({ attribute: 'panel-id', reflect: true }) panelId = '';
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ attribute: 'tab-label' }) tabLabel = '';

  override connectedCallback(): void {
    super.connectedCallback();
    // The host is a styling wrapper; the actual role="tabpanel" lives in the
    // shadow root. Setting role="presentation" on the host makes that
    // deterministic — without it, Chrome happens to collapse the empty host
    // in the AT tree today but the behavior isn't guaranteed.
    if (!this.hasAttribute('role')) this.setAttribute('role', 'presentation');
  }

  override render() {
    return html`<div role="tabpanel" id="panel-${this.panelId}" aria-label="${this.tabLabel || nothing}" tabindex="0"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'candor-tabs': CandorTabs;
    'candor-tab-panel': CandorTabPanel;
  }
}
