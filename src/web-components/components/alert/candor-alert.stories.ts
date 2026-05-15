import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Alert',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    heading: { control: 'text' },
    message: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: { variant: 'info', heading: '', message: 'This is an informational message.', dismissible: false },
  render: (args) => ({
    template: `<candor-alert variant="${args['variant']}" heading="${args['heading']}" message="${args['message']}" ${args['dismissible'] ? 'dismissible' : ''}></candor-alert>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Info: Story = {
  args: { variant: 'info', message: 'Your session will expire in 10 minutes.' },
};

export const Success: Story = {
  args: { variant: 'success', heading: 'Changes saved', message: 'Your profile has been updated successfully.' },
};

export const Warning: Story = {
  args: { variant: 'warning', heading: 'Unsaved changes', message: 'You have unsaved changes that will be lost if you navigate away.' },
};

export const Error: Story = {
  args: { variant: 'error', heading: 'Submission failed', message: 'There was a problem submitting your form. Please try again.' },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    heading: 'New feature available',
    message: 'You can now export your data as CSV from the settings page.',
    dismissible: true,
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;max-width:560px;">
        <candor-alert variant="info" message="This action cannot be undone. Review before continuing."></candor-alert>
        <candor-alert variant="success" heading="Payment received" message="Your invoice has been paid and a receipt has been sent."></candor-alert>
        <candor-alert variant="warning" heading="Storage limit approaching" message="You have used 90% of your allocated storage quota."></candor-alert>
        <candor-alert variant="error" heading="Authentication failed" message="Your session has expired. Please sign in again."></candor-alert>
      </div>
    `,
  }),
};

export const InlineFormValidation: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;max-width:480px;">
        <div>
          <label for="story-email" style="display:block;font-family:var(--font-family-accessible);font-size:var(--font-size-sm);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;color:var(--color-text-subtle);margin-bottom:0.5rem;">Email address</label>
          <input id="story-email" type="email" value="notanemail" style="display:block;width:100%;padding:var(--spacing-sm);border:2px solid var(--color-status-error);border-radius:var(--radius-md);font-family:var(--font-family-accessible);font-size:var(--font-size-md);background:var(--color-bg-page);color:var(--color-text-default);box-sizing:border-box;" aria-describedby="email-error" aria-invalid="true" />
        </div>
        <candor-alert id="email-error" variant="error" message="Enter a valid email address, for example name@example.com."></candor-alert>
      </div>
    `,
  }),
};
