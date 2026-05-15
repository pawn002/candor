import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: { label: 'Accept terms and conditions', checked: false, disabled: false, required: false },
  render: (args) => ({
    template: `<candor-checkbox label="${args['label']}" ${args['checked'] ? 'checked' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['required'] ? 'required' : ''}></candor-checkbox>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Checked: Story = { args: { label: 'Accept terms and conditions', checked: true } };
export const Disabled: Story = { args: { label: 'Cannot select', disabled: true } };
export const CheckedDisabled: Story = { args: { label: 'Already selected and locked', checked: true, disabled: true } };

export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-checkbox label="Unchecked"></candor-checkbox>
        <candor-checkbox label="Checked" checked></candor-checkbox>
        <candor-checkbox label="Disabled unchecked" disabled></candor-checkbox>
        <candor-checkbox label="Disabled checked" checked disabled></candor-checkbox>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-checkbox label="Option 1" checked></candor-checkbox>
        <candor-checkbox label="Option 2" checked></candor-checkbox>
        <candor-checkbox label="Option 3"></candor-checkbox>
        <candor-checkbox label="Disabled option" disabled></candor-checkbox>
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
        <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);margin-bottom:0.5rem;">Notifications</legend>
        <candor-checkbox label="Email notifications" checked></candor-checkbox>
        <candor-checkbox label="SMS notifications"></candor-checkbox>
        <candor-checkbox label="Push notifications" disabled></candor-checkbox>
      </fieldset>
    `,
  }),
};
