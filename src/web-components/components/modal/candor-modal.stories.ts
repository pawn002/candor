import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Modal',
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { heading: 'Confirm action', size: 'md' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('demo-modal').open = true">Open modal</candor-button>
      <candor-modal id="demo-modal" heading="${args['heading']}" size="${args['size']}">
        <p style="margin:0">Are you sure you want to proceed? This action cannot be undone.</p>
        <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <candor-button variant="secondary" onclick="document.getElementById('demo-modal').open = false">Cancel</candor-button>
          <candor-button onclick="document.getElementById('demo-modal').open = false">Confirm</candor-button>
        </div>
      </candor-modal>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Small: Story = {
  args: { heading: 'Delete item', size: 'sm' },
  render: (args) => ({
    template: `
      <candor-button variant="secondary" onclick="document.getElementById('modal-sm').open = true">Open small modal</candor-button>
      <candor-modal id="modal-sm" heading="${args['heading']}" size="sm">
        <p style="margin:0">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <candor-button variant="tertiary" onclick="document.getElementById('modal-sm').open = false">Cancel</candor-button>
          <candor-button variant="destructive" onclick="document.getElementById('modal-sm').open = false">Delete</candor-button>
        </div>
      </candor-modal>
    `,
  }),
};

export const Large: Story = {
  args: { heading: 'Terms and conditions', size: 'lg' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('modal-lg').open = true">Open large modal</candor-button>
      <candor-modal id="modal-lg" heading="${args['heading']}" size="lg">
        <p style="margin-bottom:1rem">By using Candor Design System, you agree to the following terms and conditions.</p>
        <p style="margin-bottom:1rem">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <candor-button variant="tertiary" onclick="document.getElementById('modal-lg').open = false">Decline</candor-button>
          <candor-button onclick="document.getElementById('modal-lg').open = false">Accept</candor-button>
        </div>
      </candor-modal>
    `,
  }),
};

export const NoFooter: Story = {
  args: { heading: 'Keyboard shortcuts', size: 'md' },
  render: (args) => ({
    template: `
      <candor-button variant="tertiary" onclick="document.getElementById('modal-nf').open = true">Open keyboard shortcuts</candor-button>
      <candor-modal id="modal-nf" heading="${args['heading']}" size="md">
        <dl style="display:grid;grid-template-columns:auto 1fr;gap:0.5rem 1.5rem;margin:0;">
          <dt style="font-weight:600;">⌘ K</dt><dd>Open command palette</dd>
          <dt style="font-weight:600;">⌘ /</dt><dd>Toggle comment</dd>
          <dt style="font-weight:600;">⌘ Z</dt><dd>Undo</dd>
          <dt style="font-weight:600;">⌘ ⇧ Z</dt><dd>Redo</dd>
        </dl>
      </candor-modal>
    `,
  }),
};
