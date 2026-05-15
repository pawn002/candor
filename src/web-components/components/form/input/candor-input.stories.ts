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
    resize: { control: 'select', options: ['none', 'vertical', 'both'] },
  },
  args: { label: 'Email address', placeholder: 'you@example.com', type: 'email', required: false, disabled: false, multiline: false },
  render: (args) => ({
    template: `<candor-input label="${args['label']}" placeholder="${args['placeholder']}" type="${args['type']}" error="${args['error'] || ''}" hint="${args['hint'] || ''}" ${args['required'] ? 'required' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['multiline'] ? 'multiline' : ''}></candor-input>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Required: Story = {
  args: { label: 'Username', type: 'text', placeholder: 'Enter username', required: true },
};

export const Disabled: Story = {
  args: { label: 'Username', type: 'text', placeholder: 'Cannot edit', disabled: true },
};

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: 'Enter password', hint: 'Must be at least 8 characters' },
};

export const MultilineWithError: Story = {
  args: { label: 'Description', multiline: true, error: 'Description is required' },
};

export const MultilineResizeNone: Story = {
  args: { label: 'Notes', multiline: true, placeholder: 'Fixed height — no resize handle', resize: 'none' },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:420px;">
        <candor-input label="Default" placeholder="Enter text"></candor-input>
        <candor-input label="With hint" hint="This is a helpful hint"></candor-input>
        <candor-input label="Required field" required></candor-input>
        <candor-input label="With error" error="This field is required"></candor-input>
        <candor-input label="Disabled" value="Cannot edit" disabled></candor-input>
      </div>
    `,
  }),
};

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
