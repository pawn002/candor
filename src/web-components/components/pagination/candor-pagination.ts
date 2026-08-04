import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { phCaretDownBold } from '../../icons';
import { observeHostAriaLabel } from '../../utils/host-aria';

type PageItem = number | 'ellipsis';

@customElement('candor-pagination')
export class CandorPagination extends LitElement {
  static override styles = css`
    :host { display: block; }
    .pagination {
      display: flex;
      align-items: center;
      gap: var(--spacing-2xs);
    }
    .pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--spacing-lg);
      height: var(--spacing-lg);
      padding: 0 var(--spacing-2xs);
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--color-text-subtle);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-italic);
      line-height: 1;
      cursor: pointer;
      transition: background-color 120ms ease, color 120ms ease;
    }
    .pagination__btn:hover:not(:disabled) {
      background-color: var(--color-bg-surface);
      color: var(--color-text-default);
    }
    .pagination__btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .pagination__btn:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
      border-radius: var(--radius-sm);
    }
    .pagination__btn--current {
      background-color: var(--color-action-primary);
      color: var(--color-text-on-action);
      font-weight: var(--font-weight-medium);
    }
    .pagination__btn--current:hover:not(:disabled) {
      background-color: var(--color-action-primary);
      color: var(--color-text-on-action);
    }
    .pagination__icon { width: var(--font-size-sm); height: var(--font-size-sm); }
    .pagination__icon--prev { transform: rotate(90deg); }
    .pagination__icon--next { transform: rotate(-90deg); }
    .pagination__ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--spacing-lg);
      height: var(--spacing-lg);
      color: var(--color-text-subtle);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      letter-spacing: var(--letter-spacing-italic);
      user-select: none;
    }
    .pagination__status {
      display: inline-flex;
      align-items: center;
      height: var(--spacing-lg);
      padding: 0 var(--spacing-xs);
      color: var(--color-text-default);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      letter-spacing: var(--letter-spacing-italic);
      line-height: 1;
      white-space: nowrap;
    }
  `;

  @property({ type: Number, attribute: 'current-page' }) currentPage = 1;
  @property({ type: Number, attribute: 'total-pages' }) totalPages = 1;
  // Compact mode: ‹ Prev · Page X of Y · Next › — drops the numbered buttons
  // and ellipses. Opt-in (e.g. a responsive app sets it from a media query).
  @property({ type: Boolean, reflect: true }) compact = false;

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming — see utils/host-aria.ts).
  // Default 'Pagination' is preserved when consumer doesn't override.
  @state() private _ariaLabel = 'Pagination';
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

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
    this.dispatchEvent(new CustomEvent('change', { detail: clamped, bubbles: true, composed: true }));
    this.requestUpdate();
  }

  private _renderPrev() {
    return html`
      <button class="pagination__btn pagination__prev" ?disabled="${this.currentPage <= 1}" aria-label="Previous page" @click="${() => this._goTo(this.currentPage - 1)}">
        <svg class="pagination__icon pagination__icon--prev" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
      </button>
    `;
  }

  private _renderNext() {
    return html`
      <button class="pagination__btn pagination__next" ?disabled="${this.currentPage >= this.totalPages}" aria-label="Next page" @click="${() => this._goTo(this.currentPage + 1)}">
        <svg class="pagination__icon pagination__icon--next" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
      </button>
    `;
  }

  override render() {
    if (this.compact) {
      // Page position is the sole on-screen indicator here, so announce it
      // politely when Prev/Next changes the page (focus stays on the button).
      return html`
        <nav aria-label="${this._ariaLabel}" class="pagination pagination--compact">
          ${this._renderPrev()}
          <span class="pagination__status" aria-live="polite" aria-atomic="true">Page ${this.currentPage} of ${this.totalPages}</span>
          ${this._renderNext()}
        </nav>
      `;
    }
    return html`
      <nav aria-label="${this._ariaLabel}" class="pagination">
        ${this._renderPrev()}
        ${this._pages.map((item) =>
          item === 'ellipsis'
            ? html`<span class="pagination__ellipsis" aria-hidden="true">…</span>`
            : html`<button
                class="pagination__btn pagination__page ${item === this.currentPage ? 'pagination__btn--current' : ''}"
                aria-current="${item === this.currentPage ? 'page' : nothing}"
                aria-label="Page ${item}"
                @click="${() => this._goTo(item as number)}"
              >${item}</button>`
        )}
        ${this._renderNext()}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-pagination': CandorPagination; }
}
