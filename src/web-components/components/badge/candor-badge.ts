import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from '../../utils/define';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning';
type BadgeSize = 'sm' | 'md';

/**
 * A small status or category marker.
 *
 * **The label must name the condition, not just be present.** Colour cannot be
 * the sole channel for meaning, and the tinted background does not rescue it
 * (see below). The redundant channel here is the *text*, which is structurally
 * mandatory because a badge with no content is not a badge. But it only counts
 * if it says what the condition is:
 *
 * ```html
 * <candor-badge variant="error">3</candor-badge>          <!-- no channel: "3" says nothing -->
 * <candor-badge variant="error">3 failed</candor-badge>   <!-- correct -->
 * ```
 *
 * Candor cannot enforce this, so it is an authoring rule rather than a
 * constraint, which is exactly why it is written here, where the decision is
 * made.
 *
 * **Do not treat the tinted background as a variant channel.** At L 0.95 the
 * sRGB gamut permits almost no chroma at red, and pale tints fade on washed-out
 * screens and for readers who cannot tell the hues apart. The error and warning
 * fills were once only deltaE 4 apart; they are farther apart now, but error and
 * warning badges are still told apart by their words, not their fill.
 *
 * For an outcome that has already happened and wants an icon, consider
 * `candor-accessible-text role_="state"`, whose icon is component-rendered and
 * therefore cannot be omitted.
 *
 * Emits no custom events.
 */
@customElement('candor-badge')
export class CandorBadge extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }
    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      font-family: var(--font-family-accessible);
      letter-spacing: 0.06em;
      font-weight: var(--font-weight-bold);
      white-space: nowrap;
      line-height: var(--line-height-tight);
    }
    .badge--sm { font-size: var(--font-size-sm); padding: 0.2rem 0.5rem; }
    .badge--md { font-size: var(--font-size-md); font-weight: var(--font-weight-regular); padding: 0.25rem 0.65rem; }
    /* Not bg-surface: on a card or a striped row the pill matched its background and
       only bold text was left (#321). bg-muted reads on page, surface and elevated. */
    .badge--default   { background-color: var(--color-bg-muted); color: var(--color-text-default); }
    .badge--primary   { background-color: var(--color-action-primary); color: var(--color-text-on-action); }
    .badge--secondary { background-color: var(--color-action-secondary); color: var(--color-text-on-action); }
    .badge--success   { background-color: var(--color-status-success-bg); color: var(--color-status-success-text); }
    .badge--error     { background-color: var(--color-status-error-bg); color: var(--color-status-error-text); }
    .badge--warning   { background-color: var(--color-status-warning-bg); color: var(--color-status-warning-text); }
  `;

  @property({ reflect: true }) variant: BadgeVariant = 'default';
  @property({ reflect: true }) size: BadgeSize = 'md';

  override render() {
    return html`<span class="badge badge--${this.variant} badge--${this.size}"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-badge': CandorBadge; }
}
