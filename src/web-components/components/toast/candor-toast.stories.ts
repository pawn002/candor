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

**Sizing:** Override width constraints per-instance via CSS custom properties:

| Property | Default | Controls |
|---|---|---|
| \`--candor-toast-min-width\` | \`18rem\` | Minimum toast width |
| \`--candor-toast-max-width\` | \`28rem\` | Maximum toast width |

\`\`\`css
candor-toast-container { --candor-toast-min-width: 24rem; }
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
    dismissible: { control: 'boolean', type: { name: 'boolean' }, description: 'Show dismiss button' },
    dismissed: { control: false, description: 'CustomEvent fired when the dismiss button is clicked. Consumer is responsible for removing the element from the DOM.' },
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
        <candor-toast variant="info" message="Your session expires in 10 minutes." dismissible></candor-toast>
        <candor-toast variant="success" heading="Saved" message="Your profile has been updated." dismissible></candor-toast>
        <candor-toast variant="warning" heading="Low storage" message="You are using 95% of your quota." dismissible></candor-toast>
        <candor-toast variant="error" heading="Upload failed" message="The file exceeds the 10 MB limit." dismissible></candor-toast>
      </div>
    `,
  }),
};

export const Triggered: Story = {
  name: 'Triggered (button → toast)',
  parameters: {
    docs: {
      description: {
        story:
          'Click the button to add a toast. Each click cycles through the four variants so you can see them stack. ' +
          'Toasts auto-dismiss after 4 s; the dismiss button clears the timer and removes immediately.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-toast-container position="top-right"></candor-toast-container>
      <candor-button onclick="(function(el){
        var variants=['success','info','warning','error'];
        var messages=['Changes saved successfully.','Background sync complete.','Storage at 95% capacity.','Upload failed — please retry.'];
        el._n = el._n === undefined ? 0 : el._n;
        var i = el._n % 4; el._n++;
        var c = document.querySelector('candor-toast-container');
        var t = Object.assign(document.createElement('candor-toast'), { variant: variants[i], message: messages[i], dismissible: true });
        c.appendChild(t);
        var timer = setTimeout(function(){ t.remove(); }, 4000);
        t.addEventListener('dismissed', function(){ clearTimeout(timer); t.remove(); });
      })(this)">Trigger notification</candor-button>
    `,
  }),
};

export const WithHeading: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-toast variant="info" heading="Information" message="This is an informational message with a heading." dismissible></candor-toast>
        <candor-toast variant="success" heading="Success" message="Your changes have been saved successfully." dismissible></candor-toast>
        <candor-toast variant="warning" heading="Warning" message="Your session will expire in 5 minutes." dismissible></candor-toast>
        <candor-toast variant="error" heading="Error" message="Failed to save changes. Please check your connection." dismissible></candor-toast>
      </div>
    `,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
        <candor-toast variant="success" heading="File uploaded" message="Your file has been uploaded successfully." dismissible></candor-toast>
        <candor-toast variant="info" message="Read-only notice — no dismiss button. Remove this toast programmatically via setTimeout or a user action."></candor-toast>
      </div>
    `,
  }),
};
