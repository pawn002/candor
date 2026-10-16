import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from '../../utils/define';

type StatColor = 'default' | 'success' | 'warning' | 'error' | 'info';
type StatSize  = 'sm' | 'md' | 'lg';

/**
 * A single numeric readout: a value, an optional unit, and a label naming what
 * is measured.
 *
 * **`color` is not a redundant channel, and this is the one thing to get right
 * here.** Unlike `candor-alert` and `candor-accessible-text role_="state"`, this
 * component renders no icon: "847 ms" in amber and "847 ms" in green differ only
 * in hue. The value is a number and the label names the *quantity*, not whether
 * it is good, so nothing in the default rendering tells a reader who cannot use
 * colour that the figure is a problem.
 *
 * The default `<slot>` is where that channel goes, and
 * `candor-accessible-text role_="state"` is its intended occupant, because its
 * tone icon is component-rendered and so cannot be left off:
 *
 * ```html
 * <candor-stat value="847" unit="ms" label="p99 latency" color="warning">
 *   <candor-accessible-text role_="state" tone="warning">Above target</candor-accessible-text>
 * </candor-stat>
 * ```
 *
 * Setting `color` with an empty slot is the failure mode, not a shortcut.
 *
 * `unit` is folded into the value's accessible name so screen readers announce
 * "847 ms" rather than the number alone.
 *
 * Emits no custom events.
 */
@customElement('candor-stat')
export class CandorStat extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2xs);
    }
    :host([size='md']),
    :host([size='lg']) { gap: var(--spacing-xs); }
    .stat__label {
      margin: 0;
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-regular);
      color: var(--color-text-subtle-on-surface);
      letter-spacing: var(--letter-spacing-body);
      text-align: center;
    }
    .stat__value {
      margin: 0;
      font-family: var(--font-family-display);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      font-optical-sizing: auto;
      line-height: 1;
      letter-spacing: var(--letter-spacing-tight);
      color: var(--color-text-default);
    }
    :host([size='md']) .stat__value { font-size: var(--font-size-2xl); }
    :host([size='lg']) .stat__value { font-size: var(--font-size-3xl); }
    :host([color='success']) .stat__value { color: var(--color-status-success-text); }
    :host([color='warning']) .stat__value { color: var(--color-status-warning-text); }
    :host([color='error'])   .stat__value { color: var(--color-status-error-text); }
    :host([color='info'])    .stat__value { color: var(--color-link); }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0;
      overflow: hidden; clip: rect(0,0,0,0); clip-path: inset(50%);
      white-space: nowrap;
    }
    .stat__unit {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-regular);
      color: var(--color-text-subtle);
      letter-spacing: var(--letter-spacing-normal);
    }
  `;

  @property({ reflect: true }) color: StatColor = 'default';
  @property({ reflect: true }) size: StatSize = 'md';
  @property() value: string | number = '';
  @property() unit?: string;
  @property() label?: string;

  override render() {
    return html`
      ${this.label ? html`<p class="stat__label">${this.label}</p>` : nothing}
      <p class="stat__value">
        ${this.unit
          // aria-label is not allowed on a <p>, so screen readers ignored it and
          // read "847ms" run together (#252). The visible value is hidden from
          // them and a spaced copy is read instead.
          ? html`<span aria-hidden="true">${this.value}<span class="stat__unit">${this.unit}</span></span><span class="sr-only">${this.value} ${this.unit}</span>`
          : this.value}
      </p>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-stat': CandorStat; }
}
