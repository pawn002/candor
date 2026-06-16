import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-accordion-item>\` renders a collapsible section using native \`<details>\`/\`<summary>\`.
Use it as the right choice when sections are **parallel and coordinate as a set** — a FAQ
list, a settings panel, a table of contents.

**Accordion vs. Disclosure**

| Use | When |
|---|---|
| \`candor-accordion-item\` | Two or more parallel sections at the same heading level. Users may want to compare across items or scan headings. |
| \`candor-disclosure\` | A single, contextual reveal — one toggle standing alone. An expandable filter, a "read more", an inline help tip. |

If you have several independent disclosures near each other but opening one should **not**
close another, use multiple \`<candor-disclosure>\` instances — not a group of accordion items.
        `.trim(),
      },
    },
  },
  argTypes: {
    heading: { control: 'text', type: { name: 'string' }, description: 'Accordion header label' },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Expanded state on initial render' },
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'quiet'],
      type: { name: 'string' },
      description: 'Visual weight of the heading — use to express hierarchy in nested accordion groups',
    },
  },
  args: { heading: 'What is OKLCH?', open: false, variant: 'default' },
  render: (args) => html`
    <div style="max-width:480px;padding:1.5rem;">
      <div style="background:var(--color-bg-surface);border-radius:var(--radius-md);padding:0 1rem;">
        <candor-accordion-item heading="${args['heading']}" ?open=${args['open']} variant="${args['variant']}">
          OKLCH is a perceptual color space with three axes: Lightness (L), Chroma (C), and Hue (H).
          Unlike RGB or HSL, equal numeric steps in OKLCH correspond to equal perceived differences —
          making it ideal for programmatic color manipulation.
        </candor-accordion-item>
      </div>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const OpenByDefault: Story = {
  args: { open: true },
};

export const MultipleItems: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="max-width:480px;padding:1.5rem;">
      <div style="background:var(--color-bg-surface);border-radius:var(--radius-md);padding:0 1rem;">
        <candor-accordion-item heading="Contrast algorithm" open>
          <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
            <legend style="display:none;">Contrast algorithm</legend>
            <candor-radio name="algo" label="WCAG 2.1" value="wcag21" checked></candor-radio>
            <candor-radio name="algo" label="OKCA" value="okca"></candor-radio>
            <candor-radio name="algo" label="Perceptual" value="perceptual"></candor-radio>
            <candor-radio name="algo" label="Delta E" value="deltae"></candor-radio>
          </fieldset>
        </candor-accordion-item>
        <candor-accordion-item heading="Display options">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <candor-checkbox label="Hold chroma constant" checked></candor-checkbox>
            <candor-checkbox label="Show gradient track" checked></candor-checkbox>
            <candor-checkbox label="Show gamut boundaries"></candor-checkbox>
          </div>
        </candor-accordion-item>
        <candor-accordion-item heading="About WCAG 2.1">
          The Web Content Accessibility Guidelines 2.1 contrast ratio measures the relative
          luminance difference between foreground and background. A ratio of 4.5:1 is required
          for normal text (AA), 3:1 for large text, and 7:1 for enhanced (AAA).
        </candor-accordion-item>
      </div>
    </div>
  `,
};

export const HierarchyVariants: Story = {
  name: 'Hierarchy variants (default / subtle / quiet)',
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="max-width:480px;padding:1.5rem;">
      <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0 0 1rem;">
        Use <code>variant</code> to express heading hierarchy within a nested accordion group.
        Section headers use <code>default</code>; subsections use <code>subtle</code>;
        help text or fine print uses <code>quiet</code>.
      </p>
      <div style="background:var(--color-bg-surface);border-radius:var(--radius-md);padding:0 1rem;">
        <candor-accordion-item heading="Contrast settings" variant="default" open>
          <div style="padding:0 0 0.5rem;">
            <div style="background:var(--color-bg-page);border-radius:var(--radius-sm);padding:0 0.75rem;">
              <candor-accordion-item heading="Algorithm options" variant="subtle" open>
                <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
                  <legend style="display:none;">Algorithm options</legend>
                  <candor-radio name="algo2" label="WCAG 2.1" value="wcag21" checked></candor-radio>
                  <candor-radio name="algo2" label="OKCA" value="okca"></candor-radio>
                </fieldset>
              </candor-accordion-item>
              <candor-accordion-item heading="Why does the algorithm matter?" variant="quiet">
                Different algorithms weight hue, lightness, and chroma differently. WCAG 2.1 uses
                relative luminance; OKCA uses perceptual uniformity. For small text, OKCA is more
                predictive of real-world readability.
              </candor-accordion-item>
            </div>
          </div>
        </candor-accordion-item>
        <candor-accordion-item heading="Display options" variant="default">
          <candor-checkbox label="Hold chroma constant" checked></candor-checkbox>
        </candor-accordion-item>
      </div>
    </div>
  `,
};
