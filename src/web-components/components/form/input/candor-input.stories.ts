import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Form/Input',
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

**Hint and error are shown simultaneously.** The hint appears above the input (between label
and field); the error appears below. Both are associated with the field via \`aria-describedby\`
so screen readers announce them on focus. Keep hint text focused on format guidance — it
remains visible when an error is shown, giving the user the context they need to correct
their input.

Form-associated (\`ElementInternals\`): the value appears in \`FormData\` keyed by \`name\`.
Emits an \`input-change\` CustomEvent on each keystroke.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Field label' },
    value: { control: 'text', type: { name: 'string' }, description: 'Pre-filled field value' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Placeholder text' },
    autocomplete: { control: 'text', type: { name: 'string' }, description: 'HTML autocomplete token (e.g. "email", "current-password", "new-password", "name")' },
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text above the input (below the label); remains visible alongside error' },
    error: { control: 'text', type: { name: 'string' }, description: 'Validation error message shown below the input; displayed alongside hint when both are set' },
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
    template: `<candor-input label="${args['label']}" placeholder="${args['placeholder'] || ''}" type="${args['type']}" error="${args['error'] || ''}" hint="${args['hint'] || ''}" ${args['value'] ? `value="${args['value']}"` : ''} ${args['autocomplete'] ? `autocomplete="${args['autocomplete']}"` : ''} ${args['rows'] ? `rows="${args['rows']}"` : ''} ${args['resize'] ? `resize="${args['resize']}"` : ''} ${args['required'] ? 'required' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['multiline'] ? 'multiline' : ''}></candor-input>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Required: Story = {
  args: { label: 'Username', type: 'text', placeholder: 'Enter username', required: true },
};

export const Disabled: Story = {
  args: { label: 'Username', type: 'text', value: 'Cannot edit', disabled: true },
};

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: 'Enter password', hint: 'Must be at least 8 characters', autocomplete: 'current-password' },
};

export const MultilineWithError: Story = {
  args: { label: 'Description', multiline: true, placeholder: '', error: 'Description is required' },
};

export const MultilineResizeNone: Story = {
  args: { label: 'Notes', multiline: true, placeholder: 'Fixed height — no resize handle', resize: 'none' },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:420px;">
        <candor-card><candor-input label="Default" placeholder="Enter text"></candor-input></candor-card>
        <candor-card><candor-input label="With hint" hint="This is a helpful hint"></candor-input></candor-card>
        <candor-card><candor-input label="Required field" required></candor-input></candor-card>
        <candor-card><candor-input label="With error" error="This field is required"></candor-input></candor-card>
        <candor-card><candor-input label="Disabled" value="Cannot edit" disabled></candor-input></candor-card>
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
    template: `<candor-input label="Email address" type="email" placeholder="you@example.com" hint="We'll only use this to send your receipt."></candor-input>`,
  }),
};

export const Multiline: Story = {
  render: () => ({
    template: `<candor-input label="Message" multiline placeholder="Type your message…" rows="4"></candor-input>`,
  }),
};

export const OnSurface: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of input borders on page background vs surface background. ' +
          'The surface container overrides `--color-border-control` to `var(--color-border-control-on-surface)`, ' +
          'which all child form controls inherit automatically. ' +
          'Without the override, border-control (gray-500) achieves only OKCA 2.5 on bg-surface — ' +
          'below the 3.0 non-text contrast threshold.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md);max-width:640px;">
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <div style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:var(--color-text-subtle);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;">Page background</div>
          <div style="background:var(--color-bg-page);border-radius:var(--radius-md);padding:var(--spacing-lg);display:flex;flex-direction:column;gap:var(--spacing-md);">
            <candor-input label="Full name" placeholder="Jane Smith" required></candor-input>
            <candor-input label="Email address" type="email" placeholder="you@example.com"></candor-input>
            <candor-input label="With error" error="This field is required"></candor-input>
            <candor-input label="Disabled" value="Cannot edit" disabled></candor-input>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <div style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:var(--color-text-subtle);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;">Surface background</div>
          <div style="background:var(--color-bg-surface);border-radius:var(--radius-md);padding:var(--spacing-lg);display:flex;flex-direction:column;gap:var(--spacing-md);--color-border-control:var(--color-border-control-on-surface);">
            <candor-input label="Full name" placeholder="Jane Smith" required></candor-input>
            <candor-input label="Email address" type="email" placeholder="you@example.com"></candor-input>
            <candor-input label="With error" error="This field is required"></candor-input>
            <candor-input label="Disabled" value="Cannot edit" disabled></candor-input>
          </div>
        </div>
      </div>
    `,
  }),
};
