import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('candor-slider')
export class CandorSlider extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static styles = css`
    :host { display: block; }
    .slider-wrapper { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .slider-label { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-default); }
    .slider-row { display: flex; align-items: center; gap: var(--spacing-sm); }
    .slider {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      height: 4px;
      border-radius: var(--radius-full);
      background: linear-gradient(to right, var(--color-action-primary) var(--fill-percent, 0%), var(--color-border-default) var(--fill-percent, 0%));
      outline: none;
      cursor: pointer;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: var(--color-action-primary);
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    }
    .slider::-moz-range-thumb {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: var(--color-action-primary);
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      cursor: pointer;
    }
    .slider:focus-visible::-webkit-slider-thumb { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: 2px; }
    .slider:disabled { opacity: 0.5; cursor: not-allowed; }
    .slider-value { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); min-width: 3ch; text-align: right; }
  `;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) step = 0.001;
  @property({ type: Number }) value = 0;
  @property() label?: string;
  @property({ attribute: 'aria-label' }) ariaLabel_?: string;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: 'value-text-fn', type: Object }) valueTextFn?: (v: number) => string;

  private _id = `candor-slider-${Math.random().toString(36).slice(2, 9)}`;

  private get _fillPercent() {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  private get _valueText() {
    return this.valueTextFn ? this.valueTextFn(this.value) : String(this.value);
  }

  private _onInput(e: Event) {
    this.value = parseFloat((e.target as HTMLInputElement).value);
    this._internals.setFormValue(String(this.value));
    this.dispatchEvent(new CustomEvent('value-change', { detail: this.value, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="slider-wrapper">
        ${this.label ? html`<label class="slider-label" for="${this._id}">${this.label}</label>` : nothing}
        <div class="slider-row">
          <input
            class="slider"
            type="range"
            id="${this._id}"
            .min="${String(this.min)}"
            .max="${String(this.max)}"
            .step="${String(this.step)}"
            .value="${String(this.value)}"
            style="--fill-percent:${this._fillPercent}%"
            ?disabled="${this.disabled}"
            aria-label="${this.ariaLabel_ || nothing}"
            aria-valuetext="${this._valueText}"
            @input="${this._onInput}"
          />
          <span class="slider-value" aria-hidden="true">${this._valueText}</span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-slider': CandorSlider; }
}
