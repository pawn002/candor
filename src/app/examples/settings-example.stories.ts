import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { SwitchComponent } from '../components/form/switch/switch.component';
import { AlertComponent } from '../components/alert/alert.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ButtonComponent } from '../components/button/button.component';
import { HeadingComponent } from '../components/typography/heading/heading.component';
import { TextComponent } from '../components/typography/text/text.component';
import { BadgeComponent } from '../components/badge/badge.component';

const meta: Meta = {
  title: 'Examples/Settings Example',
  decorators: [
    moduleMetadata({
      imports: [
        BreadcrumbComponent,
        SwitchComponent,
        AlertComponent,
        MenuComponent,
        ButtonComponent,
        HeadingComponent,
        TextComponent,
        BadgeComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
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

        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.5rem;">
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
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--color-bg-surface); border-radius: var(--radius-md);">
              <div>
                <div style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-default); letter-spacing: 0.02em;">Jane Smith</div>
                <div style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">j.smith@example.com</div>
              </div>
              <app-badge variant="success">Verified</app-badge>
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
