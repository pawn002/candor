import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type TextVariant = 'body' | 'caption' | 'label';
// No 'xs'. --font-size-xs (12px) is below the readable-text floor, and this is
// the component whose entire purpose is readable text — offering a size at which
// its own output is not permitted is an affordance that can only be misused
// (#230). 12px remains available for badge chrome and icon glyphs via the token
// itself; those are not text, and are not set through this component.
type TextSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextColor = 'primary' | 'secondary' | 'disabled';

/**
 * Body copy, captions, and uppercase UI labels — the *comprehension* half of
 * Candor's type system, set in Roboto Flex.
 *
 * Choosing between this and `candor-accessible-text` is not a judgment about
 * importance; all text in a good UI is important. The question is whether the
 * reader must decode this text precisely to know what to do next. A validation
 * error, a form label, an action-required hint → instructional, use
 * `candor-accessible-text`. A data value, a classification result, a heading
 * that organises data, running prose → the reader is forming a judgment, use
 * this.
 *
 * Two cases that look instructional and are not: a section heading labelling
 * data ("Classification breakdown") is `variant="label"` here, not
 * `candor-accessible-text role_="label"`; and a counter or readout ("14 of 47
 * reviewed") is comprehension text, so it belongs here too.
 *
 * There is no `xs` size (removed in 5.0.0). 12px is below the readable-text
 * floor, and a component whose purpose is readable text should not offer a size
 * at which its own output is disallowed. For badge chrome or icon glyphs, use
 * `--font-size-xs` directly — those are not text and are not set through here.
 *
 * `variant="label"` uppercases through CSS `text-transform`, so write the slot
 * content in sentence case: assistive technology reads the DOM text, not the
 * rendered casing.
 *
 * Emits no custom events.
 */
@customElement('candor-text')
export class CandorText extends LitElement {
  static override styles = css`
    :host { display: block; }
    .text {
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-relaxed);
      color: var(--color-text-default);
    }
    .text--body    { font-family: var(--font-family-reading); }
    .text--caption { font-family: var(--font-family-reading); font-style: italic; letter-spacing: var(--letter-spacing-italic); }
    .text--label   { font-family: var(--font-family-base); font-weight: var(--font-weight-regular); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; line-height: var(--line-height-tight); }
    .text--size-sm  { font-size: var(--font-size-sm); }
    .text--size-md  { font-size: var(--font-size-md); }
    .text--size-lg  { font-size: var(--font-size-lg); }
    .text--size-xl  { font-size: var(--font-size-xl); }
    .text--size-2xl { font-size: var(--font-size-2xl); }
    .text--size-3xl { font-size: var(--font-size-3xl); }
    .text--color-primary   { color: var(--color-text-default); }
    .text--color-secondary { color: var(--color-text-subtle); }
    .text--color-disabled  { color: var(--color-text-disabled); }
    .text--bold { font-weight: var(--font-weight-bold); }
  `;

  @property({ reflect: true }) variant: TextVariant = 'body';
  @property({ reflect: true }) size: TextSize = 'md';
  @property({ reflect: true }) color: TextColor = 'primary';
  @property({ type: Boolean }) bold = false;

  override render() {
    const cls = [
      'text',
      `text--${this.variant}`,
      `text--size-${this.size}`,
      `text--color-${this.color}`,
      this.bold ? 'text--bold' : '',
    ].filter(Boolean).join(' ');
    return html`<span class="${cls}"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-text': CandorText; }
}
