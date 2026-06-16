import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

// Full-width rule separating showcase scenarios (replaces grouping cards,
// which crowded content at mobile widths).
const divider = html`<hr style="border: none; border-top: var(--border-width-thin) solid var(--color-border-default); margin: 0; width: 100%;" />`;

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
  render: (args) => html`<candor-alert variant="${args['variant']}" heading="${args['heading']}" message="${args['message']}" ?dismissible=${args['dismissible']}></candor-alert>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:560px;padding:var(--spacing-md);">
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Info</p>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
          <candor-alert variant="info" message="Your session will expire in 10 minutes."></candor-alert>
          <candor-alert variant="info" heading="Scheduled maintenance" message="The system will be unavailable on Sunday from 02:00–04:00 UTC."></candor-alert>
        </div>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Success</p>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
          <candor-alert variant="success" message="Changes saved."></candor-alert>
          <candor-alert variant="success" heading="Payment received" message="Your invoice has been paid and a receipt has been sent."></candor-alert>
        </div>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Warning</p>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
          <candor-alert variant="warning" message="This action cannot be undone."></candor-alert>
          <candor-alert variant="warning" heading="Storage limit approaching" message="You have used 90% of your allocated storage quota."></candor-alert>
        </div>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Error</p>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
          <candor-alert variant="error" message="Something went wrong. Please try again."></candor-alert>
          <candor-alert variant="error" heading="Authentication failed" message="Your session has expired. Please sign in again."></candor-alert>
        </div>
      </div>
    </div>
  `,
};

export const Dismissible: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-lg);max-width:560px;padding:var(--spacing-md);">
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Info</p>
        <candor-alert variant="info" heading="New feature available" message="You can now export your data as CSV from the settings page." dismissible></candor-alert>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Warning</p>
        <candor-alert variant="warning" heading="Unsaved changes" message="You have unsaved changes that will be lost if you navigate away." dismissible></candor-alert>
      </div>
      ${divider}
      <div>
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Error</p>
        <candor-alert variant="error" heading="Subscription expired" message="Your plan has expired. Renew to restore access to all features." dismissible></candor-alert>
      </div>
    </div>
  `,
};

export const InlineFormValidation: Story = {
  render: () => html`
    <div style="padding:var(--spacing-md);max-width:480px;">
      <candor-card variant="outlined">
        <p style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);color:var(--color-text-subtle);margin:0 0 var(--spacing-sm);">Error — invalid input</p>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);">
          <div>
            <label for="story-email" style="display:block;font-family:var(--font-family-accessible);font-size:var(--font-size-sm);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;color:var(--color-text-subtle);margin-bottom:0.5rem;">Email address</label>
            <input id="story-email" type="email" value="notanemail" style="display:block;width:100%;padding:var(--spacing-sm);border:2px solid var(--color-status-error);border-radius:var(--radius-md);font-family:var(--font-family-accessible);font-size:var(--font-size-md);background:var(--color-bg-page);color:var(--color-text-default);box-sizing:border-box;" aria-describedby="email-error" aria-invalid="true" />
          </div>
          <candor-alert id="email-error" variant="error" message="Enter a valid email address, for example name@example.com."></candor-alert>
        </div>
      </candor-card>
    </div>
  `,
};
