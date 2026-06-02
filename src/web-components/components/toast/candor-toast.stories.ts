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

Pair with \`<candor-toast-container position="top-right">\` (or another corner) for
positioning. Auto-dismissal is the consumer's responsibility — listen for the toast's
\`dismissed\` event or use a \`setTimeout\` to remove it from the DOM after a few seconds.

Renders \`role="status"\` for info/success and \`role="alert"\` for warning/error.
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
