import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@customElement('candor-tooltip')
export class CandorTooltip extends LitElement {
  static styles = css`
    :host { display: inline-flex; position: relative; }
    .tooltip__bubble {
      position: absolute;
      z-index: 1000;
      padding: 0.375rem 0.625rem;
      background-color: var(--color-bg-inverse);
      color: var(--color-text-inverse);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      border-radius: var(--radius-sm);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
      letter-spacing: 0.02em;
    }
    .tooltip__bubble--visible { opacity: 1; }
    .tooltip__bubble--top    { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    .tooltip__bubble--bottom { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
    .tooltip__bubble--left   { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
    .tooltip__bubble--right  { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
  `;

  @property() text = '';
  @property({ reflect: true }) position: TooltipPosition = 'top';
  @state() private _visible = false;

  render() {
    return html`
      <slot
        @mouseenter="${() => this._visible = true}"
        @mouseleave="${() => this._visible = false}"
        @focusin="${() => this._visible = true}"
        @focusout="${() => this._visible = false}"
        @keydown="${(e: KeyboardEvent) => e.key === 'Escape' && (this._visible = false)}"
      ></slot>
      <div
        aria-hidden="true"
        class="tooltip__bubble tooltip__bubble--${this.position} ${this._visible ? 'tooltip__bubble--visible' : ''}"
      >${this.text}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-tooltip': CandorTooltip; }
}
