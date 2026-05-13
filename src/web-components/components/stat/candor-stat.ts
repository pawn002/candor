import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type StatColor = 'default' | 'success' | 'warning' | 'error' | 'info';

@customElement('candor-stat')
export class CandorStat extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .stat__label {
      margin: 0;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-regular);
      color: var(--color-text-subtle-on-surface);
      letter-spacing: 0.02em;
      text-align: center;
    }
    .stat__value {
      margin: 0;
      font-family: var(--font-family-display);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      font-optical-sizing: auto;
      line-height: 1;
      letter-spacing: -0.02em;
      color: var(--color-text-default);
    }
    :host([color='success']) .stat__value { color: var(--color-status-success); }
    :host([color='warning']) .stat__value { color: var(--color-status-warning); }
    :host([color='error'])   .stat__value { color: var(--color-status-error); }
    :host([color='info'])    .stat__value { color: var(--color-link); }
    .stat__unit {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-regular);
      color: var(--color-text-subtle);
      letter-spacing: 0;
    }
  `;

  @property({ reflect: true }) color: StatColor = 'default';
  @property() value: string | number = '';
  @property() unit?: string;
  @property() label?: string;

  render() {
    return html`
      ${this.label ? html`<p class="stat__label">${this.label}</p>` : nothing}
      <p class="stat__value" aria-label="${this.unit ? `${this.value} ${this.unit}` : nothing}">
        ${this.value}${this.unit ? html`<span class="stat__unit">${this.unit}</span>` : nothing}
      </p>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-stat': CandorStat; }
}
