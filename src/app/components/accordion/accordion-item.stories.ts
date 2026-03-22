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
  argTypes: {},
};

export default meta;
type Story = StoryObj<AccordionItemComponent>;

export const Default: Story = {
  args: {
    title: 'What is OKLCH?',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <app-accordion-item [title]="title">
          OKLCH is a perceptual color space with three axes: Lightness (L), Chroma (C), and Hue (H).
          Unlike RGB or HSL, equal numeric steps in OKLCH correspond to equal perceived differences —
          making it ideal for programmatic color manipulation.
        </app-accordion-item>
      </div>
    `,
  }),
};

export const OpenByDefault: Story = {
  args: {
    title: 'What is OKLCH?',
    open: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <app-accordion-item [title]="title" [open]="open">
          OKLCH is a perceptual color space with three axes: Lightness (L), Chroma (C), and Hue (H).
          Unlike RGB or HSL, equal numeric steps in OKLCH correspond to equal perceived differences —
          making it ideal for programmatic color manipulation.
        </app-accordion-item>
      </div>
    `,
  }),
};

export const MultipleItems: Story = {
  render: () => ({
    template: `
      <div style="max-width: 480px; padding: 1.5rem;">
        <app-accordion-item title="Contrast algorithm" [open]="true">
          <fieldset style="border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
            <legend style="display: none;">Contrast algorithm</legend>
            <app-radio name="algo" label="WCAG 2.1" value="wcag21" [checked]="true"></app-radio>
            <app-radio name="algo" label="OKCA" value="okca"></app-radio>
            <app-radio name="algo" label="Perceptual" value="perceptual"></app-radio>
            <app-radio name="algo" label="Delta E" value="deltae"></app-radio>
          </fieldset>
        </app-accordion-item>
        <app-accordion-item title="Display options">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <app-checkbox label="Hold chroma constant" [checked]="true"></app-checkbox>
            <app-checkbox label="Show gradient track" [checked]="true"></app-checkbox>
            <app-checkbox label="Show gamut boundaries"></app-checkbox>
          </div>
        </app-accordion-item>
        <app-accordion-item title="About WCAG 2.1">
          The Web Content Accessibility Guidelines 2.1 contrast ratio measures the relative
          luminance difference between foreground and background. A ratio of 4.5:1 is required
          for normal text (AA), 3:1 for large text, and 7:1 for enhanced (AAA).
        </app-accordion-item>
      </div>
    `,
  }),
};

