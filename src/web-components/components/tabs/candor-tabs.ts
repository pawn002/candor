import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface TabItem {
  id: string;
  label: string;
}

@customElement('candor-tabs')
export class CandorTabs extends LitElement {
  static override styles = css`
    :host { display: block; }
    .tabs__list {
      display: flex;
      flex-direction: row;
      border-bottom: var(--border-width-thin) solid var(--color-border-default);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs__list::-webkit-scrollbar { display: none; }
    .tabs__tab {
      appearance: none; background: none; border: none; cursor: pointer;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-family: var(--font-family-base); font-size: var(--font-size-base);
      font-weight: var(--font-weight-regular); color: var(--color-text-subtle);
      border-bottom: 2px solid transparent; margin-bottom: -1px;
      transition: color 0.15s ease, border-color 0.15s ease;
    }
    .tabs__tab[aria-selected='true'] { color: var(--color-action-primary); border-bottom-color: var(--color-action-primary); font-weight: var(--font-weight-semibold); }
    .tabs__tab:hover { color: var(--color-text-default); }
    .tabs__tab:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .tabs__panels { padding-top: var(--spacing-md); }
    .tabs--inverse .tabs__list { border-bottom-color: var(--color-border-on-inverse); background-color: var(--color-bg-inverse); padding: 0 var(--spacing-sm); }
    .tabs--inverse .tabs__tab { color: var(--color-text-subtle-on-inverse); }
    .tabs--inverse .tabs__tab[aria-selected='true'] { color: var(--color-text-inverse); border-bottom-color: var(--color-text-inverse); }
    .tabs--inverse .tabs__tab:hover { color: var(--color-text-inverse); }
  `;

  @property({ type: Array }) tabs: TabItem[] = [];
  @property({ reflect: true }) theme: 'default' | 'inverse' = 'default';
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ attribute: 'active-id' }) activeId = '';
  @property({ attribute: 'aria-label' }) ariaLabel_ = '';

  private _activate(id: string) {
    this.activeId = id;
    this.dispatchEvent(new CustomEvent('tab-change', { detail: id, bubbles: true, composed: true }));
    this.requestUpdate();
    // Sync panel visibility
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
    if (e.key === 'ArrowRight') next = (current + 1) % ids.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + ids.length) % ids.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = ids.length - 1;
    if (next >= 0) {
      e.preventDefault();
      this._activate(ids[next]);
      this.shadowRoot?.querySelector<HTMLButtonElement>(`#tab-${ids[next]}`)?.focus();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.activeId && this.tabs.length) this.activeId = this.tabs[0].id;
  }

  override updated() {
    // Sync panels when tabs/activeId changes
    this.querySelectorAll('candor-tab-panel').forEach((panel: Element) => {
      (panel as CandorTabPanel).active = (panel as CandorTabPanel).panelId === this.activeId;
    });
  }

  override render() {
    const cls = ['tabs', this.theme === 'inverse' ? 'tabs--inverse' : ''].filter(Boolean).join(' ');
    return html`
      <div class="${cls}">
        <div class="tabs__list" role="tablist" aria-label="${this.ariaLabel_ || nothing}" aria-orientation="${this.orientation}" @keydown="${this._onKeydown}">
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
        <div class="tabs__panels"><slot></slot></div>
      </div>
    `;
  }
}

@customElement('candor-tab-panel')
export class CandorTabPanel extends LitElement {
  static override styles = css`
    :host { display: block; }
    :host(:not([active])) { display: none; }
  `;

  @property({ attribute: 'panel-id', reflect: true }) panelId = '';
  @property({ type: Boolean, reflect: true }) active = false;

  override render() {
    return html`<div role="tabpanel" id="panel-${this.panelId}" aria-labelledby="tab-${this.panelId}" tabindex="0"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'candor-tabs': CandorTabs;
    'candor-tab-panel': CandorTabPanel;
  }
}
