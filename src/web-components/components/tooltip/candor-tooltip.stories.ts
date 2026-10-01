import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './candor-tooltip';
import { focusInShadow } from '../../story-utils';
import '../button/candor-button';
import '../toolbar/candor-toolbar';

import '../button/candor-button';
import '../toolbar/candor-toolbar';
import './candor-tooltip';

const meta: Meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tooltips in Candor are **intentionally invisible to assistive technology (AT)**.

The tooltip bubble carries \`aria-hidden="true"\` and is never wired via
\`aria-describedby\`. This is a deliberate design system position, not an oversight.

**The reasoning:** Tooltips solve a sighted-user problem — persistent label text isn't
always visible. AT users already receive context through the accessible name, label, and
surrounding content of the trigger element, without needing a tooltip. Wiring tooltips to
AT creates double-announcements in browse mode and makes the tooltip a crutch that masks
under-specified element names.

**The contract this creates for consumers:**

- Every trigger element must be self-describing. An icon-only button needs \`aria-label\`. A truncated label needs a full visible text alternative elsewhere.
- If the tooltip text is essential to understand the action, it belongs in the element's accessible name or a visible label — not in a tooltip.
- Use tooltips as a last resort for supplementary pointer-user context, never as the primary channel for critical information.
        `.trim(),
      },
    },
  },
  argTypes: {
    text: { control: 'text', type: { name: 'string' }, description: 'Tooltip text shown in the bubble' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      type: { name: 'string' },
      description: 'Where the bubble appears relative to the trigger element',
    },
  },
  args: { text: 'Helpful information', position: 'top' },
  render: (args) => html`
    <div style="padding:var(--spacing-2xl);display:flex;justify-content:center;">
      <candor-tooltip text="${args['text']}" position="${args['position']}">
        <candor-button variant="secondary">Hover or focus me</candor-button>
      </candor-tooltip>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

// Tooltip shown via a play function (focuses the trigger; composed focusin
// reveals the bubble) so Chromatic captures it. Excluded from the docs page
// (tags: !autodocs).
export const Visible: Story = {
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, chromatic: { pauseAnimationAtEnd: true } },
  render: () => html`
    <div style="padding:var(--spacing-2xl);display:flex;justify-content:center;">
      <candor-tooltip text="Helpful information" position="top">
        <candor-button variant="secondary">Focus me</candor-button>
      </candor-tooltip>
    </div>
  `,
  play: focusInShadow('candor-button', 'button'),
};

export const TriggerTypes: Story = {
  name: 'Trigger types',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Tooltips work on any focusable element. Three common trigger types: ' +
          'a link (tooltip adds context the visible label omits), ' +
          'a destructive button (tooltip reinforces irreversibility), ' +
          'and a text button (tooltip surfaces a keyboard shortcut — ideal tooltip content, since shortcuts do not belong in the accessible name).',
      },
    },
  },
  render: () => html`
    <div style="padding:var(--spacing-2xl);display:flex;gap:var(--spacing-lg);justify-content:center;align-items:center;flex-wrap:wrap;">
      <candor-tooltip text="Opens in a new tab" position="bottom">
        <a href="#" style="font-family:var(--font-family-base);font-size:var(--font-size-md);color:var(--color-link);">External link</a>
      </candor-tooltip>
      <candor-tooltip text="Cannot undo this action" position="top">
        <candor-button variant="destructive">Delete</candor-button>
      </candor-tooltip>
      <candor-tooltip text="Keyboard shortcut: ⌘K" position="top">
        <candor-button variant="secondary">Search</candor-button>
      </candor-tooltip>
    </div>
  `,
};

export const IconButton: Story = {
  name: 'Icon button',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Icon-only buttons always require an `aria-label` on the trigger — the tooltip bubble is `aria-hidden` and cannot substitute for it. ' +
          'The `aria-label` is the accessible name for keyboard and screen reader users; the tooltip is supplementary visual context for pointer users only.',
      },
    },
  },
  render: () => html`
    <div style="padding:var(--spacing-2xl);display:flex;gap:var(--spacing-sm);">
      <candor-tooltip text="Edit item" position="top">
        <candor-button variant="ghost" size="small" aria-label="Edit">
          <i class="ph ph-pencil-simple" aria-hidden="true"></i>
        </candor-button>
      </candor-tooltip>
      <candor-tooltip text="Duplicate" position="top">
        <candor-button variant="ghost" size="small" aria-label="Duplicate">
          <i class="ph ph-copy" aria-hidden="true"></i>
        </candor-button>
      </candor-tooltip>
      <candor-tooltip text="Delete permanently" position="top">
        <candor-button variant="destructive" size="small" aria-label="Delete permanently">
          <i class="ph ph-trash" aria-hidden="true"></i>
        </candor-button>
      </candor-tooltip>
    </div>
  `,
};

export const AllPositions: Story = {
  name: 'All positions',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'All four tooltip positions. The consumer chooses the position based on available viewport space — ' +
          'each `<candor-tooltip>` is an independent instance with no auto-flip behaviour.',
      },
    },
  },
  render: () => html`
    <div style="padding:var(--spacing-2xl);display:flex;gap:var(--spacing-lg);justify-content:center;flex-wrap:wrap;">
      <candor-tooltip text="Top tooltip" position="top"><candor-button variant="secondary">Top</candor-button></candor-tooltip>
      <candor-tooltip text="Bottom tooltip" position="bottom"><candor-button variant="secondary">Bottom</candor-button></candor-tooltip>
      <candor-tooltip text="Left tooltip" position="left"><candor-button variant="secondary">Left</candor-button></candor-tooltip>
      <candor-tooltip text="Right tooltip" position="right"><candor-button variant="secondary">Right</candor-button></candor-tooltip>
    </div>
  `,
};

// Regression coverage for #107 / #175. A hidden tooltip bubble must contribute
// nothing to layout, or its intrinsic (nowrap) width leaks into the host's
// scrollWidth and — inside candor-toolbar's overflow-x:auto row — produces stray
// scrollbars. The toolbar sits in a deliberately tight 320px column so any leak
// would surface as a scrollbar here. The `pauseAnimationAtEnd` Chromatic hint
// keeps the hidden-state snapshot stable.
export const InToolbar: Story = {
  name: 'In a toolbar (no layout leak)',
  parameters: {
    controls: { disable: true },
    chromatic: { pauseAnimationAtEnd: true },
    docs: {
      description: {
        story:
          'Wrapping toolbar controls in tooltips must not inflate the toolbar. When hidden, the ' +
          'tooltip bubble is `display:none`, so it adds nothing to the toolbar’s content width and ' +
          'never trips its `overflow-x:auto` scrollbar. This story pins the toolbar in a 320px ' +
          'container — before the #107/#175 fix, the hidden bubbles’ leaked width produced stray ' +
          'horizontal and vertical scrollbars on the toolbar here.',
      },
    },
  },
  render: () => html`
    <div style="max-width:320px;padding:var(--spacing-md);">
      <candor-toolbar aria-label="Document actions">
        <candor-tooltip text="View documents" position="bottom">
          <candor-button variant="ghost" size="small" aria-label="Documents">
            <i class="ph ph-files" aria-hidden="true"></i>
          </candor-button>
        </candor-tooltip>
        <candor-tooltip text="Open settings" position="bottom">
          <candor-button variant="ghost" size="small" aria-label="Settings">
            <i class="ph ph-gear" aria-hidden="true"></i>
          </candor-button>
        </candor-tooltip>
        <candor-tooltip text="Share with your team" position="bottom">
          <candor-button variant="ghost" size="small" aria-label="Share">
            <i class="ph ph-share-network" aria-hidden="true"></i>
          </candor-button>
        </candor-tooltip>
        <candor-tooltip text="Notification preferences" position="bottom">
          <candor-button variant="ghost" size="small" aria-label="Notifications">
            <i class="ph ph-bell" aria-hidden="true"></i>
          </candor-button>
        </candor-tooltip>
      </candor-toolbar>
    </div>
  `,
};
