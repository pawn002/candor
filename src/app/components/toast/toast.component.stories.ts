import type { Meta, StoryObj } from '@storybook/angular';
import { ToastComponent } from './toast.component';

const meta: Meta<ToastComponent> = {
  title: 'Components/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
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
