import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';

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

**Events** follow the Candor two-event rule (see \`events.ts\` / #164): \`input\` streams the
live value on every keystroke; \`change\` fires the committed value on blur and on Enter. Both
carry the value as a plain \`string\` in \`detail\`. The legacy \`input-change\` is still emitted
with the same live semantics as \`input\` — deprecated, removed in the next major (#201).

**Styling hooks.** Override density without forking via custom properties —
\`--candor-input-{padding-x,padding-y,font-size,radius}\`, each defaulting to its token.
For arbitrary restyle, the internals expose \`::part(input)\`, \`::part(label)\`, \`::part(hint)\`,
and \`::part(error-message)\`. See the Introduction → "Styling & overriding" section.
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
  render: (args) => html`<candor-input label="${args['label']}" placeholder="${args['placeholder'] || ''}" type="${args['type']}" error="${args['error'] || ''}" hint="${args['hint'] || ''}" value=${args['value'] || nothing} autocomplete=${args['autocomplete'] || nothing} rows=${args['rows'] || nothing} resize=${args['resize'] || nothing} ?required=${args['required']} ?disabled=${args['disabled']} ?multiline=${args['multiline']}></candor-input>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Required: Story = {
  args: { label: 'Username', type: 'text', placeholder: 'Enter username', required: true },
};

export const Disabled: Story = {
  args: { label: 'Username', type: 'text', value: 'j.rivera', disabled: true, hint: 'Your username was set at signup and cannot be changed.' },
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
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:420px;">
      <candor-card><candor-input label="Default" placeholder="Enter text"></candor-input></candor-card>
      <candor-card><candor-input label="With hint" hint="This is a helpful hint"></candor-input></candor-card>
      <candor-card><candor-input label="Required field" required></candor-input></candor-card>
      <candor-card><candor-input label="With error" error="This field is required"></candor-input></candor-card>
      <candor-card><candor-input label="Disabled" value="Cannot edit" disabled></candor-input></candor-card>
    </div>
  `,
};

export const WithError: Story = {
  render: () => html`<candor-input label="Email address" type="email" value="bad@" error="Enter a valid email address."></candor-input>`,
};

export const WithHint: Story = {
  render: () => html`<candor-input label="Email address" type="email" placeholder="you@example.com" hint="We'll only use this to send your receipt."></candor-input>`,
};

export const Multiline: Story = {
  render: () => html`<candor-input label="Message" multiline placeholder="Type your message…" rows="4"></candor-input>`,
};

export const OnSurface: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of input borders on page background vs surface background. ' +
          'The surface container overrides `--color-border-control` to `var(--color-border-control-on-surface)`, ' +
          'which all child form controls inherit automatically. ' +
          'Without the override, border-control (gray-500) achieves only OKCA 2.9 on bg-surface — ' +
          'below the 3.0 non-text contrast threshold.',
      },
    },
  },
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 240px), 1fr));gap:var(--spacing-md);max-width:640px;">
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
};

export const Overriding: Story = {
  name: 'Overriding styles (parts + custom properties)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two opt-in hooks restyle an input without forking. **Custom properties** (`--candor-input-{padding-x,padding-y,font-size,radius}`) are the blessed density/shape knobs, each defaulting to its token — here one field is made denser and squared-off. **`::part(input)`**, `::part(label)`, `::part(hint)`, and `::part(error-message)` are the escape hatch for arbitrary CSS the knobs do not cover (here the label is upper-cased and tracked).',
      },
    },
  },
  render: () => html`
    <style>
      .compact { --candor-input-padding-y: 0.25rem; --candor-input-padding-x: 0.5rem; --candor-input-radius: var(--radius-sm); }
      .tracked::part(label) { text-transform: uppercase; letter-spacing: 0.06em; }
    </style>
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:420px;">
      <candor-input label="Default" placeholder="you@example.com" type="email"></candor-input>
      <candor-input class="compact" label="Denser via custom props" placeholder="Tighter padding, square corners"></candor-input>
      <candor-input class="tracked" label="::part restyle" placeholder="Label upper-cased via ::part(label)"></candor-input>
    </div>
  `,
};
