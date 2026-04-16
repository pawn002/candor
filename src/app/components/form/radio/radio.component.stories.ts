import type { Meta, StoryObj } from '@storybook/angular';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Components/Form/Radio',
  component: RadioComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Single-select option within a mutually exclusive group. Radios work in groups — a standalone
radio button is almost always a mistake; use a checkbox instead.

**Always wrap radio groups in a \`<fieldset>\` with a \`<legend>\`.** The legend is announced
before each option by screen readers, providing the question context. Without it, a user
hears "Yes" with no frame of reference for what the question was.

\`\`\`html
<fieldset>
  <legend>Preferred contact method</legend>
  <app-radio name="contact" value="email" label="Email"></app-radio>
  <app-radio name="contact" value="phone" label="Phone"></app-radio>
</fieldset>
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Radio button label' },
    value: { control: 'text', type: { name: 'string' }, description: 'Value submitted with the form' },
    name: { control: 'text', type: { name: 'string' }, description: 'Radio group name' },
    checked: { control: 'boolean', type: { name: 'boolean' }, description: 'Checked state (for static/story use)' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
  },
};

export default meta;
type Story = StoryObj<RadioComponent>;

export const Default: Story = {
  args: {
    label: 'Option 1',
    value: 'option1',
    name: 'demo',
  },
};

export const Selected: Story = {
  args: {
    label: 'Option 1',
    value: 'option1',
    name: 'demo',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Cannot select',
    value: 'disabled',
    name: 'demo',
    disabled: true,
  },
};

export const RadioGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <!-- fieldset+legend provides the group label AT users need ("1 of N" alone is meaningless without it) -->
      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="font-family: var(--font-family-accessible); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0 0 var(--spacing-sm) 0;">Notification preference</legend>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <app-radio label="Option 1" value="option1" name="group1" [checked]="true"></app-radio>
          <app-radio label="Option 2" value="option2" name="group1"></app-radio>
          <app-radio label="Option 3" value="option3" name="group1"></app-radio>
          <app-radio label="Disabled option" value="option4" name="group1" [disabled]="true"></app-radio>
        </div>
      </fieldset>
    `,
  }),
};

export const MultipleGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 3rem;">
        <!-- Each independent radio group needs its own fieldset+legend -->
        <fieldset style="border: none; padding: 0; margin: 0;">
          <legend style="font-family: var(--font-family-accessible); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0 0 var(--spacing-sm) 0;">Size</legend>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <app-radio label="Small" value="small" name="size" [checked]="true"></app-radio>
            <app-radio label="Medium" value="medium" name="size"></app-radio>
            <app-radio label="Large" value="large" name="size"></app-radio>
          </div>
        </fieldset>
        <fieldset style="border: none; padding: 0; margin: 0;">
          <legend style="font-family: var(--font-family-accessible); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0 0 var(--spacing-sm) 0;">Color</legend>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <app-radio label="Red" value="red" name="color"></app-radio>
            <app-radio label="Blue" value="blue" name="color" [checked]="true"></app-radio>
            <app-radio label="Green" value="green" name="color"></app-radio>
          </div>
        </fieldset>
      </div>
    `,
  }),
};
