import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type AccessibleTextRole = 'label' | 'message' | 'status' | 'annotation';
type AccessibleTextSize = 'sm' | 'md' | 'lg';
type AccessibleTextColor = 'primary' | 'secondary' | 'disabled' | 'error';

@customElement('candor-accessible-text')
export class CandorAccessibleText extends LitElement {
  static override styles = css`
    :host { display: inline; }
    .accessible-text {
      font-family: var(--font-family-accessible);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }
    /* Role variants */
    .accessible-text--role-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      line-height: var(--line-height-tight);
    }
    .accessible-text--role-message {
      font-size: var(--font-size-md);
      letter-spacing: 0.02em;
      line-height: var(--line-height-normal);
    }
    .accessible-text--role-status {
      font-size: var(--font-size-sm);
      letter-spacing: 0.02em;
      line-height: var(--line-height-tight);
    }
    .accessible-text--role-annotation {
      font-size: var(--font-size-sm);
      letter-spacing: 0.02em;
      line-height: var(--line-height-relaxed);
      font-style: italic;
    }
    /* Size overrides win over role sizes (cascade order) */
    .accessible-text--size-sm { font-size: var(--font-size-sm); }
    .accessible-text--size-md { font-size: var(--font-size-md); }
    .accessible-text--size-lg { font-size: var(--font-size-lg); }
    /* Color variants */
    .accessible-text--color-primary   { color: var(--color-text-default); }
    .accessible-text--color-secondary { color: var(--color-text-subtle); }
    .accessible-text--color-disabled  { color: var(--color-text-disabled); }
    .accessible-text--color-error     { color: var(--color-status-error-text); }
    /* Bold modifier */
    .accessible-text--bold { font-weight: var(--font-weight-bold); }
  `;

  @property({ reflect: true }) role_: AccessibleTextRole = 'label';
  @property({ reflect: true }) size?: AccessibleTextSize;
  @property({ reflect: true }) color: AccessibleTextColor = 'primary';
  @property({ type: Boolean }) bold = false;

  override render() {
    const cls = [
      'accessible-text',
      `accessible-text--role-${this.role_}`,
      this.size ? `accessible-text--size-${this.size}` : '',
      `accessible-text--color-${this.color}`,
      this.bold ? 'accessible-text--bold' : '',
    ].filter(Boolean).join(' ');
    return html`<span class="${cls}"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-accessible-text': CandorAccessibleText; }
}
