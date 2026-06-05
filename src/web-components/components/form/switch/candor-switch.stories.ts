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

export const NoLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `aria-label` when the visible label comes from surrounding context — ' +
          'a table row, a settings list, or a data grid cell — rather than from the ' +
          'component itself. The label is stripped from the host and forwarded to the ' +
          'inner `<input role="switch">` so screen readers hear it exactly once. ' +
          'See **FeatureTable** for a real-world example of this pattern.',
      },
    },
  },
  args: {},
  render: () => ({ template: `<candor-switch aria-label="Toggle feature"></candor-switch>` }),
};

export const FeatureTable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When switches appear in a table or settings list, the row label provides ' +
          'the accessible name — no visible label is needed on the switch itself. ' +
          'Pass `aria-label` matching the row label so screen readers announce the ' +
          'correct name without repeating it.',
      },
    },
  },
  render: () => ({
    template: `
      <table style="border-collapse:collapse;width:100%;max-width:400px;font-family:var(--font-family-base);font-size:var(--font-size-md);">
        <caption style="text-align:left;font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);letter-spacing:var(--letter-spacing-relaxed);text-transform:uppercase;color:var(--color-text-subtle);padding-bottom:var(--spacing-xs);">Feature flags</caption>
        <tbody>
          <tr style="border-bottom:var(--border-width-thin) solid var(--color-border-default);">
            <td style="padding:var(--spacing-sm) 0;color:var(--color-text-default);">Dark mode</td>
            <td style="padding:var(--spacing-sm) 0;text-align:right;"><candor-switch aria-label="Dark mode"></candor-switch></td>
          </tr>
          <tr style="border-bottom:var(--border-width-thin) solid var(--color-border-default);">
            <td style="padding:var(--spacing-sm) 0;color:var(--color-text-default);">Beta features</td>
            <td style="padding:var(--spacing-sm) 0;text-align:right;"><candor-switch aria-label="Beta features" checked></candor-switch></td>
          </tr>
          <tr style="border-bottom:var(--border-width-thin) solid var(--color-border-default);">
            <td style="padding:var(--spacing-sm) 0;color:var(--color-text-default);">Analytics tracking</td>
            <td style="padding:var(--spacing-sm) 0;text-align:right;"><candor-switch aria-label="Analytics tracking" checked></candor-switch></td>
          </tr>
          <tr>
            <td style="padding:var(--spacing-sm) 0;">
              <div style="color:var(--color-text-default);">Marketing emails</div>
              <candor-accessible-text role_="annotation">Unsubscribed at the account level.</candor-accessible-text>
            </td>
            <td style="padding:var(--spacing-sm) 0;text-align:right;vertical-align:top;"><candor-switch aria-label="Marketing emails" disabled></candor-switch></td>
          </tr>
        </tbody>
      </table>
    `,
  }),
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
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:320px;">
        <candor-card>
          <span slot="header">Off (default)</span>
          <candor-switch label="Enable notifications"></candor-switch>
        </candor-card>
        <candor-card>
          <span slot="header">On</span>
          <candor-switch label="Enable notifications" checked></candor-switch>
        </candor-card>
        <candor-card>
          <span slot="header">Disabled off</span>
          <candor-switch label="Enable notifications" disabled hint="Not available on your current plan."></candor-switch>
        </candor-card>
        <candor-card>
          <span slot="header">Disabled on</span>
          <candor-switch label="Enable notifications" checked disabled hint="Managed by your administrator."></candor-switch>
        </candor-card>
      </div>
    `,
  }),
};
