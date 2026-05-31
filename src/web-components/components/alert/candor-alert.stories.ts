import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-alert>\` — inline status message for page-level feedback. Use for form submission
results, system notices, validation summaries. Four variants: \`info\`, \`success\`,
\`warning\`, \`error\`.

**Alert vs. Toast:** Alerts are persistent and inline — they live in the document flow and
remain visible until dismissed or the state changes. Toasts are ephemeral and float over
content — use them for transient feedback that doesn't require acknowledgement.

**Warning and success text uses dark text on a tinted background**, not colored text.
Colored text at these hues fails contrast on white. The background tint + icon + heading
together carry the semantic signal without needing to rely on text color alone.

Renders \`role="status"\` for info/success and \`role="alert"\` for warning/error — screen
readers announce error/warning content automatically when the element appears.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      type: { name: 'string' },
      description: 'Alert color variant',
    },
    heading: { control: 'text', type: { name: 'string' }, description: 'Optional heading' },
    message: { control: 'text', type: { name: 'string' }, description: 'Body text' },
    dismissible: { control: 'boolean', type: { name: 'boolean' }, description: 'Show dismiss button (emits "dismissed" event)' },
  },
  args: { variant: 'info', heading: '', message: 'This is an informational message.', dismissible: false },
  render: (args) => ({
    template: `<candor-alert variant="${args['variant']}" heading="${args['heading']}" message="${args['message']}" ${args['dismissible'] ? 'dismissible' : ''}></candor-alert>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

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
