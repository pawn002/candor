import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TabsComponent } from './tabs.component';
import { TabPanelComponent } from './tab-panel.component';

const meta: Meta<TabsComponent> = {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TabPanelComponent] })],
  argTypes: {
    ariaLabel: { control: 'text', type: { name: 'string' }, description: 'Accessible label for the tab list' },
    theme: {
      control: 'select',
      options: ['default', 'inverse'],
      description: 'default renders on a light surface; inverse renders on --color-bg-inverse',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'horizontal: tab list above panels (default). vertical: tab list left, panels right — suited to sidebar navigation and settings panels.',
    },
  },
};

export default meta;
type Story = StoryObj<TabsComponent>;

export const Default: Story = {
  args: { ariaLabel: 'Product information' },
  render: (args) => ({
    props: args,
    template: `
      <app-tabs [ariaLabel]="ariaLabel">
        <app-tab-panel tabId="overview" label="Overview">
          <p>This is the overview panel. It contains a summary of all the important information you need to get started.</p>
        </app-tab-panel>
        <app-tab-panel tabId="features" label="Features">
          <p>Explore the features available in this product. Each feature is designed to help you work more efficiently.</p>
        </app-tab-panel>
        <app-tab-panel tabId="pricing" label="Pricing">
          <p>Choose a plan that fits your needs. All plans include a 14-day free trial with no commitment.</p>
        </app-tab-panel>
      </app-tabs>
    `,
  }),
};

export const Inverse: Story = {
  render: () => ({
    template: `
      <app-tabs ariaLabel="Section navigation" theme="inverse">
        <app-tab-panel tabId="overview" label="Overview">
          <p style="padding-top: var(--spacing-sm);">Inverse tabs sit on a dark surface — common in app shells with dark headers.</p>
        </app-tab-panel>
        <app-tab-panel tabId="details" label="Details">
          <p style="padding-top: var(--spacing-sm);">The tab list uses --color-bg-inverse; the panels render on the page background below.</p>
        </app-tab-panel>
        <app-tab-panel tabId="history" label="History">
          <p style="padding-top: var(--spacing-sm);">Active tab indicator and text use --color-text-inverse (white in light mode).</p>
        </app-tab-panel>
      </app-tabs>
    `,
  }),
};

export const Vertical: Story = {
  name: 'Vertical orientation',
  render: () => ({
    template: `
      <app-tabs orientation="vertical" ariaLabel="Account settings">
        <app-tab-panel tabId="profile" label="Profile">
          <p>Manage your profile information, including your name, email, and avatar.</p>
        </app-tab-panel>
        <app-tab-panel tabId="security" label="Security">
          <p>Update your password, enable two-factor authentication, and review active sessions.</p>
        </app-tab-panel>
        <app-tab-panel tabId="notifications" label="Notifications">
          <p>Configure email, push, and in-app notification preferences.</p>
        </app-tab-panel>
        <app-tab-panel tabId="billing" label="Billing">
          <p>View billing history, update payment methods, and manage subscriptions.</p>
        </app-tab-panel>
      </app-tabs>
    `,
  }),
};

export const VerticalSidebar: Story = {
  name: 'Pattern: Sidebar navigation',
  render: () => ({
    template: `
      <div style="height: 320px; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); overflow: hidden;">
        <app-tabs orientation="vertical" ariaLabel="Project navigation" style="height: 100%;">
          <app-tab-panel tabId="overview" label="Overview">
            <h3 style="margin-top: 0; font-family: var(--font-family-base); font-size: var(--font-size-lg);">Project overview</h3>
            <p style="color: var(--color-text-subtle);">Summary of goals, timeline, and key stakeholders.</p>
          </app-tab-panel>
          <app-tab-panel tabId="deliberations" label="Deliberations">
            <h3 style="margin-top: 0; font-family: var(--font-family-base); font-size: var(--font-size-lg);">Deliberations</h3>
            <p style="color: var(--color-text-subtle);">Structured discussion threads and decision records.</p>
          </app-tab-panel>
          <app-tab-panel tabId="documents" label="Documents">
            <h3 style="margin-top: 0; font-family: var(--font-family-base); font-size: var(--font-size-lg);">Documents</h3>
            <p style="color: var(--color-text-subtle);">Attached files, briefs, and reference materials.</p>
          </app-tab-panel>
          <app-tab-panel tabId="settings" label="Settings">
            <h3 style="margin-top: 0; font-family: var(--font-family-base); font-size: var(--font-size-lg);">Settings</h3>
            <p style="color: var(--color-text-subtle);">Project name, access controls, and archive options.</p>
          </app-tab-panel>
        </app-tabs>
      </div>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    props: {
      onTabChange: (id: string) => console.log('Tab changed to:', id),
    },
    template: `
      <app-tabs activeId="settings" ariaLabel="Account settings" (tabChange)="onTabChange($event)">
        <app-tab-panel tabId="profile" label="Profile">
          <p>Manage your profile information, including your name, email, and avatar.</p>
        </app-tab-panel>
        <app-tab-panel tabId="settings" label="Settings">
          <p>Configure your account settings, notification preferences, and privacy controls.</p>
        </app-tab-panel>
        <app-tab-panel tabId="billing" label="Billing">
          <p>View your billing history, update payment methods, and manage subscriptions.</p>
        </app-tab-panel>
      </app-tabs>
    `,
  }),
};
