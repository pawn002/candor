import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
type BadgeSize = 'sm' | 'md';

@customElement('candor-badge')
export class CandorBadge extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      font-family: var(--font-family-accessible);
      letter-spacing: 0.06em;
      font-weight: var(--font-weight-bold);
      white-space: nowrap;
      line-height: var(--line-height-tight);
    }
    .badge--sm { font-size: var(--font-size-sm); padding: 0.2rem 0.5rem; }
    .badge--md { font-size: var(--font-size-md); padding: 0.25rem 0.65rem; }
    .badge--default   { background-color: var(--color-bg-surface); color: var(--color-text-subtle-on-surface); }
    .badge--primary   { background-color: var(--color-action-primary); color: var(--color-text-on-action); }
    .badge--secondary { background-color: var(--color-action-secondary); color: var(--color-text-on-action); }
    .badge--success   { background-color: var(--color-status-success-bg); color: var(--color-status-success-text); }
    .badge--error     { background-color: var(--color-status-error-bg); color: var(--color-status-error-text); }
    .badge--warning   { background-color: var(--color-status-warning-bg); color: var(--color-status-warning-text); }
  `;

  @property({ reflect: true }) variant: BadgeVariant = 'default';
  @property({ reflect: true }) size: BadgeSize = 'md';

  override render() {
    return html`<span class="badge badge--${this.variant} badge--${this.size}"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-badge': CandorBadge; }
}
