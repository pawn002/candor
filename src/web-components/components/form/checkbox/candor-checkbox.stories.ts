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
