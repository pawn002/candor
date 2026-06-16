/**
 * Shared helpers for the Candor web-component Storybook stories.
 *
 * These run in the `@storybook/web-components-vite` renderer, where stories are
 * authored as lit-html `html` templates. Anything that cannot be expressed as an
 * HTML attribute — most importantly **function-valued properties** — must be
 * applied to the rendered custom element after the fact, in a Storybook `play`
 * step.
 */

/**
 * A Storybook `play` function that assigns JavaScript-only properties onto every
 * custom element matching `selector`, after the story has rendered.
 *
 * Use this for reactive Lit properties that take a function or other
 * non-serialisable value — e.g. `candor-slider.valueTextFn` — which cannot
 * travel through a `template:` string. Assigning a reactive property triggers a
 * re-render, so the screen-reader-facing output (`aria-valuetext`, etc.) updates
 * to match. Scope `selector` (e.g. `candor-slider[gradient]`) when a story holds
 * several instances that need different formatters.
 *
 * @example
 *   export const Percentage: Story = {
 *     render: () => html`<candor-slider ...></candor-slider>`,
 *     play: setElementProps('candor-slider', {
 *       valueTextFn: (v: number) => `${v}%`,
 *     }),
 *   };
 */
export const setElementProps =
  (selector: string, props: Record<string, unknown>) =>
  ({ canvasElement }: { canvasElement: HTMLElement }): void => {
    canvasElement.querySelectorAll(selector).forEach((el) => {
      Object.assign(el, props);
    });
  };

// ── Open-state play helpers ──────────────────────────────────────────────────
// Trigger-based overlays (menu, listbox, combobox, tooltip) keep their open
// state in private `@state()`, so it cannot be set via an attribute. These play
// functions drive the real trigger so Chromatic captures the open state. Pair
// the story with `tags: ['!autodocs']` to keep the open overlay off the docs page.
// (Modal/drawer expose a public `open` property — use the `open` attribute
// directly instead of a play function.)

/**
 * Click an element inside the shadow root of the host matching `hostSelector`.
 * Use to open shadow-DOM-triggered overlays, e.g. `candor-menu` (`.menu-trigger`)
 * or `candor-listbox` (`.listbox__trigger`).
 */
export const clickInShadow =
  (hostSelector: string, innerSelector: string) =>
  ({ canvasElement }: { canvasElement: HTMLElement }): void => {
    const host = canvasElement.querySelector(hostSelector);
    const target = host?.shadowRoot?.querySelector(innerSelector);
    (target as HTMLElement | null)?.click();
  };

/**
 * Focus an element inside the shadow root of the host matching `hostSelector`.
 * Composed `focusin` crosses the shadow boundary, so focusing e.g. a
 * `candor-button`'s inner `button` reveals an ancestor `candor-tooltip`.
 */
export const focusInShadow =
  (hostSelector: string, innerSelector: string) =>
  ({ canvasElement }: { canvasElement: HTMLElement }): void => {
    const host = canvasElement.querySelector(hostSelector);
    const target = host?.shadowRoot?.querySelector(innerSelector);
    (target as HTMLElement | null)?.focus();
  };

/**
 * Open a `candor-combobox` dropdown: focus its input and press ArrowDown, which
 * expands the full (unfiltered) option list.
 */
export const openCombobox =
  (hostSelector: string) =>
  ({ canvasElement }: { canvasElement: HTMLElement }): void => {
    const host = canvasElement.querySelector(hostSelector);
    const input = host?.shadowRoot?.querySelector('.combobox__input') as
      | HTMLInputElement
      | null;
    if (!input) return;
    input.focus();
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
  };
