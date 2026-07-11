import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * Inline code — the drop-in that bundles the `--color-bg-code` / `--color-text-code`
 * token pair (plus mono font, padding, radius, border) so they can't be
 * half-applied. Using `--color-bg-code` alone yields invisible dark-on-dark text
 * (#170); this element renders the pair correctly by construction.
 *
 * For block/multiline code, wrap in a `<pre>` or use a syntax-highlighting
 * surface — this element is for inline spans within prose.
 */
@customElement('candor-code')
export class CandorCode extends LitElement {
  static override styles = css`
    :host { display: inline; }
    code {
      font-family: var(--font-family-mono);
      /* Clamp to the 14px readable floor: 0.9em of the surrounding text, but
         never below --font-size-sm even inside 14px prose. */
      font-size: max(0.9em, var(--font-size-sm));
      background-color: var(--color-bg-code);
      color: var(--color-text-code);
      border: var(--border-width-thin) solid var(--color-border-code);
      border-radius: var(--radius-sm);
      padding: 0.1em 0.35em;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }
  `;

  override render() {
    return html`<code part="code"><slot></slot></code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-code': CandorCode; }
}
