import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type CardVariant = 'default' | 'elevated' | 'outlined';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@customElement('candor-card')
export class CandorCard extends LitElement {
  static override styles = css`
    :host { display: block; }
    .card { border-radius: var(--radius-md); overflow: hidden; }
    .card--default  { background-color: var(--color-bg-surface); }
    .card--elevated { background-color: var(--color-bg-elevated); box-shadow: var(--shadow-md); }
    .card--outlined { background-color: var(--color-bg-page); border: var(--border-width-thin) solid var(--color-border-default); }
    .card__header { display: none; }
    .card__header:not([hidden]) {
      display: block;
      border-bottom: var(--border-width-medium) solid var(--color-border-default);
      font-family: var(--font-family-base);
      font-optical-sizing: auto;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-default);
    }
    .card__body { font-family: var(--font-family-base); color: var(--color-text-default); }
    .card__footer { display: none; }
    .card__footer:not([hidden]) {
      display: block;
      border-top: var(--border-width-thin) solid var(--color-border-default);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--color-text-subtle-on-surface);
    }
    .card--padding-none .card__header,
    .card--padding-none .card__body,
    .card--padding-none .card__footer { padding: 0; }
    .card--padding-sm .card__header,
    .card--padding-sm .card__body,
    .card--padding-sm .card__footer { padding: var(--spacing-sm); }
    .card--padding-md .card__header,
    .card--padding-md .card__body,
    .card--padding-md .card__footer { padding: var(--spacing-card-padding); }
    .card--padding-lg .card__header,
    .card--padding-lg .card__body,
    .card--padding-lg .card__footer { padding: var(--spacing-lg); }
  `;

  @property({ reflect: true }) variant: CardVariant = 'default';
  @property({ reflect: true }) padding: CardPadding = 'md';

  @state() private _hasHeader = false;
  @state() private _hasFooter = false;

  private _onHeaderSlotChange(e: Event) {
    this._hasHeader = (e.target as HTMLSlotElement).assignedElements().length > 0;
  }

  private _onFooterSlotChange(e: Event) {
    this._hasFooter = (e.target as HTMLSlotElement).assignedElements().length > 0;
  }

  override render() {
    return html`
      <div class="card card--${this.variant} card--padding-${this.padding}">
        <div class="card__header" ?hidden=${!this._hasHeader}>
          <slot name="header" @slotchange=${this._onHeaderSlotChange}></slot>
        </div>
        <div class="card__body"><slot></slot></div>
        <div class="card__footer" ?hidden=${!this._hasFooter}>
          <slot name="footer" @slotchange=${this._onFooterSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-card': CandorCard; }
}
