import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../../utils/host-aria';

@customElement('candor-slider')
export class CandorSlider extends LitElement {
  static formAssociated = true;
  private _internals = this.attachInternals();

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    :host([disabled]) { opacity: 0.5; pointer-events: none; }
    .slider__label {
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-default);
      letter-spacing: var(--letter-spacing-relaxed);
    }
    .slider__row {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    .slider__track {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .slider__track--gradient {
      height: 2.75rem;
      border-radius: var(--radius-sm);
      border: var(--border-width-thin) solid var(--color-border-default);
      padding: 0 var(--spacing-xs);
    }
    .slider__input {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      background: transparent;
      cursor: pointer;
      padding: 0;
      margin: 0;
    }
    .slider__input::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 99px;
      background: linear-gradient(
        to right,
        var(--color-action-primary) var(--fill-percent, 50%),
        var(--color-border-strong) var(--fill-percent, 50%)
      );
    }
    .slider__track--gradient .slider__input::-webkit-slider-runnable-track {
      background: transparent;
    }
    .slider__input::-moz-range-track {
      height: 4px;
      border-radius: 99px;
      background: linear-gradient(
        to right,
        var(--color-action-primary) var(--fill-percent, 50%),
        var(--color-border-strong) var(--fill-percent, 50%)
      );
    }
    .slider__track--gradient .slider__input::-moz-range-track {
      background: transparent;
    }
    .slider__input::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 1.375rem;
      height: 1.375rem;
      margin-top: calc((1.375rem - 4px) / -2);
      border-radius: 50%;
      background: var(--color-bg-page);
      border: 2px solid rgba(0, 0, 0, 0.18);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 0 1.5px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .slider__input:hover:not(:disabled)::-webkit-slider-thumb {
      transform: scale(1.1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
    }
    .slider__input::-moz-range-thumb {
      width: 1.375rem;
      height: 1.375rem;
      border-radius: 50%;
      background: var(--color-bg-page);
      border: 2px solid rgba(0, 0, 0, 0.18);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 0 1.5px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .slider__input:hover:not(:disabled)::-moz-range-thumb {
      transform: scale(1.1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
    }
    .slider__input:focus { outline: none; }
    .slider__input:focus-visible::-webkit-slider-thumb {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .slider__input:focus-visible::-moz-range-thumb {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }
    .slider__input:disabled { cursor: not-allowed; }
    .slider__value {
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      color: var(--color-text-subtle);
      min-width: 3ch;
      text-align: right;
      letter-spacing: var(--letter-spacing-italic);
    }
  `;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) step = 0.001;
  @property({ type: Number }) value = 0;
  @property() label?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming — see utils/host-aria.ts).
  @state() private _ariaLabel?: string;
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }
  @property({ attribute: 'value-text-fn', type: Object }) valueTextFn?: (v: number) => string;
  @property() gradient?: string;

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this._internals.setFormValue(String(this.value));
    }
  }

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

  override render() {
    const hasGradient = !!this.gradient;
    return html`
      ${this.label ? html`<label class="slider__label" for="${this._id}">${this.label}</label>` : nothing}
      <div class="slider__row">
        <div
          class="slider__track${hasGradient ? ' slider__track--gradient' : ''}"
          style="${hasGradient ? `background: ${this.gradient}` : ''}"
        >
          <input
            class="slider__input"
            type="range"
            id="${this._id}"
            .min="${String(this.min)}"
            .max="${String(this.max)}"
            .step="${String(this.step)}"
            .value="${String(this.value)}"
            style="--fill-percent:${this._fillPercent}%"
            ?disabled="${this.disabled}"
            aria-label="${this._ariaLabel || nothing}"
            aria-valuetext="${this._valueText}"
            @input="${this._onInput}"
          />
        </div>
        ${!hasGradient ? html`<span class="slider__value" aria-hidden="true">${this._valueText}</span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-slider': CandorSlider; }
}
