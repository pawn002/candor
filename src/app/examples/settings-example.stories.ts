import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { InputComponent } from '../components/form/input/input.component';
import { SelectComponent } from '../components/form/select/select.component';
import { ComboboxComponent } from '../components/form/combobox/combobox.component';
import { SwitchComponent } from '../components/form/switch/switch.component';
import { AlertComponent } from '../components/alert/alert.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ButtonComponent } from '../components/button/button.component';
import { HeadingComponent } from '../components/typography/heading/heading.component';
import { TextComponent } from '../components/typography/text/text.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { TabPanelComponent } from '../components/tabs/tab-panel.component';
import { ModalComponent } from '../components/modal/modal.component';
import { ToastComponent } from '../components/toast/toast.component';

const meta: Meta = {
  title: 'Angular Components/Examples/Settings Example',
  decorators: [
    moduleMetadata({
      imports: [
        BreadcrumbComponent,
        InputComponent,
        SelectComponent,
        ComboboxComponent,
        SwitchComponent,
        AlertComponent,
        MenuComponent,
        ButtonComponent,
        HeadingComponent,
        TextComponent,
        BadgeComponent,
        TabsComponent,
        TabPanelComponent,
        ModalComponent,
        ToastComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Account settings page assembling the full complement of form and navigation components:
Breadcrumb, Tabs, Input, Select, Combobox, Switch, Alert, Modal, Toast, Badge, Menu, and Button.

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
      <div style="max-width: 640px; padding: 2rem;">

        <app-breadcrumb [items]="[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Settings' }
        ]" style="display: block; margin-bottom: 2rem;"></app-breadcrumb>

        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
          <app-heading [level]="1">Account settings</app-heading>
          <app-menu label="Account actions" [entries]="[
            { label: 'Export data' },
            { label: 'Transfer account' },
            'separator',
            { label: 'Delete account' }
          ]"></app-menu>
        </div>

        <app-text [variant]="'body'" style="display: block; color: var(--color-text-subtle); margin-bottom: 2rem;">
          Manage your profile, preferences, and security settings.
        </app-text>

        <app-alert
          variant="info"
          title="Verify your email"
          message="We sent a verification link to j.smith@example.com. Check your inbox to confirm your address."
          style="display: block; margin-bottom: 2rem;">
        </app-alert>

        <!-- Profile section -->
        <section style="margin-bottom: 2.5rem;">
          <app-heading [level]="2" style="font-size: var(--font-size-lg); margin-bottom: 1.5rem;">Profile</app-heading>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; padding: 1rem; background: var(--color-bg-surface); border-radius: var(--radius-md);">
              <div style="min-width: 0;">
                <div style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-default); letter-spacing: 0.02em;">Jane Smith</div>
                <div style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; overflow-wrap: break-word;">j.smith@example.com</div>
              </div>
              <app-badge variant="success" style="flex-shrink: 0;">Verified</app-badge>
            </div>
          </div>
        </section>

        <!-- Notifications section -->
        <section style="margin-bottom: 2.5rem;">
          <app-heading [level]="2" style="font-size: var(--font-size-lg); margin-bottom: 1.5rem;">Notifications</app-heading>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md); margin-bottom: 1rem;">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Email</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
              <app-switch label="Security alerts" [checked]="true"></app-switch>
              <app-switch label="Account activity" [checked]="true"></app-switch>
              <app-switch label="Product updates" [checked]="false"></app-switch>
              <app-switch label="Marketing emails" [checked]="false"></app-switch>
            </div>
          </fieldset>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Push</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
              <app-switch label="New messages" [checked]="true"></app-switch>
              <app-switch label="Mentions" [checked]="true"></app-switch>
              <app-switch label="Reminders" [checked]="false" [disabled]="true"></app-switch>
            </div>
          </fieldset>
        </section>

        <!-- Security section -->
        <section style="margin-bottom: 2.5rem;">
          <app-heading [level]="2" style="font-size: var(--font-size-lg); margin-bottom: 1.5rem;">Security</app-heading>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Two-factor authentication</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
              <app-switch label="Authenticator app" [checked]="true"></app-switch>
              <app-switch label="SMS backup codes" [checked]="false"></app-switch>
            </div>
          </fieldset>
        </section>

        <div style="display: flex; gap: 1rem;">
          <app-button [variant]="'primary'" [size]="'medium'">Save changes</app-button>
          <app-button [variant]="'ghost'" [size]="'medium'">Discard</app-button>
        </div>

        <!-- Toast: shown here to demonstrate post-save feedback -->
        <app-toast
          variant="success"
          title="Changes saved"
          message="Your account settings have been updated."
          style="display: block; margin-top: 2rem;">
        </app-toast>
      </div>
    `,
  }),
};

export const DangerZone: Story = {
  render: () => ({
    template: `
      <div style="max-width: 640px; padding: 2rem;">
        <app-breadcrumb [items]="[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Settings', href: '/account/settings' },
          { label: 'Advanced' }
        ]" style="display: block; margin-bottom: 2rem;"></app-breadcrumb>

        <app-heading [level]="1" style="margin-bottom: 0.5rem;">Advanced settings</app-heading>
        <app-text [variant]="'body'" style="display: block; color: var(--color-text-subtle); margin-bottom: 2rem;">
          These settings affect your account permanently. Proceed with care.
        </app-text>

        <app-alert
          variant="warning"
          title="These actions cannot be undone"
          message="Changes made in this section permanently affect your account and data."
          style="display: block; margin-bottom: 2rem;">
        </app-alert>

        <section style="margin-bottom: 2rem;">
          <app-heading [level]="2" style="font-size: var(--font-size-lg); margin-bottom: 1.5rem;">Data and privacy</app-heading>
          <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
            <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Sharing</legend>
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
              <app-switch label="Allow analytics collection" [checked]="true"></app-switch>
              <app-switch label="Share usage data with partners" [checked]="false"></app-switch>
              <app-switch label="Personalised recommendations" [checked]="true"></app-switch>
            </div>
          </fieldset>
        </section>

        <div style="display: flex; gap: 1rem;">
          <app-button [variant]="'primary'">Save</app-button>
          <app-button [variant]="'destructive'">Delete account</app-button>
        </div>
      </div>
    `,
  }),
};

export const TabbedSettings: Story = {
  render: () => ({
    template: `
      <div style="max-width: 640px; padding: 2rem;">
        <app-breadcrumb [items]="[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'Settings' }
        ]" style="display: block; margin-bottom: 2rem;"></app-breadcrumb>

        <app-heading [level]="1" style="margin-bottom: 1.5rem;">Account settings</app-heading>

        <app-tabs ariaLabel="Settings sections">

          <app-tab-panel tabId="profile" label="Profile">
            <div style="padding: 1.5rem 0; display: flex; flex-direction: column; gap: 1.25rem;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 1rem;">
                <app-input label="First name" [value]="'Jane'" [required]="true"></app-input>
                <app-input label="Last name" [value]="'Smith'" [required]="true"></app-input>
              </div>
              <app-input label="Email address" type="email" [value]="'j.smith@example.com'" [required]="true" hint="Changing your email requires re-verification."></app-input>
              <app-select
                label="Language"
                [options]="[
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'es', label: 'Spanish' }
                ]"
                [value]="'en'">
              </app-select>
              <app-combobox
                label="Timezone"
                [options]="[
                  'UTC−12:00 — Baker Island',
                  'UTC−08:00 — Pacific Time',
                  'UTC−07:00 — Mountain Time',
                  'UTC−06:00 — Central Time',
                  'UTC−05:00 — Eastern Time',
                  'UTC+00:00 — London',
                  'UTC+01:00 — Paris, Berlin',
                  'UTC+05:30 — India',
                  'UTC+08:00 — Singapore, Hong Kong',
                  'UTC+09:00 — Tokyo',
                  'UTC+10:00 — Sydney',
                  'UTC+12:00 — Auckland'
                ]"
                [value]="'UTC+00:00 — London'"
                hint="Used for scheduling and notifications.">
              </app-combobox>
              <div style="display: flex; gap: 1rem; padding-top: 0.5rem;">
                <app-button [variant]="'primary'" [size]="'medium'">Save changes</app-button>
                <app-button [variant]="'ghost'" [size]="'medium'">Discard</app-button>
              </div>
            </div>
          </app-tab-panel>

          <app-tab-panel tabId="notifications" label="Notifications">
            <div style="padding: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem;">
              <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
                <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Email</legend>
                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
                  <app-switch label="Security alerts" [checked]="true"></app-switch>
                  <app-switch label="Account activity" [checked]="true"></app-switch>
                  <app-switch label="Product updates" [checked]="false"></app-switch>
                  <app-switch label="Marketing emails" [checked]="false"></app-switch>
                </div>
              </fieldset>
              <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
                <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Push</legend>
                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
                  <app-switch label="New messages" [checked]="true"></app-switch>
                  <app-switch label="Mentions" [checked]="true"></app-switch>
                  <app-switch label="Reminders" [checked]="false" [disabled]="true"></app-switch>
                </div>
              </fieldset>
              <app-button [variant]="'primary'" [size]="'medium'" style="align-self: flex-start;">Save preferences</app-button>
            </div>
          </app-tab-panel>

          <app-tab-panel tabId="security" label="Security">
            <div style="padding: 1.5rem 0; display: flex; flex-direction: column; gap: 1rem;">
              <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md);">
                <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Two-factor authentication</legend>
                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem;">
                  <app-switch label="Authenticator app" [checked]="true"></app-switch>
                  <app-switch label="SMS backup codes" [checked]="false"></app-switch>
                </div>
              </fieldset>
              <app-alert
                variant="info"
                title="Recovery codes"
                message="You have 6 recovery codes remaining. Generate new codes if you've used most of them."
                style="display: block;">
              </app-alert>
              <app-button [variant]="'secondary'" [size]="'medium'" style="align-self: flex-start;">Generate new codes</app-button>
            </div>
          </app-tab-panel>

        </app-tabs>
      </div>
    `,
  }),
};

export const DeleteConfirmation: Story = {
  render: () => ({
    props: { isOpen: false },
    template: `
      <div style="padding: 2rem;">
        <app-button [variant]="'destructive'" [size]="'medium'" (clicked)="isOpen = true">
          Delete account
        </app-button>

        <app-modal [open]="isOpen" heading="Delete account" size="sm" (closed)="isOpen = false">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <app-text [variant]="'body'">
              This will permanently delete your account and all associated data — projects, settings, billing history, and team memberships. This action cannot be undone.
            </app-text>
            <app-alert
              variant="warning"
              message="You will lose access immediately and cannot recover your data."
              style="display: block;">
            </app-alert>
          </div>
          <div slot="footer" style="display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1.25rem 1.5rem; border-top: 1px solid var(--color-border-default);">
            <app-button [variant]="'ghost'" [size]="'medium'" (clicked)="isOpen = false">Cancel</app-button>
            <app-button [variant]="'destructive'" [size]="'medium'">Delete my account</app-button>
          </div>
        </app-modal>
      </div>
    `,
  }),
};
