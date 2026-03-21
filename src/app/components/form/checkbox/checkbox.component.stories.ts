import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Form/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Cannot select',
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: 'Already selected and locked',
    checked: true,
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-checkbox label="Unchecked"></app-checkbox>
        <app-checkbox label="Checked" [checked]="true"></app-checkbox>
        <app-checkbox label="Disabled unchecked" [disabled]="true"></app-checkbox>
        <app-checkbox label="Disabled checked" [checked]="true" [disabled]="true"></app-checkbox>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-checkbox label="Option 1" [checked]="true"></app-checkbox>
        <app-checkbox label="Option 2" [checked]="true"></app-checkbox>
        <app-checkbox label="Option 3"></app-checkbox>
        <app-checkbox label="Disabled option" [disabled]="true"></app-checkbox>
      </div>
    `,
  }),
};
