import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../button/button.component';
import { ModalComponent } from './modal.component';

const meta: Meta<ModalComponent> = {
  title: 'Components/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [ButtonComponent] }),
  ],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 420,
      },
      description: {
        component: `
Centered dialog that interrupts the current flow for confirmation, detail views, or focused tasks.
Implements the [ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):
focus is trapped inside while open, Escape closes it, and focus returns to the trigger on close.

**When to use a modal vs. a drawer:** Modals are for short, decisive interactions — confirm
delete, enter a PIN, view a summary. Drawers are for richer tasks that benefit from a side
panel without fully leaving the current page.

\`\`\`html
<!-- Don't put <header> or <footer> inside — they inherit landmark roles in Chrome -->
<app-modal heading="Confirm deletion" [open]="open" (close)="open = false">
  <p>This cannot be undone.</p>
  <app-button slot="footer" variant="destructive">Delete</app-button>
</app-modal>
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    open: { control: 'boolean' },
    heading: { control: 'text' },
    closed: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

// ─── Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    open: true,
    heading: 'Dialog title',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-modal [open]="open" [heading]="heading" [size]="size" (closed)="open = false; closed()">
        <p>This is the modal body. Place any content here — forms, details, confirmations.</p>
        <div slot="footer" class="modal__footer">
          <app-button variant="tertiary" (clicked)="open = false">Cancel</app-button>
          <app-button variant="primary">Confirm</app-button>
        </div>
      </app-modal>
    `,
  }),
};

// ─── Sizes ─────────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { open: true, heading: 'Delete item', size: 'sm' },
  render: (args) => ({
    props: args,
    template: `
      <app-modal [open]="open" [heading]="heading" [size]="size" (closed)="open = false">
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div slot="footer" class="modal__footer">
          <app-button variant="tertiary" (clicked)="open = false">Cancel</app-button>
          <app-button variant="secondary">Delete</app-button>
        </div>
      </app-modal>
    `,
  }),
};

export const Large: Story = {
  args: { open: true, heading: 'Terms and conditions', size: 'lg' },
  render: (args) => ({
    props: args,
    template: `
      <app-modal [open]="open" [heading]="heading" [size]="size" (closed)="open = false">
        <p style="margin-bottom: 1rem">By using Candor Design System, you agree to the following terms and conditions.</p>
        <p style="margin-bottom: 1rem">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p style="margin-bottom: 1rem">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <div slot="footer" class="modal__footer">
          <app-button variant="tertiary" (clicked)="open = false">Decline</app-button>
          <app-button variant="primary">Accept</app-button>
        </div>
      </app-modal>
    `,
  }),
};

// ─── With trigger ──────────────────────────────────────────────────────────

export const WithTrigger: Story = {
  args: { open: false, heading: 'Edit profile', size: 'md' },
  render: (args) => ({
    props: { ...args, isOpen: false },
    template: `
      <app-button variant="primary" (clicked)="isOpen = true">Open modal</app-button>

      <app-modal [open]="isOpen" [heading]="heading" [size]="size" (closed)="isOpen = false">
        <p>Modal opened via trigger button. Close with the × button, Escape key, or clicking outside.</p>
        <div slot="footer" class="modal__footer">
          <app-button variant="tertiary" (clicked)="isOpen = false">Cancel</app-button>
          <app-button variant="primary" (clicked)="isOpen = false">Save</app-button>
        </div>
      </app-modal>
    `,
  }),
};

// ─── No footer ─────────────────────────────────────────────────────────────

export const NoFooter: Story = {
  args: { open: true, heading: 'Keyboard shortcuts', size: 'md' },
  render: (args) => ({
    props: args,
    template: `
      <app-modal [open]="open" [heading]="heading" [size]="size" (closed)="open = false">
        <dl style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1.5rem;">
          <dt style="font-weight: 600;">⌘ K</dt><dd>Open command palette</dd>
          <dt style="font-weight: 600;">⌘ /</dt><dd>Toggle comment</dd>
          <dt style="font-weight: 600;">⌘ Z</dt><dd>Undo</dd>
          <dt style="font-weight: 600;">⌘ ⇧ Z</dt><dd>Redo</dd>
        </dl>
      </app-modal>
    `,
  }),
};
