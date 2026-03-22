import type { Meta, StoryObj } from '@storybook/angular';
import { RadioComponent } from './radio.component';

const meta: Meta<RadioComponent> = {
  title: 'Components/Form/Radio',
  component: RadioComponent,
  tags: ['autodocs'],
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
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-radio label="Option 1" value="option1" name="group1" [checked]="true"></app-radio>
        <app-radio label="Option 2" value="option2" name="group1"></app-radio>
        <app-radio label="Option 3" value="option3" name="group1"></app-radio>
        <app-radio label="Disabled option" value="option4" name="group1" [disabled]="true"></app-radio>
      </div>
    `,
  }),
};

export const MultipleGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 3rem;">
        <div>
          <p style="font-family: var(--font-family-accessible); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0 0 var(--spacing-sm) 0;">Size</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <app-radio label="Small" value="small" name="size" [checked]="true"></app-radio>
            <app-radio label="Medium" value="medium" name="size"></app-radio>
            <app-radio label="Large" value="large" name="size"></app-radio>
          </div>
        </div>
        <div>
          <p style="font-family: var(--font-family-accessible); font-weight: var(--font-weight-bold); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0 0 var(--spacing-sm) 0;">Color</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <app-radio label="Red" value="red" name="color"></app-radio>
            <app-radio label="Blue" value="blue" name="color" [checked]="true"></app-radio>
            <app-radio label="Green" value="green" name="color"></app-radio>
          </div>
        </div>
      </div>
    `,
  }),
};
