import type { Meta, StoryObj } from '@storybook/angular';

const BREADCRUMB_BASIC = JSON.stringify([
  { label: 'Home', href: '/' },
  { label: 'Account', href: '/account' },
  { label: 'Settings' },
]);

const BREADCRUMB_DANGER = JSON.stringify([
  { label: 'Home', href: '/' },
  { label: 'Account', href: '/account' },
  { label: 'Settings', href: '/account/settings' },
  { label: 'Advanced' },
]);

const MENU_ENTRIES = JSON.stringify([
  { label: 'Export data' },
  { label: 'Transfer account' },
  'separator',
  { label: 'Delete account' },
]);

const LANGUAGE_OPTIONS = JSON.stringify([
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
]);

const TIMEZONE_OPTIONS = JSON.stringify([
  { value: 'utc-12', label: 'UTC−12:00 — Baker Island' },
  { value: 'utc-08', label: 'UTC−08:00 — Pacific Time' },
  { value: 'utc-07', label: 'UTC−07:00 — Mountain Time' },
  { value: 'utc-06', label: 'UTC−06:00 — Central Time' },
  { value: 'utc-05', label: 'UTC−05:00 — Eastern Time' },
  { value: 'utc+00', label: 'UTC+00:00 — London' },
  { value: 'utc+01', label: 'UTC+01:00 — Paris, Berlin' },
  { value: 'utc+05:30', label: 'UTC+05:30 — India' },
  { value: 'utc+08', label: 'UTC+08:00 — Singapore, Hong Kong' },
  { value: 'utc+09', label: 'UTC+09:00 — Tokyo' },
  { value: 'utc+10', label: 'UTC+10:00 — Sydney' },
  { value: 'utc+12', label: 'UTC+12:00 — Auckland' },
]);

const TAB_DEFS = JSON.stringify([
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
]);

const meta: Meta = {
  title: 'Examples/Settings Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Account settings page assembling the full complement of form and navigation web components:
\`<candor-breadcrumb>\`, \`<candor-tabs>\`, \`<candor-input>\`, \`<candor-select>\`,
\`<candor-combobox>\`, \`<candor-switch>\`, \`<candor-alert>\`, \`<candor-modal>\`,
\`<candor-toast>\`, \`<candor-badge>\`, \`<candor-menu>\`, and \`<candor-button>\`.

Demonstrates canonical patterns for settings UI:
- **Tabs** organize settings into logical sections (Profile, Notifications, Security)
- **Switch** handles instant-effect toggles (email notifications, 2FA)
- **Modal** gates destructive actions (account deletion) behind a confirmation step
- **Alert** communicates persistent warnings (unverified email, billing issues)
- **Toast** confirms completed actions without blocking the page

Use this layout as a reference for any settings or preferences surface.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AccountSettings: Story = {
  render: () => ({
    template: `
      <main style="max-width: 640px; padding: var(--spacing-lg);">

        <candor-breadcrumb items='${BREADCRUMB_BASIC}' style="display: block; margin-bottom: var(--spacing-lg);"></candor-breadcrumb>

        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: var(--spacing-xs); margin-bottom: var(--spacing-xs);">
          <candor-heading level="h1">Account settings</candor-heading>
          <candor-menu label="Account actions" entries='${MENU_ENTRIES}'></candor-menu>
        </div>

        <candor-text variant="body" style="display: block; color: var(--color-text-subtle); margin-bottom: var(--spacing-lg);">
          Manage your profile, preferences, and security settings.
        </candor-text>

        <candor-alert
          variant="info"
          heading="Verify your email"
          message="We sent a verification link to j.smith@example.com. Check your inbox to confirm your address."
          style="display: block; margin-bottom: var(--spacing-lg);">
        </candor-alert>

        <section style="margin-bottom: 2.5rem;">
          <candor-heading level="h2" style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Profile</candor-heading>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--spacing-xs); padding: var(--spacing-sm); background: var(--color-bg-surface); border-radius: var(--radius-md);">
              <div style="min-width: 0;">
                <div style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-default); letter-spacing: 0.02em;">Jane Smith</div>
                <div style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; overflow-wrap: break-word;">j.smith@example.com</div>
              </div>
              <candor-badge variant="success" style="flex-shrink: 0;">Verified</candor-badge>
            </div>
          </div>
        </section>

        <section style="margin-bottom: 2.5rem;">
          <candor-heading level="h2" style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Notifications</candor-heading>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md); margin-bottom: var(--spacing-sm);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Email</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
              <candor-switch label="Security alerts" checked></candor-switch>
              <candor-switch label="Account activity" checked></candor-switch>
              <candor-switch label="Product updates"></candor-switch>
              <candor-switch label="Marketing emails"></candor-switch>
            </div>
          </fieldset>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Push</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
              <candor-switch label="New messages" checked></candor-switch>
              <candor-switch label="Mentions" checked></candor-switch>
              <candor-switch label="Reminders" disabled hint="Requires push to be enabled on your device"></candor-switch>
            </div>
          </fieldset>
        </section>

        <section style="margin-bottom: 2.5rem;">
          <candor-heading level="h2" style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Security</candor-heading>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Two-factor authentication</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
              <candor-switch label="Authenticator app" checked></candor-switch>
              <candor-switch label="SMS backup codes"></candor-switch>
            </div>
          </fieldset>
        </section>

        <div style="display: flex; gap: var(--spacing-sm);">
          <candor-button variant="primary" size="medium">Save changes</candor-button>
          <candor-button variant="ghost" size="medium">Discard</candor-button>
        </div>

        <candor-toast
          variant="success"
          heading="Changes saved"
          message="Your account settings have been updated."
          style="display: block; margin-top: var(--spacing-lg);">
        </candor-toast>
      </main>
    `,
  }),
};

export const DangerZone: Story = {
  render: () => ({
    template: `
      <main style="max-width: 640px; padding: var(--spacing-lg);">
        <candor-breadcrumb items='${BREADCRUMB_DANGER}' style="display: block; margin-bottom: var(--spacing-lg);"></candor-breadcrumb>

        <candor-heading level="h1" style="margin-bottom: var(--spacing-xs);">Advanced settings</candor-heading>
        <candor-text variant="body" style="display: block; color: var(--color-text-subtle); margin-bottom: var(--spacing-lg);">
          These settings affect your account permanently. Proceed with care.
        </candor-text>

        <candor-alert
          variant="warning"
          heading="These actions cannot be undone"
          message="Changes made in this section permanently affect your account and data."
          style="display: block; margin-bottom: var(--spacing-lg);">
        </candor-alert>

        <section style="margin-bottom: var(--spacing-lg);">
          <candor-heading level="h2" style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md);">Data and privacy</candor-heading>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Sharing</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
              <candor-switch label="Allow analytics collection" checked></candor-switch>
              <candor-switch label="Share usage data with partners"></candor-switch>
              <candor-switch label="Personalised recommendations" checked></candor-switch>
            </div>
          </fieldset>
        </section>

        <div style="display: flex; gap: var(--spacing-sm);">
          <candor-button variant="primary">Save</candor-button>
          <candor-button variant="destructive">Delete account</candor-button>
        </div>
      </main>
    `,
  }),
};

export const TabbedSettings: Story = {
  render: () => ({
    template: `
      <main style="max-width: 640px; padding: var(--spacing-lg);">
        <candor-breadcrumb items='${BREADCRUMB_BASIC}' style="display: block; margin-bottom: var(--spacing-lg);"></candor-breadcrumb>

        <candor-heading level="h1" style="margin-bottom: var(--spacing-md);">Account settings</candor-heading>

        <candor-tabs aria-label="Settings sections" active-id="profile" tabs='${TAB_DEFS}'>

          <candor-tab-panel panel-id="profile" active>
            <div style="padding: var(--spacing-md) 0; display: flex; flex-direction: column; gap: 1.25rem;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: var(--spacing-sm);">
                <candor-input label="First name" value="Jane" required></candor-input>
                <candor-input label="Last name" value="Smith" required></candor-input>
              </div>
              <candor-input label="Email address" type="email" value="j.smith@example.com" required hint="Changing your email requires re-verification."></candor-input>
              <candor-select label="Language" value="en" options='${LANGUAGE_OPTIONS}'></candor-select>
              <candor-combobox label="Timezone" value="utc+00" hint="Used for scheduling and notifications." options='${TIMEZONE_OPTIONS}'></candor-combobox>
              <div style="display: flex; gap: var(--spacing-sm); padding-top: var(--spacing-xs);">
                <candor-button variant="primary" size="medium">Save changes</candor-button>
                <candor-button variant="ghost" size="medium">Discard</candor-button>
              </div>
            </div>
          </candor-tab-panel>

          <candor-tab-panel panel-id="notifications">
            <div style="padding: var(--spacing-md) 0; display: flex; flex-direction: column; gap: var(--spacing-sm);">
              <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
                <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Email</legend>
                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
                  <candor-switch label="Security alerts" checked></candor-switch>
                  <candor-switch label="Account activity" checked></candor-switch>
                  <candor-switch label="Product updates"></candor-switch>
                  <candor-switch label="Marketing emails"></candor-switch>
                </div>
              </fieldset>
              <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
                <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Push</legend>
                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
                  <candor-switch label="New messages" checked></candor-switch>
                  <candor-switch label="Mentions" checked></candor-switch>
                  <candor-switch label="Reminders" disabled hint="Requires push to be enabled on your device"></candor-switch>
                </div>
              </fieldset>
              <candor-button variant="primary" size="medium" style="align-self: flex-start;">Save preferences</candor-button>
            </div>
          </candor-tab-panel>

          <candor-tab-panel panel-id="security">
            <div style="padding: var(--spacing-md) 0; display: flex; flex-direction: column; gap: var(--spacing-sm);">
              <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
                <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 var(--spacing-xs);">Two-factor authentication</legend>
                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
                  <candor-switch label="Authenticator app" checked></candor-switch>
                  <candor-switch label="SMS backup codes"></candor-switch>
                </div>
              </fieldset>
              <candor-alert
                variant="info"
                heading="Recovery codes"
                message="You have 6 recovery codes remaining. Generate new codes if you've used most of them."
                style="display: block;">
              </candor-alert>
              <candor-button variant="secondary" size="medium" style="align-self: flex-start;">Generate new codes</candor-button>
            </div>
          </candor-tab-panel>

        </candor-tabs>
      </main>
    `,
  }),
};

export const DeleteConfirmation: Story = {
  render: () => ({
    template: `
      <div style="padding: var(--spacing-lg);">
        <candor-button variant="destructive" size="medium">
          Delete account
        </candor-button>

        <candor-modal heading="Delete account" size="sm" open alert>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
            <candor-text variant="body">
              This will permanently delete your account and all associated data — projects, settings, billing history, and team memberships. This action cannot be undone.
            </candor-text>
            <candor-alert
              variant="warning"
              message="You will lose access immediately and cannot recover your data."
              style="display: block;">
            </candor-alert>
          </div>
          <div slot="footer">
            <candor-button variant="ghost" size="medium">Cancel</candor-button>
            <candor-button variant="destructive" size="medium">Delete my account</candor-button>
          </div>
        </candor-modal>
      </div>
    `,
  }),
};
