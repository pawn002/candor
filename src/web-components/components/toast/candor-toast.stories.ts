import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-toast>\` — ephemeral notification that floats over content. Use for transient
feedback that doesn't require acknowledgement — file saved, action completed, background
task finished.

**Toast vs. Alert:** Toasts are for events the user triggered but doesn't need to act on.
Alerts are for persistent conditions the user must read — validation errors, system warnings,
confirmation requirements.

Renders \`role="status"\` for info/success and \`role="alert"\` for warning/error.

Use \`<candor-toast-container position="top-right">\` (or \`top-left\`, \`bottom-right\`,
\`bottom-left\`) to fix a stack to a corner of the viewport. Add and remove toasts
programmatically — auto-dismissal is the consumer's responsibility:

\`\`\`js
const container = document.querySelector('candor-toast-container');

function showToast(message, variant = 'info', autoDismissMs = 4000) {
  const toast = Object.assign(document.createElement('candor-toast'), {
    message, variant, dismissible: true,
  });
  container.appendChild(toast);
  const timer = setTimeout(() => toast.remove(), autoDismissMs);
  toast.addEventListener('dismissed', () => { clearTimeout(timer); toast.remove(); });
}

showToast('Your changes have been saved.', 'success');
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      type: { name: 'string' },
      description: 'Toast color variant',
    },
    heading: { control: 'text', type: { name: 'string' }, description: 'Optional heading' },
    message: { control: 'text', type: { name: 'string' }, description: 'Toast message text' },
    dismissible: { control: 'boolean', type: { name: 'boolean' }, description: 'Show dismiss button (emits "dismissed" event)' },
  },
  args: { variant: 'info', heading: '', message: 'Your changes have been saved.', dismissible: true },
  render: (args) => ({
    template: `<candor-toast variant="${args['variant']}" heading="${args['heading']}" message="${args['message']}" ${args['dismissible'] ? 'dismissible' : ''}></candor-toast>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-toast variant="info" message="Your session expires in 10 minutes."></candor-toast>
        <candor-toast variant="success" heading="Saved" message="Your profile has been updated." dismissible></candor-toast>
        <candor-toast variant="warning" heading="Low storage" message="You are using 95% of your quota." dismissible></candor-toast>
        <candor-toast variant="error" heading="Upload failed" message="The file exceeds the 10 MB limit." dismissible></candor-toast>
      </div>
    `,
  }),
};

export const InContainer: Story = {
  name: 'In container (positioned)',
  parameters: {
    docs: {
      description: {
        story:
          '`<candor-toast-container>` fixes a toast stack to a corner of the viewport. ' +
          'This story pre-loads two toasts into a `top-right` container — in production, ' +
          'toasts are added/removed via the `showToast` helper shown in the component description above. ' +
          'The dismiss button removes the toast from the DOM and fires a `dismissed` event so your timer can be cleared.',
      },
    },
  },
  render: () => ({
    template: `
      <p style="margin:0;font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">
        Toasts are fixed to the top-right corner of this canvas iframe.
      </p>
      <candor-toast-container position="top-right">
        <candor-toast variant="success" heading="Saved" message="Your changes have been saved." dismissible></candor-toast>
        <candor-toast variant="info" message="Background sync completed." dismissible></candor-toast>
      </candor-toast-container>
    `,
  }),
};

export const WithHeading: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-toast variant="info" heading="Information" message="This is an informational message with a heading."></candor-toast>
        <candor-toast variant="success" heading="Success" message="Your changes have been saved successfully."></candor-toast>
        <candor-toast variant="warning" heading="Warning" message="Your session will expire in 5 minutes."></candor-toast>
        <candor-toast variant="error" heading="Error" message="Failed to save changes. Please check your connection."></candor-toast>
      </div>
    `,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-toast variant="success" heading="File uploaded" message="Your file has been uploaded successfully." dismissible></candor-toast>
        <candor-toast variant="error" heading="Upload failed" message="The file could not be uploaded. Please try again." dismissible></candor-toast>
      </div>
    `,
  }),
};
