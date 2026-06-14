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
 *     render: () => ({ template: `<candor-slider ...></candor-slider>` }),
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
