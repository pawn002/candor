import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ToastComponent } from './toast.component';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-service-demo',
  standalone: true,
  imports: [ToastContainerComponent],
  template: `
    <div style="min-height: 200px; display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
      <button class="btn btn-primary btn-sm" (click)="showInfo()">Show info</button>
      <button class="btn btn-secondary btn-sm" (click)="showSuccess()">Show success</button>
      <button class="btn btn-tertiary btn-sm" (click)="showWarning()">Show warning</button>
      <button class="btn btn-ghost btn-sm" (click)="showError()">Show error</button>
      <button class="btn btn-ghost btn-sm" (click)="showPersistent()">Show persistent (no auto-dismiss)</button>
    </div>
    <app-toast-container></app-toast-container>
  `,
})
class ToastServiceDemoComponent {
  private toasts = inject(ToastService);
  showInfo()       { this.toasts.show('File saved to your account.', 'info'); }
  showSuccess()    { this.toasts.show('Changes published successfully.', 'success', { heading: 'Published' }); }
  showWarning()    { this.toasts.show('Your session expires in 5 minutes.', 'warning'); }
  showError()      { this.toasts.show('Failed to connect. Check your network.', 'error', { heading: 'Connection error' }); }
  showPersistent() { this.toasts.show('This toast stays until dismissed.', 'info', { duration: 0 }); }
}

const meta: Meta<ToastComponent> = {
  title: 'Components/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Ephemeral notification that floats over content and auto-dismisses. Use for transient feedback
that doesn't require acknowledgement — file saved, action completed, background task finished.

**Toast vs. Alert:** Toasts are for events the user triggered but doesn't need to act on.
Alerts are for persistent conditions the user must read — validation errors, system warnings,
confirmation requirements.

Toasts are driven by \`ToastService\`, not placed in templates directly. See the
**Service-driven** story for the recommended usage pattern.

\`\`\`typescript
toastService.show({ variant: 'success', heading: 'Saved', message: 'Your changes have been saved.' });
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Toast color variant',
    },
    heading: {
      control: 'text',
      description: 'Optional heading',
    },
    message: {
      control: 'text',
      description: 'Toast message text',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show dismiss button',
    },
  },
};

export default meta;
type Story = StoryObj<ToastComponent>;

export const Default: Story = {
  args: {
    variant: 'info',
    message: 'This is an informational message.',
    dismissible: false,
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 32rem;"><app-toast [variant]="variant" [message]="message" [heading]="heading" [dismissible]="dismissible"></app-toast></div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 32rem;">
        <app-toast variant="info" message="This is an informational message."></app-toast>
        <app-toast variant="success" message="Operation completed successfully."></app-toast>
        <app-toast variant="warning" message="Please review before continuing."></app-toast>
        <app-toast variant="error" message="Something went wrong. Please try again."></app-toast>
      </div>
    `,
  }),
};

export const WithHeading: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 32rem;">
        <app-toast variant="info" heading="Information" message="This is an informational message with a heading."></app-toast>
        <app-toast variant="success" heading="Success" message="Your changes have been saved successfully."></app-toast>
        <app-toast variant="warning" heading="Warning" message="Your session will expire in 5 minutes."></app-toast>
        <app-toast variant="error" heading="Error" message="Failed to save changes. Please check your connection."></app-toast>
      </div>
    `,
  }),
};

export const WithService: StoryObj = {
  name: 'With ToastService (imperative)',
  decorators: [moduleMetadata({ imports: [ToastServiceDemoComponent] })],
  render: () => ({
    template: `<app-toast-service-demo></app-toast-service-demo>`,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    props: {
      onDismiss: () => console.log('Toast dismissed!'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 32rem;">
        <app-toast
          variant="success"
          heading="File uploaded"
          message="Your file has been uploaded successfully."
          [dismissible]="true"
          (dismissed)="onDismiss()"
        ></app-toast>
        <app-toast
          variant="error"
          heading="Upload failed"
          message="The file could not be uploaded. Please try again."
          [dismissible]="true"
          (dismissed)="onDismiss()"
        ></app-toast>
      </div>
    `,
  }),
};
