import type { LitElement } from 'lit';

/**
 * Observe the `aria-label` attribute on a custom-element host, mirror its value
 * into a setter, and strip the attribute off the host so the value is announced
 * exactly once by AT.
 *
 * Background — the "host aria-label" trap:
 * When a consumer writes `<candor-foo aria-label="X">`, the host element receives
 * an accessible name from the attribute and shows up in the AT tree as
 * `generic "X"`. The inner element where we'd like the name (an inner `<grid>`,
 * `<input>`, etc.) does NOT inherit it — `aria-label` on a custom-element host
 * does not propagate across the shadow boundary. The historical workaround was
 * to also expose an `ariaLabel_` property and bind it inside, but that left the
 * attribute on the host so SR users heard the name twice (host generic + inner).
 *
 * `role="none"` on the host does NOT fix this — ARIA's presentational role
 * conflict resolution preserves the host's accessible name when `aria-label`
 * is set. The only reliable fix is to REMOVE the attribute from the host
 * after caching the value, which is what this helper does.
 *
 * Lit's `@property({ attribute: 'aria-label' })` cannot be used for this because
 * the reflection observer would re-clear our cached value the moment we strip
 * the attribute. This helper installs a manual MutationObserver instead.
 *
 * Usage:
 * ```ts
 * @customElement('candor-foo')
 * export class CandorFoo extends LitElement {
 *   @state() private _ariaLabel = '';
 *
 *   override connectedCallback() {
 *     super.connectedCallback();
 *     this._stopObserving = observeHostAriaLabel(this, value => { this._ariaLabel = value; });
 *   }
 *
 *   override disconnectedCallback() {
 *     this._stopObserving?.();
 *     super.disconnectedCallback();
 *   }
 *
 *   private _stopObserving?: () => void;
 *
 *   override render() {
 *     return html`<input aria-label=${this._ariaLabel || nothing} />`;
 *   }
 * }
 * ```
 */
export function observeHostAriaLabel(
  el: LitElement,
  onLabel: (value: string) => void,
): () => void {
  const consume = () => {
    const value = el.getAttribute('aria-label');
    if (value !== null && value !== '') {
      onLabel(value);
      // Defer the removal so we don't mutate attributes inside the observer
      // callback — that would re-fire the observer synchronously in some engines.
      queueMicrotask(() => {
        if (el.getAttribute('aria-label') === value) el.removeAttribute('aria-label');
      });
    }
  };

  // Initial sync — pick up the attribute that was already on the host when
  // connectedCallback ran.
  consume();

  const observer = new MutationObserver(consume);
  observer.observe(el, { attributes: true, attributeFilter: ['aria-label'] });

  return () => observer.disconnect();
}
