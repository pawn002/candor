import type { Meta, StoryObj } from '@storybook/angular';
import { SwitchComponent } from './switch.component';

const meta: Meta<SwitchComponent> = {
  title: 'Components/Form/Switch',
  component: SwitchComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Toggle for a boolean setting that takes effect immediately on flip. The visual metaphor is a
physical on/off switch — no submit required.

**Switch vs. Checkbox:** Use a switch when the change is applied immediately (dark mode,
notifications, live filter toggles). Use a checkbox when the value is collected and submitted
as part of a form.

The \`ariaLabel\` input must be set when the switch has no adjacent visible label — the inner
\`<input type="checkbox">\` needs an accessible name and inheriting one from a host-element
\`aria-label\` does not work in Angular's component model.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<SwitchComponent>;

export const Default: Story = {
  args: { label: 'Enable notifications', checked: false },
};

export const Checked: Story = {
  args: { label: 'Dark mode', checked: true },
};

export const Disabled: Story = {
  args: { label: 'Unavailable option', checked: false, disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Locked setting', checked: true, disabled: true },
};

export const NoLabel: Story = {
  args: { checked: false },
  render: (args) => ({
    props: args,
    // aria-label on the host element does NOT reach the inner <input> — use [ariaLabel] instead
    template: `<app-switch [checked]="checked" ariaLabel="Toggle feature"></app-switch>`,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <app-switch label="Off" [checked]="false"></app-switch>
        <app-switch label="On" [checked]="true"></app-switch>
        <app-switch label="Disabled off" [checked]="false" [disabled]="true"></app-switch>
        <app-switch label="Disabled on" [checked]="true" [disabled]="true"></app-switch>
      </div>
    `,
  }),
};

export const FormGroup: Story = {
  render: () => ({
    template: `
      <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md); max-width: 360px;">
        <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Notification preferences</legend>
        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
          <app-switch label="Email notifications" [checked]="true"></app-switch>
          <app-switch label="Push notifications" [checked]="false"></app-switch>
          <app-switch label="Weekly digest" [checked]="true"></app-switch>
          <app-switch label="Marketing emails" [checked]="false" [disabled]="true"></app-switch>
        </div>
      </fieldset>
    `,
  }),
};
