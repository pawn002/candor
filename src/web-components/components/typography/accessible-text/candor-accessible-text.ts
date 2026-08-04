import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type AccessibleTextRole = 'label' | 'message' | 'status' | 'annotation';
type AccessibleTextSize = 'sm' | 'md' | 'lg';
type AccessibleTextColor = 'primary' | 'secondary' | 'disabled' | 'error';

@customElement('candor-accessible-text')
export class CandorAccessibleText extends LitElement {
  static override styles = css`
    :host {
      display: inline;
      font-family: var(--font-family-accessible);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: var(--color-text-default);
    }

    /* Role variants */
    :host([role_="label"]) {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      line-height: var(--line-height-tight);
    }
    :host([role_="message"]) {
      font-size: var(--font-size-md);
      letter-spacing: 0.02em;
      line-height: var(--line-height-normal);
    }
    /* 16px, not 14px. The status role carries validation errors and state
       changes — Tier 1 "must read to act" content — and Tier 1 regular text is
       required to be 16px or larger, because the 14px floor is unreachable by
       any chromatic text colour (#240). candor-input already renders its own
       validation errors at 16px; this makes the generic role agree with it
       (#208). NB: this comment sits inside a tagged template literal, so it must
       contain no backtick characters — one would terminate the literal. */
    :host([role_="status"]) {
      font-size: var(--font-size-md);
      letter-spacing: 0.02em;
      line-height: var(--line-height-tight);
    }
    :host([role_="annotation"]) {
      font-size: var(--font-size-sm);
      letter-spacing: 0.02em;
      line-height: var(--line-height-relaxed);
      font-style: italic;
    }

    /* Size overrides — higher specificity via two attribute selectors wins over role */
    :host([role_][size="sm"]) { font-size: var(--font-size-sm); }
    :host([role_][size="md"]) { font-size: var(--font-size-md); }
    :host([role_][size="lg"]) { font-size: var(--font-size-lg); }

    /* Color variants */
    :host([color="primary"])   { color: var(--color-text-default); }
    :host([color="secondary"]) { color: var(--color-text-subtle); }
    :host([color="disabled"])  { color: var(--color-text-disabled); }
    :host([color="error"])     { color: var(--color-status-error-text); }

    /* Bold modifier */
    :host([bold]) { font-weight: var(--font-weight-bold); }

    .accessible-text { display: contents; }
  `;

  @property({ reflect: true }) role_: AccessibleTextRole = 'label';
  @property({ reflect: true }) size?: AccessibleTextSize;
  @property({ reflect: true }) color: AccessibleTextColor = 'primary';
  @property({ type: Boolean, reflect: true }) bold = false;

  override render() {
    return html`<span class="accessible-text"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-accessible-text': CandorAccessibleText; }
}
