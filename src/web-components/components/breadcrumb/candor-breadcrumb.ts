import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * A hierarchical trail showing where the current page sits.
 *
 * Items come from the `items` array, not from slotted markup. **Include the
 * current page as the last item** — the component marks it `aria-current="page"`
 * and renders it as static text rather than a link, so omitting it leaves the
 * trail pointing at ancestors with no anchor for where the user actually is.
 *
 * The component supplies its own `<nav aria-label="Breadcrumb">` wrapper. Do not
 * nest it in another `<nav>`; that produces two navigation landmarks for one
 * control.
 *
 * Separators are drawn by a CSS `::after` using the content alt-text form
 * (`content: '/' / ''`), so the slash is painted but announces as nothing. The
 * `<ol>`/`<li>` structure carries the hierarchy for assistive technology. There
 * is no separator element to style or replace.
 *
 * This is a trail, not a history stack: it should reflect the site's structure,
 * not the route the user took to arrive.
 *
 * Emits no custom events — items are ordinary links and navigate directly.
 */
@customElement('candor-breadcrumb')
export class CandorBreadcrumb extends LitElement {
  static override styles = css`
    :host { display: block; }
    .breadcrumb { display: block; }
    .breadcrumb__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      letter-spacing: 0.04em;
    }
    .breadcrumb__item {
      display: flex;
      align-items: center;
    }
    .breadcrumb__item:not(:last-child)::after {
      content: '/' / '';
      margin: 0 var(--spacing-xs);
      color: var(--color-text-subtle);
      pointer-events: none;
    }
    .breadcrumb__link {
      color: var(--color-link);
      font-weight: var(--font-weight-bold);
      text-decoration: none;
    }
    .breadcrumb__link:hover { color: var(--color-link-hover); text-decoration: underline; }
    .breadcrumb__link:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
      border-radius: var(--radius-sm);
    }
    .breadcrumb__current {
      color: var(--color-text-default);
      font-weight: var(--font-weight-bold);
    }
    .breadcrumb__item:only-child .breadcrumb__current { letter-spacing: 0.06em; }
  `;

  @property({ type: Array }) items: BreadcrumbItem[] = [];

  override render() {
    return html`
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <ol class="breadcrumb__list">
          ${this.items.map((item, i) => {
            const isLast = i === this.items.length - 1;
            return html`
              <li class="breadcrumb__item">
                ${isLast
                  ? html`<span class="breadcrumb__current" aria-current="page">${item.label}</span>`
                  : html`<a class="breadcrumb__link" href="${item.href || '#'}">${item.label}</a>`}
              </li>
            `;
          })}
        </ol>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-breadcrumb': CandorBreadcrumb; }
}
