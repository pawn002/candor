import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccordionItemComponent } from './accordion-item.component';
import { RadioComponent } from '../form/radio/radio.component';
import { CheckboxComponent } from '../form/checkbox/checkbox.component';

const meta: Meta<AccordionItemComponent> = {
  title: 'Components/Accordion',
  component: AccordionItemComponent,
  decorators: [
    moduleMetadata({ imports: [AccordionItemComponent, RadioComponent, CheckboxComponent] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text', type: { name: 'string' }, description: 'Accordion header label' },
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Expanded state on initial render' },
  },
  parameters: {
    docs: {
      description: {
        component: `
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
