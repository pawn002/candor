import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('candor-accordion-item')
export class CandorAccordionItem extends LitElement {
  static styles = css`
    :host { display: block; }
    :host(:last-child) .accordion-item { border-bottom: none; }
    .accordion-item { border-bottom: 1px solid var(--color-border-strong); }
    .accordion-item > summary { list-style: none; }
    .accordion-item > summary::-webkit-details-marker { display: none; }
    .accordion-item__summary {
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.75rem; padding: 0.875rem 0; cursor: pointer; color: var(--color-text-default);
    }
    .accordion-item__summary:hover { color: var(--color-action-primary); }
    .accordion-item__summary:focus { outline: none; }
    .accordion-item__summary:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: 2px; border-radius: var(--radius-sm); }
    .accordion-item__title { font-family: var(--font-family-accessible); font-size: var(--font-size-md); font-weight: var(--font-weight-bold); letter-spacing: 0.02em; line-height: var(--line-height-tight); flex: 1; }
    .accordion-item__title--subtle { font-weight: var(--font-weight-regular); color: var(--color-text-subtle); }
    .accordion-item__title--quiet { font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-subtle); }
    .accordion-item__chevron { font-size: 1rem; line-height: 1; flex-shrink: 0; color: var(--color-text-subtle-on-surface); transition: transform 0.22s ease; }
    details[open] .accordion-item__chevron { transform: rotate(180deg); }
    .accordion-item__panel { display: grid; grid-template-rows: 1fr; }
    .accordion-item__content { overflow: hidden; padding-bottom: 0.875rem; font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); line-height: var(--line-height-normal); }
  `;

  @property() heading = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) variant: 'default' | 'subtle' | 'quiet' = 'default';

  render() {
    const titleCls = [
      'accordion-item__title',
      this.variant === 'subtle' ? 'accordion-item__title--subtle' : '',
      this.variant === 'quiet' ? 'accordion-item__title--quiet' : '',
    ].filter(Boolean).join(' ');
    return html`
      <details class="accordion-item" ?open="${this.open}">
        <summary class="accordion-item__summary">
          <span class="${titleCls}">${this.heading}</span>
          <span class="accordion-item__chevron" aria-hidden="true">▾</span>
        </summary>
        <div class="accordion-item__panel">
          <div class="accordion-item__content"><slot></slot></div>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-accordion-item': CandorAccordionItem; }
}
