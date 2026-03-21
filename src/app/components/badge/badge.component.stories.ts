import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BadgeComponent } from './badge.component';
import { CardComponent } from '../card/card.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CardComponent] })],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'error', 'warning'],
      description: 'Badge color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Badge size',
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <app-badge variant="default">Default</app-badge>
        <app-badge variant="primary">Primary</app-badge>
        <app-badge variant="secondary">Secondary</app-badge>
        <app-badge variant="success">Success</app-badge>
        <app-badge variant="error">Error</app-badge>
        <app-badge variant="warning">Warning</app-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <app-badge variant="primary" size="sm">Small</app-badge>
        <app-badge variant="primary" size="md">Medium</app-badge>
      </div>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; margin-top: 1rem;">
        <app-badge variant="error" size="sm">Small</app-badge>
        <app-badge variant="error" size="md">Medium</app-badge>
      </div>
    `,
  }),
};

export const InContext: Story = {
  render: () => ({
    template: `
      <app-card variant="outlined" padding="md">
        <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Notifications</span>
          <app-badge variant="primary">3 new</app-badge>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Build completed</span>
            <app-badge variant="success">Success</app-badge>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Disk usage at 90%</span>
            <app-badge variant="warning">Warning</app-badge>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Deploy failed</span>
            <app-badge variant="error">Error</app-badge>
          </div>
        </div>
      </app-card>
    `,
  }),
};
