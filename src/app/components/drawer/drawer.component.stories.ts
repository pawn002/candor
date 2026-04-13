import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DrawerComponent } from './drawer.component';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<DrawerComponent> = {
  title: 'Components/Drawer',
  component: DrawerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [DrawerComponent, ButtonComponent] })],
  parameters: {
    docs: {
      description: {
        component: `
Drawer renders a slide-in panel anchored to a viewport edge. Uses \`<dialog>\` for native focus trapping and Escape key handling.

**Drawer vs. Vertical Tabs**

| Use | When |
|---|---|
| \`app-drawer\` | The panel **overlays** content without navigating away — filters, inspector details, contextual toolbars. |
| \`app-tabs orientation="vertical"\` | The panel **replaces** content — settings categories, sidebar nav where the left list selects the main content. |

**Dismissal:** The drawer emits \`(closed)\` on Escape, backdrop click (when \`dismissOnBackdrop\` is true), and the built-in close button. The parent is responsible for setting \`[open]="false"\` in response.
        `.trim(),
      },
    },
  },
  argTypes: {
    open: { control: 'boolean', description: 'Controls visibility' },
    heading: { control: 'text', description: 'Panel heading. Omit for headless panels.' },
    position: {
      control: 'select',
      options: ['right', 'left', 'bottom'],
      description: 'Edge the drawer slides in from',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Panel width (left/right) or height (bottom)',
    },
    dismissOnBackdrop: {
      control: 'boolean',
      description: 'Click outside the panel to close',
    },
  },
};

export default meta;
type Story = StoryObj<DrawerComponent>;

export const Default: Story = {
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open drawer</app-button>
      <app-drawer
        [open]="isOpen"
        heading="Drawer"
        (closed)="isOpen = false"
      >
        <p>Drawer body content. Focus is trapped inside while the drawer is open.</p>
        <p>Press <kbd>Escape</kbd> or click the backdrop to dismiss.</p>
      </app-drawer>
    `,
  }),
};

export const RightDrawer: Story = {
  name: 'Position: Right (default)',
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open right drawer</app-button>
      <app-drawer [open]="isOpen" heading="Right panel" position="right" (closed)="isOpen = false">
        <p>Slides in from the right edge. Default position.</p>
      </app-drawer>
    `,
  }),
};

export const LeftDrawer: Story = {
  name: 'Position: Left',
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open left drawer</app-button>
      <app-drawer [open]="isOpen" heading="Left panel" position="left" (closed)="isOpen = false">
        <p>Slides in from the left edge. Suited to sidebar navigation overlays.</p>
      </app-drawer>
    `,
  }),
};

export const BottomSheet: Story = {
  name: 'Position: Bottom',
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open bottom sheet</app-button>
      <app-drawer [open]="isOpen" heading="Actions" position="bottom" size="sm" (closed)="isOpen = false">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <app-button variant="secondary">Share</app-button>
          <app-button variant="secondary">Duplicate</app-button>
          <app-button variant="destructive">Delete</app-button>
        </div>
      </app-drawer>
    `,
  }),
};

export const WithFooter: Story = {
  name: 'With footer slot',
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open drawer</app-button>
      <app-drawer [open]="isOpen" heading="Edit filter" (closed)="isOpen = false">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <label style="display: flex; flex-direction: column; gap: 0.25rem; font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: 0.02em;">
            Status
            <select style="padding: 0.5rem; border: 1px solid var(--color-border-default); border-radius: var(--radius-sm);">
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
          </label>
          <label style="display: flex; flex-direction: column; gap: 0.25rem; font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: 0.02em;">
            Date range
            <input type="date" style="padding: 0.5rem; border: 1px solid var(--color-border-default); border-radius: var(--radius-sm);">
          </label>
        </div>
        <div slot="footer" class="drawer__footer">
          <app-button variant="ghost" (click)="isOpen = false">Cancel</app-button>
          <app-button variant="primary" (click)="isOpen = false">Apply filters</app-button>
        </div>
      </app-drawer>
    `,
  }),
};

export const NoDismissOnBackdrop: Story = {
  name: 'dismissOnBackdrop: false',
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open drawer</app-button>
      <app-drawer
        [open]="isOpen"
        heading="Required action"
        [dismissOnBackdrop]="false"
        (closed)="isOpen = false"
      >
        <p>Clicking outside this drawer does nothing. Use the close button or Escape to dismiss.</p>
        <p style="margin-top: 1rem; color: var(--color-text-subtle); font-size: var(--font-size-sm);">
          Use <code>dismissOnBackdrop="false"</code> for flows where an accidental dismiss
          would lose unsaved work.
        </p>
      </app-drawer>
    `,
  }),
};

export const LargeDrawer: Story = {
  name: 'Size: lg',
  render: () => ({
    props: { isOpen: false },
    template: `
      <app-button variant="primary" (click)="isOpen = true">Open large drawer</app-button>
      <app-drawer [open]="isOpen" heading="Document preview" size="lg" (closed)="isOpen = false">
        <p>Large drawers (640px) are suited to document previews, detail views, or any panel
           that needs more horizontal reading space.</p>
      </app-drawer>
    `,
  }),
};
