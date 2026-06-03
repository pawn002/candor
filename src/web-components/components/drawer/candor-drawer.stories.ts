import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-drawer>\` renders a slide-in panel anchored to a viewport edge. Uses \`<dialog>\`
for native focus trapping and Escape key handling.

**Drawer vs. Vertical Tabs**

| Use | When |
|---|---|
| \`candor-drawer\` | The panel **overlays** content without navigating away — filters, inspector details, contextual toolbars. |
| \`candor-tabs orientation="vertical"\` | The panel **replaces** content — settings categories, sidebar nav where the left list selects the main content. |

**Dismissal:** The drawer emits a \`closed\` CustomEvent on Escape, backdrop click (when
\`dismissOnBackdrop\` is true), and the built-in close button. The parent is responsible
for syncing \`open="false"\` (or removing the open attribute) in response.

Entry animation uses \`@starting-style\` (Chrome 117+, Firefox 129+); degrades gracefully
to instant appearance on unsupported browsers. Honors \`prefers-reduced-motion\`.

**Sizing:** The \`size\` attribute sets the default panel width (left/right) or height
(bottom). Override per-instance using CSS custom properties:

| Property | Default | Controls |
|---|---|---|
| \`--candor-drawer-size\` | \`480px\` (md) | Panel width — left/right positions |
| \`--candor-drawer-height\` | \`50vh\` (md) | Panel height — bottom position |

\`\`\`css
candor-drawer#filters-panel { --candor-drawer-size: 400px; }
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    open: { control: 'boolean', type: { name: 'boolean' }, description: 'Controls visibility' },
    heading: { control: 'text', type: { name: 'string' }, description: 'Panel heading. Omit for headless panels.' },
    position: {
      control: 'select',
      options: ['right', 'left', 'bottom'],
      type: { name: 'string' },
      description: 'Edge the drawer slides in from',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      type: { name: 'string' },
      description: 'Panel width (left/right) or height (bottom)',
    },
    dismissOnBackdrop: {
      control: 'boolean',
      type: { name: 'boolean' },
      description: 'Click outside the panel to close',
    },
  },
  args: { heading: 'Settings', position: 'right', size: 'md' },
  render: (args) => ({
    template: `
      <candor-button onclick="document.getElementById('demo-drawer').open = true">Open drawer</candor-button>
      <candor-drawer id="demo-drawer" heading="${args['heading']}" position="${args['position']}" size="${args['size']}">
        <p style="margin:0">Drawer content goes here.</p>
      </candor-drawer>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const BottomSheet: Story = {
  name: 'Position: Bottom',
  render: () => ({
    template: `
      <candor-button onclick="document.getElementById('drawer-bottom').open = true">Open bottom sheet</candor-button>
      <candor-drawer id="drawer-bottom" heading="Actions" position="bottom" size="sm">
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <candor-button variant="secondary">Share</candor-button>
          <candor-button variant="secondary">Duplicate</candor-button>
          <candor-button variant="destructive">Delete</candor-button>
        </div>
      </candor-drawer>
    `,
  }),
};

export const WithFooter: Story = {
  name: 'With footer slot',
  render: () => ({
    template: `
      <candor-button onclick="document.getElementById('drawer-footer').open = true">Open drawer</candor-button>
      <candor-drawer id="drawer-footer" heading="Edit filter">
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <candor-select label="Status" options='[{"value":"active","label":"Active"},{"value":"inactive","label":"Inactive"},{"value":"pending","label":"Pending"}]'></candor-select>
          <candor-input label="Date range" placeholder="YYYY-MM-DD"></candor-input>
        </div>
        <div slot="footer" style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <candor-button variant="ghost" onclick="document.getElementById('drawer-footer').open = false">Cancel</candor-button>
          <candor-button onclick="document.getElementById('drawer-footer').open = false">Apply filters</candor-button>
        </div>
      </candor-drawer>
    `,
  }),
};

export const NoDismissOnBackdrop: Story = {
  name: 'dismiss-on-backdrop: false',
  render: () => ({
    template: `
      <candor-button onclick="document.getElementById('drawer-nodismiss').open = true">Open drawer</candor-button>
      <candor-drawer id="drawer-nodismiss" heading="Required action" dismiss-on-backdrop="false">
        <p style="margin:0">Clicking outside this drawer does nothing. Use the close button or Escape to dismiss.</p>
        <p style="margin-top:1rem;color:var(--color-text-subtle);font-size:var(--font-size-sm);">Use <code>dismiss-on-backdrop="false"</code> for flows where an accidental dismiss would lose unsaved work.</p>
      </candor-drawer>
    `,
  }),
};

export const LargeDrawer: Story = {
  name: 'Size: Large',
  render: () => ({
    template: `
      <candor-button onclick="document.getElementById('drawer-lg').open = true">Open large drawer</candor-button>
      <candor-drawer id="drawer-lg" heading="Document preview" size="lg">
        <p style="margin:0">Large drawers (640px) are suited to document previews, detail views, or any panel that needs more horizontal reading space.</p>
      </candor-drawer>
    `,
  }),
};
