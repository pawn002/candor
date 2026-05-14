import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type PageItem = number | 'ellipsis';

@customElement('candor-pagination')
export class CandorPagination extends LitElement {
  static override styles = css`
    :host { display: block; }
    .pagination {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-family: var(--font-family-base);
    }
    .pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.25rem;
      height: 2.25rem;
      padding: 0 0.5rem;
      border: var(--border-width-thin) solid var(--color-border-default);
      border-radius: var(--radius-sm);
      background: transparent;
      font-family: inherit;
      font-size: var(--font-size-sm);
      color: var(--color-text-default);
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .pagination__btn:hover:not(:disabled) { background-color: var(--color-bg-surface); border-color: var(--color-border-strong); }
    .pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .pagination__btn:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .pagination__btn--current { background-color: var(--color-action-primary); color: var(--color-text-on-action); border-color: var(--color-action-primary); font-weight: var(--font-weight-semibold); }
    .pagination__btn--current:hover:not(:disabled) { background-color: var(--color-action-primary-hover); border-color: var(--color-action-primary-hover); }
    .pagination__ellipsis { padding: 0 0.25rem; color: var(--color-text-subtle); font-size: var(--font-size-sm); user-select: none; }
  `;

  @property({ type: Number, attribute: 'current-page' }) currentPage = 1;
  @property({ type: Number, attribute: 'total-pages' }) totalPages = 1;
  @property({ attribute: 'aria-label' }) ariaLabel_ = 'Pagination';

  private get _pages(): PageItem[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const items: PageItem[] = [1];
    if (current > 3) items.push('ellipsis');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) items.push(i);
    if (current < total - 2) items.push('ellipsis');
    items.push(total);
    return items;
  }

  private _goTo(page: number) {
    const clamped = Math.max(1, Math.min(page, this.totalPages));
    this.currentPage = clamped;
    this.dispatchEvent(new CustomEvent('page-change', { detail: clamped, bubbles: true, composed: true }));
    this.requestUpdate();
  }

  override render() {
    return html`
      <nav aria-label="${this.ariaLabel_}" class="pagination">
        <button class="pagination__btn pagination__prev" ?disabled="${this.currentPage <= 1}" aria-label="Previous page" @click="${() => this._goTo(this.currentPage - 1)}">
          ‹
        </button>
        ${this._pages.map((item, i) =>
          item === 'ellipsis'
            ? html`<span class="pagination__ellipsis" aria-hidden="true">…</span>`
            : html`<button
                class="pagination__btn pagination__page ${item === this.currentPage ? 'pagination__btn--current' : ''}"
                aria-current="${item === this.currentPage ? 'page' : nothing}"
                aria-label="Page ${item}"
                @click="${() => this._goTo(item as number)}"
              >${item}</button>`
        )}
        <button class="pagination__btn pagination__next" ?disabled="${this.currentPage >= this.totalPages}" aria-label="Next page" @click="${() => this._goTo(this.currentPage + 1)}">
          ›
        </button>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-pagination': CandorPagination; }
}
