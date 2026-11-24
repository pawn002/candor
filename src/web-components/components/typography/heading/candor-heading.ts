import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from '../../../utils/define';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingColor = 'primary' | 'secondary' | 'disabled';

/**
 * A heading. `level` sets the visual size and the semantic level together. They
 * are deliberately not separable.
 *
 * The semantics are ARIA, not markup. This element renders a bare `<slot>` and
 * carries `role="heading"` with `aria-level` on the host, resynced whenever
 * `level` changes; it does **not** emit an `<h1>`–`<h6>`. Screen readers get the
 * correct level either way, but tooling that looks for native heading *elements*
 * rather than the heading *role* will not find it.
 *
 * There is no separate `size` property, so "an h2 that looks like an h4" is not
 * expressible. That is the point: if a heading needs to be smaller, it is
 * usually the wrong level. For large display text carrying no heading semantics,
 * use `candor-text`, which has sizes up to `3xl` and no role.
 *
 * Weight is semibold at every level; hierarchy comes from size plus
 * `font-optical-sizing: auto`, which lets the Roboto Flex `opsz` axis thicken
 * strokes as size grows. That gradient is why there is no `bold` property here.
 * The one exception is `color="secondary"` at h4 and h6, which stays bold:
 * semibold counts as regular for contrast, and at 20px and 14px that raises the
 * floor past what the secondary colour reaches.
 *
 * Tracking opens as size falls, from `--letter-spacing-h1` (0.005em) to
 * `--letter-spacing-h6` (0.035em).
 *
 * Leading tightens with size: `--line-height-display` (1.1) for h1 and h2,
 * `--line-height-snug` (1.2) for h3 and h4, `--line-height-tight` (1.25) for h5
 * and h6. It only shows when a heading wraps.
 *
 * Emits no custom events.
 */
@customElement('candor-heading')
export class CandorHeading extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-heading);
      font-optical-sizing: auto;
      line-height: var(--line-height-tight);
      margin: 0;
    }
    :host([color='primary'])  { color: var(--color-text-default); }
    :host([color='secondary']) { color: var(--color-text-subtle); }
    :host([color='disabled']) { color: var(--color-text-disabled); }
    /* Semibold is regular for contrast; at 20px and 14px that lifts the floor
       above what --color-text-subtle reaches, so these two keep bold. */
    :host([color='secondary'][level='h4']),
    :host([color='secondary'][level='h6']) { font-weight: var(--font-weight-bold); }
    /* Leading tightens as size grows (#264): see --line-height-display. */
    :host([level='h1']) { font-size: var(--font-size-h1); letter-spacing: var(--letter-spacing-h1); line-height: var(--line-height-display); }
    :host([level='h2']) { font-size: var(--font-size-h2); letter-spacing: var(--letter-spacing-h2); line-height: var(--line-height-display); }
    :host([level='h3']) { font-size: var(--font-size-h3); letter-spacing: var(--letter-spacing-h3); line-height: var(--line-height-snug); }
    :host([level='h4']) { font-size: var(--font-size-h4); letter-spacing: var(--letter-spacing-h4); line-height: var(--line-height-snug); }
    :host([level='h5']) { font-size: var(--font-size-h5); letter-spacing: var(--letter-spacing-h5); }
    :host([level='h6']) { font-size: var(--font-size-h6); letter-spacing: var(--letter-spacing-h6); }
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
