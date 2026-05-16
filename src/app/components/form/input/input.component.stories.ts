import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Angular Components/Form/Input',
  component: InputComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Single-line or multiline text field with label, optional hint, and error state. Covers text,
email, password, and number input types, plus a textarea mode via \`multiline\`.

The label is always rendered — never omit it for visual reasons. If the design calls for a
labelless input, use the \`ariaLabel\` input instead so the field remains accessible.

**Hint and error are mutually exclusive at display time.** When \`error\` is set it replaces
the hint text in the DOM and is associated with the field via \`aria-describedby\`. Don't
duplicate the error message in both \`hint\` and \`error\`.
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
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    hint: 'We will never share your email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    error: 'This email is already taken',
  },
};

export const Required: Story = {
  args: {
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    type: 'text',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    hint: 'Must be at least 8 characters',
  },
};

export const Multiline: Story = {
  args: {
    label: 'Description',
    multiline: true,
    rows: 4,
    placeholder: 'Brief description...',
    hint: 'Maximum 500 characters',
  },
};

export const MultilineWithError: Story = {
  args: {
    label: 'Description',
    multiline: true,
    rows: 4,
    error: 'Description is required',
  },
};

export const MultilineResizeNone: Story = {
  args: {
    label: 'Notes',
    multiline: true,
    rows: 3,
    resize: 'none',
    placeholder: 'Fixed height — no resize handle',
  },
};

export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
        <app-input label="Default" type="text" placeholder="Enter text"></app-input>
        <app-input label="With hint" type="text" hint="This is a helpful hint"></app-input>
        <app-input label="Required field" type="text" [required]="true"></app-input>
        <app-input label="With error" type="text" error="This field is required"></app-input>
        <app-input label="Disabled" type="text" placeholder="Cannot edit" [disabled]="true"></app-input>
      </div>
    `,
  }),
};
