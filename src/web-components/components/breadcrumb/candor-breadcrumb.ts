import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

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
      letter-spacing: 0.02em;
    }
    .breadcrumb__item {
      display: flex;
      align-items: center;
    }
    .breadcrumb__item:not(:last-child)::after {
      content: '/' / '';
      margin: 0 0.5rem;
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
