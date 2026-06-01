import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Form/Switch',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-switch>\` — toggle for a boolean setting that takes effect immediately on flip. The
visual metaphor is a physical on/off switch — no submit required.

**Switch vs. Checkbox:** Use a switch when the change is applied immediately (dark mode,
notifications, live filter toggles). Use a checkbox when the value is collected and submitted
as part of a form.

Set \`aria-label\` on the custom element when the switch has no adjacent visible label. The
component reflects it onto the inner \`<input type="checkbox" role="switch">\` — relying on
attribute inheritance from the host alone does not work.

Set \`hint\` whenever the switch is disabled — a disabled control with no explanation reads as
broken. The hint is the only channel for telling the user whether the lock is a permission
boundary, a system constraint, or a state they can change elsewhere.

Form-associated (\`ElementInternals\`): emits a \`change\` CustomEvent and appears in
\`FormData\` when wrapped in a \`<form>\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Switch label text' },
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text shown below the switch; always include when disabled' },
    checked: { control: 'boolean', type: { name: 'boolean' }, description: 'Checked state' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
  },
  args: { label: 'Enable notifications', checked: false, disabled: false },
  render: (args) => ({
    template: `<candor-switch label="${args['label']}" ${args['hint'] ? `hint="${args['hint']}"` : ''} ${args['checked'] ? 'checked' : ''} ${args['disabled'] ? 'disabled' : ''}></candor-switch>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Checked: Story = { args: { label: 'Dark mode', checked: true } };
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: '**Candor pattern: disabled fields must have a hint.** Always explain why the switch is locked.',
      },
    },
  },
  args: { label: 'Unavailable option', disabled: true, hint: 'Not available on your current plan.' },
};
export const DisabledChecked: Story = {
  args: { label: 'Locked setting', checked: true, disabled: true, hint: 'Managed by your administrator.' },
};

export const NoLabel: Story = {
  args: {},
  render: () => ({ template: `<candor-switch aria-label="Toggle feature"></candor-switch>` }),
};

export const FormGroup: Story = {
  render: () => ({
    template: `
      <fieldset style="border:var(--border-width-thin) solid var(--color-border-default);border-radius:var(--radius-md);padding:var(--spacing-md);max-width:360px;">
        <legend style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;color:var(--color-text-subtle);padding:0 var(--spacing-xs);">Notification preferences</legend>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);margin-top:var(--spacing-xs);">
          <candor-switch label="Email notifications" checked></candor-switch>
          <candor-switch label="Push notifications"></candor-switch>
          <candor-switch label="Weekly digest" checked></candor-switch>
          <candor-switch label="Marketing emails" disabled hint="Unsubscribed at the account level. Contact support to change."></candor-switch>
        </div>
      </fieldset>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-switch label="Off (default)"></candor-switch>
        <candor-switch label="On" checked></candor-switch>
        <candor-switch label="Disabled off" disabled hint="Not available on your current plan."></candor-switch>
        <candor-switch label="Disabled on" checked disabled hint="Managed by your administrator."></candor-switch>
      </div>
    `,
  }),
};
