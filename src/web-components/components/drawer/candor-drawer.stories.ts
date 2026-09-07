import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../button/candor-button';
import '../form/input/candor-input';
import '../form/select/candor-select';
import '../typography/heading/candor-heading';
import '../typography/text/candor-text';
import './candor-drawer';

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

**Modal vs. non-modal:** The \`modal\` attribute (default \`true\`) controls whether the
drawer blocks the rest of the page.

| Mode | Opens via | Backdrop | Focus | Rest of page | Use for |
|---|---|---|---|---|---|
| \`modal="true"\` (default) | \`dialog.showModal()\` | Yes, dims via \`--color-overlay\` | Trapped, auto-focused | Inert | Blocking tasks — filters that must be applied/cancelled, forms, confirmations |
| \`modal="false"\` | \`dialog.show()\` | None | Not stolen, not trapped | Fully interactive | Persistent assistants, inspectors, or filters the user works **alongside** — read and select page content while the panel stays open |

In non-modal mode the drawer relies on its close button or a consumer-supplied
control to dismiss — clicking outside does not close it (there's no backdrop to click).

**Dismissal:** The drawer emits a \`close\` CustomEvent on Escape, backdrop click (when
\`dismissOnBackdrop\` is true, modal mode only), and the built-in close button. The parent
is responsible for syncing \`open="false"\` (or removing the open attribute) in response.

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
    modal: {
      control: 'boolean',
      type: { name: 'boolean' },
      description: 'Modal (blocking, focus-trapped) vs. non-modal (page stays interactive)',
    },
  },
  args: { heading: 'Settings', position: 'right', size: 'md' },
  render: (args) => html`
    <candor-button onclick="document.getElementById('demo-drawer').open = true">Open drawer</candor-button>
    <candor-drawer id="demo-drawer" heading="${args['heading']}" position="${args['position']}" size="${args['size']}">
      <p style="margin:0">Drawer content goes here.</p>
    </candor-drawer>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

// Open at snapshot time so Chromatic covers the slide-in panel. Excluded from
// the docs page (tags: !autodocs) — a top-layer drawer would otherwise overlay it.
export const Open: Story = {
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, chromatic: { pauseAnimationAtEnd: true } },
  render: () => html`
    <candor-drawer heading="Settings" position="right" size="md" open>
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);">
        <p style="margin:0">Drawer content goes here — filters, inspector details, or a contextual panel.</p>
        <candor-button variant="secondary">An action</candor-button>
      </div>
    </candor-drawer>
  `,
};

export const BottomSheet: Story = {
  name: 'Position: Bottom',
  render: () => html`
    <candor-button onclick="document.getElementById('drawer-bottom').open = true">Open bottom sheet</candor-button>
    <candor-drawer id="drawer-bottom" heading="Actions" position="bottom" size="sm">
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <candor-button variant="secondary">Share</candor-button>
        <candor-button variant="secondary">Duplicate</candor-button>
        <candor-button variant="destructive">Delete</candor-button>
      </div>
    </candor-drawer>
  `,
};

export const WithFooter: Story = {
  name: 'With footer slot',
  render: () => html`
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
};

export const NonModal: Story = {
  name: 'Non-modal (work alongside)',
  tags: ['!autodocs'],
  parameters: {
    controls: { disable: true },
    chromatic: { pauseAnimationAtEnd: true },
    docs: {
      description: {
        story: `
Set \`modal="false"\` for a side panel the user works **alongside** rather than one
that blocks the page. It opens via \`dialog.show()\` instead of \`showModal()\`: no
backdrop, no focus trap, and the rest of the page stays fully interactive — the
\`<candor-text>\` to the left of the panel remains selectable and readable while the
panel is open.

Use \`modal="true"\` (the default) for blocking tasks — a filter that must be applied
or cancelled, a form, a confirmation. Use \`modal="false"\` for persistent companions —
an AI assistant panel, an inspector, or filters that refine a view in place without
interrupting it.
        `.trim(),
      },
    },
  },
  render: () => html`
    <div style="display:flex;min-height:400px;">
      <div style="flex:1;min-width:0;padding:var(--spacing-md);">
        <candor-heading level="h3">Page content</candor-heading>
        <candor-text variant="body" size="md" style="margin-top:var(--spacing-sm);">
          This paragraph stays fully readable and selectable while the non-modal drawer
          is open — try selecting this text or clicking the button below. A modal drawer
          would trap focus and dim this content; a non-modal drawer does neither.
        </candor-text>
        <candor-button variant="secondary" style="margin-top:var(--spacing-md);">Still clickable</candor-button>
      </div>
      <candor-drawer heading="Assistant" position="right" size="sm" modal="false" open>
        <p style="margin:0">This panel coexists with the page instead of blocking it — suited to a persistent AI assistant, inspector, or filter panel you work alongside.</p>
      </candor-drawer>
    </div>
  `,
};

export const NoDismissOnBackdrop: Story = {
  name: 'dismiss-on-backdrop: false',
  render: () => html`
    <candor-button onclick="document.getElementById('drawer-nodismiss').open = true">Open drawer</candor-button>
    <candor-drawer id="drawer-nodismiss" heading="Required action" dismiss-on-backdrop="false">
      <p style="margin:0">Clicking outside this drawer does nothing. Use the close button or Escape to dismiss.</p>
      <p style="margin-top:1rem;color:var(--color-text-subtle);font-size:var(--font-size-sm);">Use <code>dismiss-on-backdrop="false"</code> for flows where an accidental dismiss would lose unsaved work.</p>
    </candor-drawer>
  `,
};

export const LargeDrawer: Story = {
  name: 'Size: Large',
  render: () => html`
    <candor-button onclick="document.getElementById('drawer-lg').open = true">Open large drawer</candor-button>
    <candor-drawer id="drawer-lg" heading="Document preview" size="lg">
      <p style="margin:0">Large drawers (640px) are suited to document previews, detail views, or any panel that needs more horizontal reading space.</p>
    </candor-drawer>
  `,
};
