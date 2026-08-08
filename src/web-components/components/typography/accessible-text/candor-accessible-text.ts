import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { phCheckCircleFill, phWarningFill, phXCircleFill, phInfoFill } from '../../../icons';

type AccessibleTextRole = 'label' | 'message' | 'status' | 'state' | 'annotation';
type AccessibleTextSize = 'sm' | 'md' | 'lg';
type AccessibleTextColor = 'primary' | 'secondary' | 'disabled' | 'error';
type AccessibleTextTone = 'success' | 'warning' | 'error' | 'info';

const TONE_ICON: Record<AccessibleTextTone, string> = {
  success: phCheckCircleFill,
  warning: phWarningFill,
  error: phXCircleFill,
  info: phInfoFill,
};

/**
 * Instructional text set in Atkinson Hyperlegible — text the reader must decode
 * precisely to know what to do next.
 *
 * The test against `candor-text` is functional, not a matter of importance:
 * could a reader who cannot resolve the glyphs still act correctly? If no, it
 * belongs here. Form labels, validation errors and action-required hints do;
 * data values, results and counters do not.
 *
 * The property is `role_`, not `role`. It reflects to an attribute, and
 * reflecting to `role` would overwrite the element's own ARIA role — so the
 * attribute a consumer writes is `role_="status"`.
 *
 * `role_` also decides the size, and the two are not independently adjustable
 * for a reason. `status` is 16px because it is the *sole* channel for an
 * instruction: an icon can say something is wrong but not which field or what
 * format, so no redundant channel makes 14px sufficient. `state` stays at 14px
 * because it renders an `aria-hidden` tone icon that genuinely carries the
 * outcome. The test between them: could a reader who cannot resolve the glyphs
 * still act correctly? Yes → `state`. No → `status`.
 *
 * Because `state`'s icon carries the outcome, its text needs no colour — leave
 * `color` at `primary` and let `tone` select the icon. Moving colour onto the
 * icon is what removes the contrast constraint rather than negotiating with it.
 *
 * Do not hand-type a status glyph into the slot (`✕ Error: …`). A screen reader
 * announces the character, and it is invisible to the contrast audit. Use
 * `role_="state"` when an icon is wanted.
 *
 * Bold is for hierarchy and labelling only — `role_="label"` applies it already.
 * Do not add `bold` to an error or status message: the colour carries urgency,
 * and bold on top of it is double-emphasis.
 *
 * Emits no custom events.
 */
@customElement('candor-accessible-text')
export class CandorAccessibleText extends LitElement {
  static override styles = css`
    :host {
      display: inline;
      font-family: var(--font-family-accessible);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: var(--color-text-default);
    }

    /* Role variants */
    :host([role_="label"]) {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      line-height: var(--line-height-tight);
    }
    :host([role_="message"]) {
      font-size: var(--font-size-md);
      letter-spacing: 0.02em;
      line-height: var(--line-height-normal);
    }
    /* 16px, not 14px. The status role carries validation errors and state
       changes — Tier 1 "must read to act" content — and Tier 1 regular text is
       required to be 16px or larger, because the 14px floor is unreachable by
       any chromatic text colour (#240). candor-input already renders its own
       validation errors at 16px; this makes the generic role agree with it
       (#208). NB: this comment sits inside a tagged template literal, so it must
       contain no backtick characters — one would terminate the literal. */
    :host([role_="status"]) {
      font-size: var(--font-size-md);
      letter-spacing: 0.02em;
      line-height: var(--line-height-tight);
    }
    /* Stays at 14px, unlike status, because the component renders a tone icon
       that carries the outcome. That makes the meaning redundantly coded by a
       non-colour channel, which is Tier 3 (floor 4.5) rather than Tier 1 — and
       the redundancy is structural, not something an author has to remember.
       Consequently the text itself needs no colour: the icon carries the state,
       so the text stays at text-default (OKCA 11.5) and clears every floor with
       margin. This is the case the tier table means by "redundantly coded". */
    :host([role_="state"]) {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2xs);
      font-size: var(--font-size-sm);
      letter-spacing: 0.02em;
      line-height: var(--line-height-tight);
      color: var(--color-text-default);
    }
    /* Icon colour uses the non-text status tokens, which is what they are
       validated for. The text never uses them. */
    :host([role_="state"]) .state-icon { flex-shrink: 0; width: 1em; height: 1em; }
    :host([role_="state"][tone="success"]) .state-icon { color: var(--color-status-success); }
    :host([role_="state"][tone="warning"]) .state-icon { color: var(--color-status-warning); }
    :host([role_="state"][tone="error"])   .state-icon { color: var(--color-status-error); }
    /* No --color-status-info token exists; candor-alert uses text-subtle for the
       info icon, and this matches it. */
    :host([role_="state"][tone="info"])    .state-icon { color: var(--color-text-subtle); }

    :host([role_="annotation"]) {
      font-size: var(--font-size-sm);
      letter-spacing: 0.02em;
      line-height: var(--line-height-relaxed);
      font-style: italic;
    }

    /* Size overrides — higher specificity via two attribute selectors wins over role */
    :host([role_][size="sm"]) { font-size: var(--font-size-sm); }
    :host([role_][size="md"]) { font-size: var(--font-size-md); }
    :host([role_][size="lg"]) { font-size: var(--font-size-lg); }

    /* Color variants */
    :host([color="primary"])   { color: var(--color-text-default); }
    :host([color="secondary"]) { color: var(--color-text-subtle); }
    :host([color="disabled"])  { color: var(--color-text-disabled); }
    :host([color="error"])     { color: var(--color-status-error-text); }

    /* Bold modifier */
    :host([bold]) { font-weight: var(--font-weight-bold); }

    .accessible-text { display: contents; }
  `;

  @property({ reflect: true }) role_: AccessibleTextRole = 'label';
  @property({ reflect: true }) size?: AccessibleTextSize;
  @property({ reflect: true }) color: AccessibleTextColor = 'primary';
  /** Only meaningful for role_="state" — selects the icon that carries the outcome. */
  @property({ reflect: true }) tone: AccessibleTextTone = 'info';
  @property({ type: Boolean, reflect: true }) bold = false;

  override render() {
    // The icon is aria-hidden: it is a redundant channel for sighted users who
    // cannot rely on colour, not a substitute for saying the outcome in words.
    // Screen-reader users get the meaning from the text, which must therefore
    // still read correctly on its own ("All responses processed", not "done").
    const icon =
      this.role_ === 'state'
        ? html`<svg class="state-icon" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${TONE_ICON[this.tone] ?? TONE_ICON.info}"/></svg>`
        : nothing;
    return html`${icon}<span class="accessible-text"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-accessible-text': CandorAccessibleText; }
}
