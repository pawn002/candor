import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { phCaretDownBold } from '../../icons';

/**
 * One expandable section. **There is no accordion container** — this is the item
 * only, and the name says so.
 *
 * Two consequences. Sequential items form an accordion by adjacency, with no
 * wrapper to add. And nothing enforces one-open-at-a-time: if the design needs
 * that exclusivity, the consumer closes the siblings in response to `toggle`.
 * Most of the time exclusivity is not wanted anyway — it hides content the user
 * just asked to compare.
 *
 * `toggle` reports the new state, and `open` **is** updated by the component, so
 * this is not a controlled component in the way modal and drawer are. Bind
 * `toggle` to react, not to assign.
 *
 * The choice against `candor-disclosure` is grouping: a disclosure is one
 * standalone "show more" affordance; this is a member of a set and is styled to
 * sit in a stack.
 *
 * `variant="quiet"` renders the heading at weight 500. Structural nesting is
 * what makes it legible at that weight — do not use it for a standalone item
 * where that context is absent.
 *
 * Content stays in the DOM when collapsed, so it remains findable by in-page
 * search.
 *
 * @fires toggle - detail: boolean — the new open state
 */
@customElement('candor-accordion-item')
export class CandorAccordionItem extends LitElement {
  static override styles = css`
    :host { display: block; }
    :host(:last-child) .accordion-item { border-bottom: none; }
    .accordion-item { border-bottom: var(--border-width-thin) solid var(--color-border-strong); }
    .accordion-item > summary { list-style: none; }
    .accordion-item > summary::-webkit-details-marker { display: none; }
    .accordion-item__summary {
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.75rem; padding: 0.875rem 0; cursor: pointer; color: var(--color-text-default);
    }
    .accordion-item__summary:hover { color: var(--color-action-primary); }
    .accordion-item__summary:focus { outline: none; }
    .accordion-item__summary:focus-visible { outline: var(--focus-ring-width) solid var(--color-focus); outline-offset: var(--focus-ring-offset); border-radius: var(--radius-sm); }
    .accordion-item__title { font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-bold); font-optical-sizing: auto; line-height: var(--line-height-tight); flex: 1; }
    .accordion-item__title--subtle { font-weight: var(--font-weight-regular); color: var(--color-text-subtle); }
    .accordion-item__title--quiet { font-weight: 500; font-size: var(--font-size-sm); color: var(--color-text-subtle); font-variation-settings: 'GRAD' -150; }
    .accordion-item__chevron { width: 1rem; height: 1rem; flex-shrink: 0; color: var(--color-text-subtle-on-surface); transition: transform 0.22s ease; }
    details[open] .accordion-item__chevron { transform: rotate(180deg); }
    .accordion-item__panel { display: grid; grid-template-rows: 1fr; }
    .accordion-item__content { overflow: hidden; padding-bottom: 0.875rem; font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); line-height: var(--line-height-normal); }
  `;

  @property() heading = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ reflect: true }) variant: 'default' | 'subtle' | 'quiet' = 'default';

  // Sync host.open with user-driven changes to <details>.open. Without this,
  // clicking <summary> updates details.open but not this.open, so consumers
  // reading el.open get stale state. The native <details> `toggle` event is
  // bubbles:false, composed:false, so we re-dispatch a composed `toggle` —
  // parity with candor-disclosure — so consumers outside the shadow root hear it.
  private _onToggle = (e: Event) => {
    const next = (e.target as HTMLDetailsElement).open;
    if (this.open !== next) {
      this.open = next;
      this.dispatchEvent(new CustomEvent('toggle', { detail: this.open, bubbles: true, composed: true }));
    }
  };

  override render() {
    const titleCls = [
      'accordion-item__title',
      this.variant === 'subtle' ? 'accordion-item__title--subtle' : '',
      this.variant === 'quiet' ? 'accordion-item__title--quiet' : '',
    ].filter(Boolean).join(' ');
    return html`
      <details class="accordion-item" .open="${this.open}" @toggle="${this._onToggle}">
        <summary class="accordion-item__summary">
          <span class="${titleCls}">${this.heading}</span>
          <svg class="accordion-item__chevron" aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d="${phCaretDownBold}"/></svg>
        </summary>
        <div class="accordion-item__panel">
          <div class="accordion-item__content"><slot></slot></div>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-accordion-item': CandorAccordionItem; }
}
