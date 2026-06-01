import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-modal>\` — centered dialog that interrupts the current flow for confirmation,
detail views, or focused tasks. Implements the
[ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus is
trapped inside while open (via native \`<dialog>\`), Escape closes it, and focus returns to
the trigger on close.

**When to use a modal vs. a drawer:** Modals are for short, decisive interactions — confirm
delete, enter a PIN, view a summary. Drawers are for richer tasks that benefit from a side
panel without fully leaving the current page.

\`\`\`html
<candor-modal heading="Confirm deletion" id="m">
  <p>This cannot be undone.</p>
  <div slot="footer">
    <candor-button variant="ghost" onclick="m.open = false">Cancel</candor-button>
    <candor-button variant="destructive">Delete</candor-button>
  </div>
</candor-modal>
\`\`\`

Emits a \`closed\` CustomEvent when dismissed. Backdrop uses \`backdrop-filter: blur(2px)\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Controls visibility' },
    heading: { control: 'text', type: { name: 'string' }, description: 'Dialog title' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      type: { name: 'string' },
      description: 'Panel max-width (400 / 560 / 768px)',
    },
  },
  args: { open: false, heading: 'Confirm action', size: 'md' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('demo-modal').open = true">Open modal</candor-button>
      <candor-modal id="demo-modal" heading="${args['heading']}" size="${args['size']}" ${args['open'] ? 'open' : ''}>
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
  parameters: {
    docs: {
      description: {
        story: 'Long content overflows the body — the panel caps at 90 vh and the body region scrolls independently. Header and footer stay fixed.',
      },
    },
  },
  args: { heading: 'Terms and conditions', size: 'lg' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('modal-lg').open = true">Open large modal</candor-button>
      <candor-modal id="modal-lg" heading="${args['heading']}" size="lg">
        <p style="margin-bottom:var(--spacing-sm)">By using Candor Design System, you agree to the following terms and conditions. Please read carefully before accepting.</p>
        <p style="margin-bottom:var(--spacing-sm)">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p style="margin-bottom:var(--spacing-sm)">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p style="margin-bottom:var(--spacing-sm)">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <p style="margin-bottom:var(--spacing-sm)">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
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
        <dl style="display:grid;grid-template-columns:auto 1fr;gap:var(--spacing-xs) var(--spacing-md);margin:0;">
          <dt style="font-weight:var(--font-weight-semibold);">⌘ K</dt><dd>Open command palette</dd>
          <dt style="font-weight:var(--font-weight-semibold);">⌘ /</dt><dd>Toggle comment</dd>
          <dt style="font-weight:var(--font-weight-semibold);">⌘ Z</dt><dd>Undo</dd>
          <dt style="font-weight:var(--font-weight-semibold);">⌘ ⇧ Z</dt><dd>Redo</dd>
        </dl>
      </candor-modal>
    `,
  }),
};
