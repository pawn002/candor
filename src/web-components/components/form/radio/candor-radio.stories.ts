import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Radio',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Option A', value: 'a', checked: false, disabled: false },
  render: (args) => ({
    template: `<candor-radio label="${args['label']}" value="${args['value']}" ${args['checked'] ? 'checked' : ''} ${args['disabled'] ? 'disabled' : ''} name="demo"></candor-radio>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Group: Story = {
  render: () => ({
    template: `
      <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
        <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);margin-bottom:0.5rem;">Preferred contact method</legend>
        <candor-radio label="Email" value="email" name="contact" checked></candor-radio>
        <candor-radio label="Phone" value="phone" name="contact"></candor-radio>
        <candor-radio label="Post" value="post" name="contact" disabled></candor-radio>
      </fieldset>
    `,
  }),
};
