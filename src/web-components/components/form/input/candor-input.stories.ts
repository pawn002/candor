import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-input>\` — single-line or multiline text field with label, optional hint, and error
state. Covers text, email, password, and number input types, plus a textarea mode via
\`multiline\`.

The label is always rendered — never omit it for visual reasons. If the design calls for a
labelless input, set \`aria-label\` on the host element so the field remains accessible.

**Hint and error are mutually exclusive at display time.** When \`error\` is set it replaces
the hint text in the DOM and is associated with the field via \`aria-describedby\`. Don't
duplicate the error message in both \`hint\` and \`error\`.

Form-associated (\`ElementInternals\`): the value appears in \`FormData\` keyed by \`name\`.
Emits an \`input-change\` CustomEvent on each keystroke.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Field label' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Placeholder text' },
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text below the field' },
    error: { control: 'text', type: { name: 'string' }, description: 'Error message (replaces hint)' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      type: { name: 'string' },
      description: 'Input type (ignored when multiline is true)',
    },
    required: { control: 'boolean', type: { name: 'boolean' }, description: 'Required field' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
    multiline: { control: 'boolean', type: { name: 'boolean' }, description: 'Render as <textarea> instead of <input>' },
    rows: { control: 'number', type: { name: 'number' }, description: 'Visible row count (multiline only)' },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'both'],
      type: { name: 'string' },
      description: 'CSS resize behaviour (multiline only)',
    },
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
