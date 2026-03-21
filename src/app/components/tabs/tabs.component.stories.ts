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
    activeId: {
      control: 'text',
      description: 'Active tab ID',
    },
  },
};

export default meta;
type Story = StoryObj<TabsComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <app-tabs ariaLabel="Product information">
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
