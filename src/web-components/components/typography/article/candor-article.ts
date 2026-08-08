import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const articleStyles = `
  candor-article {
    display: block;
    max-width: 65ch;
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--color-text-default);
  }
  candor-article.article--font-serif { font-family: var(--font-family-serif); }
  candor-article.article--font-sans  { font-family: var(--font-family-reading); }

  candor-article h1, candor-article h2, candor-article h3,
  candor-article h4, candor-article h5, candor-article h6 {
    font-family: var(--font-family-display);
    font-weight: var(--font-weight-bold);
    font-optical-sizing: auto;
    line-height: var(--line-height-tight);
    color: var(--color-text-default);
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-sm);
  }
  candor-article h1:first-child, candor-article h2:first-child,
  candor-article h3:first-child, candor-article h4:first-child,
  candor-article h5:first-child, candor-article h6:first-child { margin-top: 0; }

  candor-article h1 { font-size: var(--font-size-h1); letter-spacing: var(--letter-spacing-tight); }
  candor-article h2 { font-size: var(--font-size-h2); letter-spacing: var(--letter-spacing-tight); }
  candor-article h3 { font-size: var(--font-size-h3); letter-spacing: var(--letter-spacing-tight); }
  candor-article h4 { font-size: var(--font-size-h4); }
  candor-article h5 { font-size: var(--font-size-base); margin-top: var(--spacing-lg); }
  candor-article h6 { font-size: var(--font-size-sm); margin-top: var(--spacing-md); }

  candor-article p { margin-bottom: var(--spacing-md); }
  candor-article p:last-child { margin-bottom: 0; }

  candor-article ul, candor-article ol {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-md);
  }
  candor-article li { margin-bottom: var(--spacing-xs); }

  candor-article blockquote {
    border-left: var(--border-width-thick) solid var(--color-blockquote-border);
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-sm) var(--spacing-md);
    font-style: italic;
    letter-spacing: var(--letter-spacing-italic);
    color: var(--color-blockquote-text);
    background-color: var(--color-blockquote-bg);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  candor-article .callout {
    border-left: var(--border-width-thick) solid var(--color-highlight-decorative);
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-default);
    background-color: var(--color-callout-bg);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }
  candor-article .callout > :last-child { margin-bottom: 0; }

  candor-article code {
    font-family: var(--font-family-mono);
    font-size: 0.875em;
    background-color: var(--color-bg-surface);
    padding: 0.1em 0.35em;
    border-radius: var(--radius-sm);
    color: var(--color-highlight);
  }

  candor-article pre {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    background-color: var(--color-bg-code);
    color: var(--color-text-code);
    border: var(--border-width-thin) solid var(--color-border-code);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin-bottom: var(--spacing-md);
  }
  candor-article pre code {
    background: none;
    padding: 0;
    font-size: 1em;
    color: inherit;
    border-radius: 0;
  }

  candor-article a {
    color: var(--color-link);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    border-bottom: var(--border-width-thin) solid transparent;
    padding-bottom: 0.15em;
  }
  candor-article a:visited {
    color: var(--color-link-visited);
    border-bottom-color: var(--color-link-visited);
  }
  candor-article a:hover { color: var(--color-link-hover); }
  candor-article a:focus-visible {
    outline: var(--focus-ring-width) solid var(--color-focus);
    outline-offset: var(--focus-ring-offset);
    border-radius: var(--radius-sm);
  }

  candor-article hr {
    border: none;
    border-top: var(--border-width-thin) solid var(--color-border-default);
    margin: var(--spacing-xl) 0;
  }

  candor-article strong { font-weight: var(--font-weight-bold); }
  candor-article em { font-style: italic; letter-spacing: var(--letter-spacing-italic); }

  candor-article abbr[title] {
    text-decoration: underline dotted;
    cursor: help;
  }

  candor-article figure {
    margin: var(--spacing-lg) 0;
  }
  candor-article figure img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius-md);
  }
  candor-article figcaption {
    font-size: var(--font-size-sm);
    color: var(--color-text-subtle);
    margin-top: var(--spacing-xs);
    font-style: italic;
    letter-spacing: 0.03em;
  }

  candor-article table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--spacing-md);
    font-family: var(--font-family-base);
    line-height: var(--line-height-tight);
  }
  candor-article table th,
  candor-article table td {
    padding: var(--spacing-xs) var(--spacing-sm);
    text-align: left;
    border-bottom: var(--border-width-thin) solid var(--color-border-default);
  }
  candor-article table td {
    font-variant-numeric: tabular-nums;
  }
  candor-article table th.numeric,
  candor-article table td.numeric {
    font-family: var(--font-family-mono);
    text-align: right;
  }
  candor-article table thead th {
    font-weight: var(--font-weight-bold);
    border-bottom: var(--border-width-medium) solid var(--color-border-strong);
  }
  candor-article table tbody tr:last-child td {
    border-bottom: none;
  }

  /* justify attribute — full justification for AI-generated or formal document prose.
     Applies only to paragraphs; headings remain left-aligned.
     Requires lang attribute on the element or an ancestor for hyphenation to work. */
  candor-article[justify] p {
    text-align: justify;
    hyphens: auto;
  }
`;

// Inject via <style> element rather than adoptedStyleSheets — Chrome does not
// apply :visited rules from constructable stylesheets.
if (!document.getElementById('candor-article-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'candor-article-styles';
  styleEl.textContent = articleStyles;
  document.head.appendChild(styleEl);
}

/**
 * Long-form prose — articles, reports, editorial content, deliberation
 * summaries. Style the `<p>`, `<h*>`, `<ul>` and `<blockquote>` markup you slot
 * in; this element supplies the reading typography around it.
 *
 * **`justify` is a transparency feature, not a stylistic preference.** Full
 * justification plus hyphenation produces the clean block edge of a formal
 * produced document, where human-authored prose has a ragged right. That makes
 * AI-generated content identifiable ambiently, without a label and without the
 * reader having to look for one — which matters in high-stakes contexts
 * (planning decisions, medical summaries, legal briefs) and aligns with the
 * spirit of EU AI Act Article 52 disclosure. **Set it on AI-generated prose.**
 * It does not make the content feel cold: register signals origin, tone is a
 * separate axis, and AI output can be written warmly.
 *
 * `justify` requires `lang` on this element or an ancestor — `hyphens: auto`
 * needs it to find a hyphenation dictionary, and without one justification
 * produces rivers of whitespace. It applies to `<p>` only; headings stay
 * left-aligned.
 *
 * `font="serif"` (Noto Serif, the default) is for authored content, human or AI
 * alike — the serif register says "produced artifact, read carefully".
 * `font="sans"` (Noto Sans) is for UI prose that needs sentence-by-sentence
 * reading but is not authored content: help documentation, onboarding, release
 * notes.
 *
 * **This is the one component that opts out of Shadow DOM.** `createRenderRoot`
 * returns `this`, and the prose styles are injected once into `document.head`,
 * because scoped styles cannot reach slotted markup deeply enough to set prose.
 * Two consequences: the styles are global rather than encapsulated, and there is
 * no shadow boundary, so `::part` does not apply here.
 *
 * Emits no custom events.
 */
@customElement('candor-article')
export class CandorArticle extends LitElement {
  @property({ reflect: true }) font: 'serif' | 'sans' = 'serif';
  @property({ type: Boolean, reflect: true }) justify = false;

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
