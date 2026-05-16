import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccordionItemComponent } from './accordion-item.component';
import { RadioComponent } from '../form/radio/radio.component';
import { CheckboxComponent } from '../form/checkbox/checkbox.component';

const meta: Meta<AccordionItemComponent> = {
  title: 'Angular Components/Accordion',
  component: AccordionItemComponent,
  decorators: [
    moduleMetadata({ imports: [AccordionItemComponent, RadioComponent, CheckboxComponent] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text', type: { name: 'string' }, description: 'Accordion header label' },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Expanded state on initial render' },
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'quiet'],
      description: 'Visual weight of the heading — use to express hierarchy in nested accordion groups',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Accordion renders a group of collapsible sections using native \`<details>\`/\`<summary>\`. It is the right choice when the sections are **parallel and coordinate as a set** — a FAQ list, a settings panel, a table of contents.

**Accordion vs. Disclosure**

| Use | When |
|---|---|
| \`app-accordion\` | Two or more parallel sections at the same heading level. Users may want to compare across items or scan headings. |
| \`app-disclosure\` | A single, contextual reveal — one toggle standing alone. An expandable filter, a "read more", an inline help tip. |

If you have several independent disclosures near each other but opening one should **not** close another, use multiple \`app-disclosure\` instances — not \`app-accordion\`.

**Note:** All stories wrap \`<app-accordion-item>\` in a surface container (\`background: var(--color-bg-surface)\`) for display purposes.
In real usage, the host element provides this context — no wrapper is required by the component itself.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<AccordionItemComponent>;

export const Default: Story = {
  args: {
    heading: 'What is OKLCH?',
    open: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: 0 1rem;">
          <app-accordion-item [heading]="heading" [open]="open">
            OKLCH is a perceptual color space with three axes: Lightness (L), Chroma (C), and Hue (H).
            Unlike RGB or HSL, equal numeric steps in OKLCH correspond to equal perceived differences —
            making it ideal for programmatic color manipulation.
          </app-accordion-item>
        </div>
      </div>
    `,
  }),
};

export const OpenByDefault: Story = {
  args: {
    heading: 'What is OKLCH?',
    open: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: 0 1rem;">
          <app-accordion-item [heading]="heading" [open]="open">
            OKLCH is a perceptual color space with three axes: Lightness (L), Chroma (C), and Hue (H).
            Unlike RGB or HSL, equal numeric steps in OKLCH correspond to equal perceived differences —
            making it ideal for programmatic color manipulation.
          </app-accordion-item>
        </div>
      </div>
    `,
  }),
};

export const MultipleItems: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: 0 1rem;">
        <app-accordion-item heading="Contrast algorithm" [open]="true">
          <fieldset style="border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <legend style="display: none;">Contrast algorithm</legend>
            <app-radio name="algo" label="WCAG 2.1" value="wcag21" [checked]="true"></app-radio>
            <app-radio name="algo" label="OKCA" value="okca"></app-radio>
            <app-radio name="algo" label="Perceptual" value="perceptual"></app-radio>
            <app-radio name="algo" label="Delta E" value="deltae"></app-radio>
          </fieldset>
        </app-accordion-item>
        <app-accordion-item heading="Display options">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <app-checkbox label="Hold chroma constant" [checked]="true"></app-checkbox>
            <app-checkbox label="Show gradient track" [checked]="true"></app-checkbox>
            <app-checkbox label="Show gamut boundaries"></app-checkbox>
          </div>
        </app-accordion-item>
        <app-accordion-item heading="About WCAG 2.1">
          The Web Content Accessibility Guidelines 2.1 contrast ratio measures the relative
          luminance difference between foreground and background. A ratio of 4.5:1 is required
          for normal text (AA), 3:1 for large text, and 7:1 for enhanced (AAA).
        </app-accordion-item>
        </div>
      </div>
    `,
  }),
};

export const HierarchyVariants: Story = {
  name: 'Hierarchy variants (default / subtle / quiet)',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <p style="font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 1rem;">
          Use <code>variant</code> to express heading hierarchy within a nested accordion group.
          Section headers use <code>default</code>; subsections use <code>subtle</code>;
          help text or fine print uses <code>quiet</code>.
        </p>
        <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: 0 1rem;">
          <app-accordion-item heading="Contrast settings" variant="default" [open]="true">
            <div style="padding: 0 0 0.5rem;">
              <div style="background: var(--color-bg-page); border-radius: var(--radius-sm); padding: 0 0.75rem;">
                <app-accordion-item heading="Algorithm options" variant="subtle" [open]="true">
                  <fieldset style="border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                    <legend style="display: none;">Algorithm options</legend>
                    <app-radio name="algo2" label="WCAG 2.1" value="wcag21" [checked]="true"></app-radio>
                    <app-radio name="algo2" label="OKCA" value="okca"></app-radio>
                  </fieldset>
                </app-accordion-item>
                <app-accordion-item heading="Why does the algorithm matter?" variant="quiet">
                  Different algorithms weight hue, lightness, and chroma differently. WCAG 2.1 uses
                  relative luminance; OKCA uses perceptual uniformity. For small text, OKCA is more
                  predictive of real-world readability.
                </app-accordion-item>
              </div>
            </div>
          </app-accordion-item>
          <app-accordion-item heading="Display options" variant="default">
            <app-checkbox label="Hold chroma constant" [checked]="true"></app-checkbox>
          </app-accordion-item>
        </div>
      </div>
    `,
  }),
};
