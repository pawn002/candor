import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
  badgeLabel?: string;
}

@customElement('candor-navigation')
export class CandorNavigation extends LitElement {
  static override styles = css`
    :host { display: block; }
    .nav { display: flex; font-family: var(--font-family-base); }
    .nav--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--color-bg-surface);
      border-bottom: var(--border-width-thin) solid var(--color-border-default);
    }
    .nav--horizontal .nav__brand { margin-right: var(--spacing-md); }
    .nav--horizontal .nav__list { flex-direction: row; flex-wrap: wrap; margin-left: auto; }
    .nav--vertical { flex-direction: column; padding: var(--spacing-sm); width: fit-content; }
    .nav--vertical .nav__brand { margin-bottom: var(--spacing-md); }
    .nav--vertical .nav__list { flex-direction: column; }
    .nav__brand { font-weight: var(--font-weight-bold); color: var(--color-text-default); font-size: var(--font-size-lg); }
    .nav__list { display: flex; list-style: none; gap: var(--spacing-xs); margin: 0; padding: 0; }
    .nav__link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--color-text-subtle-on-surface);
      font-size: var(--font-size-base);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      text-decoration: none;
      transition: color 0.15s ease, background-color 0.15s ease;
    }
    .nav__link:hover { color: var(--color-text-default); background-color: var(--color-action-tertiary); }
    .nav__link--active { color: var(--color-action-primary); font-weight: var(--font-weight-semibold); }
    .nav__link:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); }
    .nav--inverse { background-color: var(--color-bg-inverse); border-bottom-color: var(--color-border-on-inverse); }
    .nav--inverse .nav__brand { color: var(--color-text-inverse); }
    .nav--inverse .nav__link { color: var(--color-text-subtle-on-inverse); }
    .nav--inverse .nav__link:hover { color: var(--color-text-inverse); background-color: oklch(from var(--color-text-inverse) l c h / 0.1); }
    .nav--inverse .nav__link--active { color: var(--color-text-inverse); font-weight: var(--font-weight-semibold); }
    .nav__badge {
      display: inline-flex; align-items: center; justify-content: center;
      background-color: var(--color-action-secondary); color: var(--color-text-on-action);
      font-size: var(--font-size-sm); border-radius: var(--radius-full);
      padding: 0.1em 0.4em; line-height: var(--line-height-tight); font-weight: var(--font-weight-semibold);
    }
  `;

  @property({ type: Array }) items: NavItem[] = [];
  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ reflect: true }) theme: 'default' | 'inverse' = 'default';
  @property() brand = '';
  @property() label = 'Main navigation';

  override render() {
    const cls = [
      'nav',
      `nav--${this.orientation}`,
      this.theme === 'inverse' ? 'nav--inverse' : '',
    ].filter(Boolean).join(' ');

    return html`
      <nav class="${cls}" aria-label="${this.label}">
        ${this.brand ? html`<span class="nav__brand">${this.brand}</span>` : nothing}
        <ul class="nav__list" role="list">
          ${this.items.map(item => html`
            <li class="nav__item">
              <a
                class="nav__link ${item.active ? 'nav__link--active' : ''}"
                href="${item.href}"
                aria-current="${item.active ? 'page' : nothing}"
              >
                ${item.label}
                ${item.badge ? html`<span class="nav__badge" aria-label="${item.badgeLabel || nothing}">${item.badge}</span>` : nothing}
              </a>
            </li>
          `)}
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-navigation': CandorNavigation; }
}
