import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/ChatInput',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disclaimer: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Message',
    placeholder: 'Type a message…',
    disclaimer: '',
    disabled: false,
  },
  render: (args) => ({
    template: `<candor-chat-input
      label="${args['label']}"
      placeholder="${args['placeholder']}"
      disclaimer="${args['disclaimer'] || ''}"
      ${args['disabled'] ? 'disabled' : ''}
    ></candor-chat-input>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithDisclaimer: Story = {
  args: { disclaimer: 'Responses are AI-generated and may be inaccurate.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
