import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@customElement('candor-tooltip')
export class CandorTooltip extends LitElement {
  static override styles = css`
    :host { display: inline-flex; position: relative; }
    .tooltip__bubble {
      position: absolute;
      z-index: 100;
      padding: var(--spacing-2xs) var(--spacing-xs);
      background-color: var(--color-bg-inverse);
      color: var(--color-text-inverse);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
      letter-spacing: 0.02em;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
    }
    .tooltip__bubble--visible { opacity: 1; visibility: visible; }

    .tooltip__bubble--top {
      bottom: calc(100% + var(--spacing-xs));
      left: 50%;
      transform: translateX(-50%);
    }
    .tooltip__bubble--top::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--bottom {
      top: calc(100% + var(--spacing-xs));
      left: 50%;
      transform: translateX(-50%);
    }
    .tooltip__bubble--bottom::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-bottom-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--left {
      right: calc(100% + var(--spacing-xs));
      top: 50%;
      transform: translateY(-50%);
    }
    .tooltip__bubble--left::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: var(--color-bg-inverse);
    }

    .tooltip__bubble--right {
      left: calc(100% + var(--spacing-xs));
      top: 50%;
      transform: translateY(-50%);
    }
    .tooltip__bubble--right::after {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: var(--color-bg-inverse);
    }
  `;

  @property() text = '';
  @property({ reflect: true }) position: TooltipPosition = 'top';
  @state() private _visible = false;

  override render() {
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
