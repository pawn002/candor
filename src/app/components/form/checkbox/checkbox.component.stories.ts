import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Form/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Binary toggle for a single yes/no choice. Use for independent options that don't affect each other —
"Subscribe to newsletter", "Accept terms", "Enable feature".

**Checkbox vs. Switch:** Use a checkbox when the user must explicitly submit the form to apply
the change. Use a switch when the change takes effect immediately on toggle.

**Group checkboxes in a \`<fieldset>\` with a \`<legend>\`** when presenting a set of related
options. A \`<div>\` with a visible heading is not sufficient — screen readers announce the
legend as the group label for each individual checkbox.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Checkbox label text' },
    checked: { control: 'boolean', type: { name: 'boolean' }, description: 'Checked state' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
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
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
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
