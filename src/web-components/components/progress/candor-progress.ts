import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type ProgressType = 'bar' | 'spinner';
type ProgressSize = 'sm' | 'md' | 'lg';

@customElement('candor-progress')
export class CandorProgress extends LitElement {
  static override styles = css`
    :host { display: block; }
    .progress-bar-wrapper { display: flex; flex-direction: column; gap: 0.375rem; }
    .progress-bar__label { font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; }
    .progress-bar {
      height: 8px;
      background-color: var(--color-bg-surface);
      border-radius: var(--radius-full);
      overflow: hidden;
      border: var(--border-width-thin) solid var(--color-border-default);
    }
    .progress-bar__fill {
      height: 100%;
      background-color: var(--color-action-primary);
      border-radius: var(--radius-full);
      transition: width 0.3s ease-in-out;
    }
    .progress-bar__fill--indeterminate {
      width: 40% !important;
      animation: progress-indeterminate 1.5s ease-in-out infinite;
    }
    @keyframes progress-indeterminate {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }
    .spinner { animation: spinner-rotate 1.2s linear infinite; display: block; }
    .spinner--sm { width: 1.25rem; height: 1.25rem; }
    .spinner--md { width: 2rem; height: 2rem; }
    .spinner--lg { width: 3rem; height: 3rem; }
    .spinner__track { stroke: var(--color-border-default); }
    .spinner__arc {
      stroke: var(--color-action-primary);
      stroke-dasharray: 56.5 56.5;
      stroke-dashoffset: 0;
      transform-origin: center;
      animation: spinner-arc 1.2s ease-in-out infinite;
    }
    @keyframes spinner-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes spinner-arc {
      0%   { stroke-dasharray: 1 113; stroke-dashoffset: 0; }
      50%  { stroke-dasharray: 85 113; stroke-dashoffset: -35; }
      100% { stroke-dasharray: 85 113; stroke-dashoffset: -113; }
    }
  `;

  @property({ reflect: true }) type: ProgressType = 'bar';
  @property({ type: Number }) value = 0;
  @property({ type: Boolean }) indeterminate = false;
  @property() label = '';
  @property({ reflect: true }) size: ProgressSize = 'md';

  private _labelId = `progress-label-${Math.random().toString(36).slice(2, 9)}`;

  override render() {
    if (this.type === 'spinner') {
      return html`
        <svg class="spinner spinner--${this.size}" role="status" aria-label="${this.label || 'Loading'}" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <title>${this.label || 'Loading'}</title>
          <circle class="spinner__track" cx="22" cy="22" r="18" stroke-width="4"/>
          <circle class="spinner__arc" cx="22" cy="22" r="18" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `;
    }
    return html`
      <div class="progress-bar-wrapper">
        ${this.label ? html`<div class="progress-bar__label" id="${this._labelId}">${this.label}</div>` : nothing}
        <div
          class="progress-bar"
          role="progressbar"
          aria-valuenow="${this.indeterminate ? nothing : this.value}"
          aria-valuemin="${this.indeterminate ? nothing : '0'}"
          aria-valuemax="${this.indeterminate ? nothing : '100'}"
          aria-valuetext="${this.indeterminate ? nothing : `${Math.round(this.value)}%`}"
          aria-label="${this.label ? nothing : 'Loading'}"
          aria-labelledby="${this.label ? this._labelId : nothing}"
        >
          <div
            class="progress-bar__fill ${this.indeterminate ? 'progress-bar__fill--indeterminate' : ''}"
            style="${this.indeterminate ? '' : `width:${this.value}%`}"
          ></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-progress': CandorProgress; }
}
