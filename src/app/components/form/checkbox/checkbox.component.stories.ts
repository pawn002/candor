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
  },
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Cannot select',
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  render: () => ({
    template: `<app-checkbox label="Already selected and disabled" [disabled]="true"></app-checkbox>`,
  }),
};

export const Multiple: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-checkbox label="Option 1"></app-checkbox>
        <app-checkbox label="Option 2"></app-checkbox>
        <app-checkbox label="Option 3"></app-checkbox>
        <app-checkbox label="Disabled option" [disabled]="true"></app-checkbox>
      </div>
    `,
  }),
};
