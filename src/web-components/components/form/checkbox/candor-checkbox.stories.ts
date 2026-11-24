import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../typography/accessible-text/candor-accessible-text';
import './candor-checkbox';

const meta: Meta = {
  title: 'Components/Form/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-checkbox>\`: a binary toggle for a single yes/no choice. Use for independent options
that don't affect each other: "Subscribe to newsletter", "Accept terms", "Enable feature".

**Checkbox vs. Switch:** Use a checkbox when the user must explicitly submit the form to apply
the change. Use a switch when the change takes effect immediately on toggle.

**Group checkboxes in a \`<fieldset>\` with a \`<legend>\`** when presenting a set of related
options. A \`<div>\` with a visible heading is not sufficient. Screen readers announce the
legend as the group label for each individual checkbox.

Form-associated (\`ElementInternals\`): the value appears in \`FormData\` when wrapped in a
\`<form>\`, and \`:disabled\` styling applies natively. \`required\` is set on the inner input only;
the checkbox does not report validity to the form.

**Events.** \`change\` fires on toggle, carrying the new checked state as a \`boolean\` in
\`detail\`. There is no live \`input\` event, because a checkbox has no mid-edit phase.
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
  render: (args) => html`<candor-checkbox label="${args['label']}" ?checked=${args['checked']} ?disabled=${args['disabled']} ?required=${args['required']}></candor-checkbox>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Visual reference for each state. In real use a disabled checkbox needs a readable reason beside it, as in **Group**; the bare ones here are a treatment showcase, not a usage template.',
      },
    },
  },
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
    <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:1rem;">
      <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.5rem;">Export formats</legend>
      <candor-checkbox label="CSV" checked></candor-checkbox>
      <candor-checkbox label="JSON" checked></candor-checkbox>
      <candor-checkbox label="XLSX"></candor-checkbox>
      <candor-checkbox label="PDF" disabled></candor-checkbox>
      <candor-accessible-text role_="annotation" style="display:block;">PDF export is available on the Team plan.</candor-accessible-text>
    </fieldset>
  `,
};

export const Group: Story = {
  render: () => html`
    <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
      <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:0.5rem;">Notifications</legend>
      <candor-checkbox label="Email notifications" checked></candor-checkbox>
      <candor-checkbox label="SMS notifications"></candor-checkbox>
      <candor-checkbox label="Push notifications" disabled></candor-checkbox>
      <candor-accessible-text role_="annotation" style="display:block;">Push notifications need the mobile app.</candor-accessible-text>
    </fieldset>
  `,
};
