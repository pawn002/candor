import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingColor = 'primary' | 'secondary' | 'disabled';

@customElement('candor-heading')
export class CandorHeading extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-bold);
      font-optical-sizing: auto;
      line-height: var(--line-height-tight);
      margin: 0;
    }
    :host([color='primary'])  { color: var(--color-text-default); }
    :host([color='secondary']) { color: var(--color-text-subtle); }
    :host([color='disabled']) { color: var(--color-text-disabled); }
    :host([level='h1']) { font-size: var(--font-size-h1); letter-spacing: var(--letter-spacing-tight); }
    :host([level='h2']) { font-size: var(--font-size-h2); letter-spacing: var(--letter-spacing-tight); }
    :host([level='h3']) { font-size: var(--font-size-h3); letter-spacing: var(--letter-spacing-tight); }
    :host([level='h4']) { font-size: var(--font-size-h4); }
    :host([level='h5']) { font-size: var(--font-size-h5); }
    :host([level='h6']) { font-size: var(--font-size-h6); }
  `;

  @property({ reflect: true }) level: HeadingLevel = 'h2';
  @property({ reflect: true }) color: HeadingColor = 'primary';

  private get _ariaLevel(): number {
    return parseInt(this.level.substring(1), 10);
  }

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'heading');
    this.setAttribute('aria-level', String(this._ariaLevel));
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('level')) {
      this.setAttribute('aria-level', String(this._ariaLevel));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-heading': CandorHeading; }
}
