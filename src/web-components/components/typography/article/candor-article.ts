import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Light DOM — disables Shadow DOM so prose styles reach slotted content,
// equivalent to Angular's ViewEncapsulation.None.
@customElement('candor-article')
export class CandorArticle extends LitElement {
  @property({ reflect: true }) font: 'serif' | 'sans' = 'serif';

  override createRenderRoot() { return this; }

  override connectedCallback() {
    super.connectedCallback();
    this.classList.add('article');
    this._updateFontClass();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('font')) this._updateFontClass();
  }

  private _updateFontClass() {
    this.classList.toggle('article--font-serif', this.font === 'serif');
    this.classList.toggle('article--font-sans', this.font === 'sans');
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-article': CandorArticle; }
}
