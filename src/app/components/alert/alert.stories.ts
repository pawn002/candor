import type { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './alert.component';

const meta: Meta<AlertComponent> = {
  title: 'Components/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    title: { control: 'text' },
    message: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<AlertComponent>;

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'Your session will expire in 10 minutes.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Changes saved',
    message: 'Your profile has been updated successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Unsaved changes',
    message: 'You have unsaved changes that will be lost if you navigate away.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Submission failed',
    message: 'There was a problem submitting your form. Please try again.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'New feature available',
    message: 'You can now export your data as CSV from the settings page.',
    dismissible: true,
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 560px;">
        <app-alert variant="info" message="This action cannot be undone. Review before continuing."></app-alert>
        <app-alert variant="success" title="Payment received" message="Your invoice has been paid and a receipt has been sent."></app-alert>
        <app-alert variant="warning" title="Storage limit approaching" message="You have used 90% of your allocated storage quota."></app-alert>
        <app-alert variant="error" title="Authentication failed" message="Your session has expired. Please sign in again."></app-alert>
      </div>
    `,
  }),
};

export const InlineFormValidation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 480px;">
        <div>
          <label style="display: block; font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); margin-bottom: 0.5rem;">Email address</label>
          <input type="email" value="notanemail" style="display: block; width: 100%; padding: var(--spacing-sm); border: 2px solid var(--color-status-error); border-radius: var(--radius-md); font-family: var(--font-family-accessible); font-size: var(--font-size-md); background: var(--color-bg-page); color: var(--color-text-default);" aria-describedby="email-error" aria-invalid="true" />
        </div>
        <app-alert id="email-error" variant="error" message="Enter a valid email address, for example name@example.com."></app-alert>
      </div>
    `,
  }),
};
