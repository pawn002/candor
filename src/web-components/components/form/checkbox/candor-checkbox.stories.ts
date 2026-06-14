import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Form/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-checkbox>\` — binary toggle for a single yes/no choice. Use for independent options
that don't affect each other — "Subscribe to newsletter", "Accept terms", "Enable feature".

**Checkbox vs. Switch:** Use a checkbox when the user must explicitly submit the form to apply
the change. Use a switch when the change takes effect immediately on toggle.

**Group checkboxes in a \`<fieldset>\` with a \`<legend>\`** when presenting a set of related
options. A \`<div>\` with a visible heading is not sufficient — screen readers announce the
legend as the group label for each individual checkbox.

Form-associated (\`ElementInternals\`): the value appears in \`FormData\` when wrapped in a
\`<form>\`, validation works, and \`:disabled\` styling applies natively.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Checkbox label text' },
    checked: { control: 'boolean', type: { name: 'boolean' }, description: 'Checked state' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
    required: { control: 'boolean', type: { name: 'boolean' }, description: 'Required for form submission' },
  },
  args: { label: 'Accept terms and conditions', checked: false, disabled: false, required: false },
  render: (args) => html`<candor-checkbox label="${args['label']}" ${args['checked'] ? 'checked' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['required'] ? 'required' : ''}></candor-checkbox>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <candor-checkbox label="Unchecked"></candor-checkbox>
      <candor-checkbox label="Checked" checked></candor-checkbox>
      <candor-checkbox label="Disabled unchecked" disabled></candor-checkbox>
      <candor-checkbox label="Disabled checked" checked disabled></candor-checkbox>
    </div>
  `,
};

export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <candor-checkbox label="Option 1" checked></candor-checkbox>
      <candor-checkbox label="Option 2" checked></candor-checkbox>
      <candor-checkbox label="Option 3"></candor-checkbox>
      <candor-checkbox label="Disabled option" disabled></candor-checkbox>
    </div>
  `,
};

export const Group: Story = {
  render: () => html`
    <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
      <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.5rem;">Notifications</legend>
      <candor-checkbox label="Email notifications" checked></candor-checkbox>
      <candor-checkbox label="SMS notifications"></candor-checkbox>
      <candor-checkbox label="Push notifications" disabled></candor-checkbox>
    </fieldset>
  `,
};
