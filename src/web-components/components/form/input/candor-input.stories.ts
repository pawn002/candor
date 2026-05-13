import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Input',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    multiline: { control: 'boolean' },
  },
  args: { label: 'Email address', placeholder: 'you@example.com', type: 'email', required: false, disabled: false, multiline: false },
  render: (args) => ({
    template: `<candor-input label="${args['label']}" placeholder="${args['placeholder']}" type="${args['type']}" error="${args['error'] || ''}" hint="${args['hint'] || ''}" ${args['required'] ? 'required' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['multiline'] ? 'multiline' : ''}></candor-input>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithError: Story = {
  render: () => ({
    template: `<candor-input label="Email address" type="email" value="bad@" error="Enter a valid email address."></candor-input>`,
  }),
};

export const WithHint: Story = {
  render: () => ({
    template: `<candor-input label="Password" type="password" hint="At least 8 characters, one number."></candor-input>`,
  }),
};

export const Multiline: Story = {
  render: () => ({
    template: `<candor-input label="Message" multiline placeholder="Type your message…" rows="4"></candor-input>`,
  }),
};
