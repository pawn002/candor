import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { clickInShadow } from '../../story-utils';

const DEMO_ENTRIES = JSON.stringify([
  { label: 'Edit' },
  { label: 'Duplicate' },
  'separator',
  { label: 'Share' },
  'separator',
  { label: 'Delete' },
]);

const ACTION_ENTRIES = JSON.stringify([
  { label: 'View details' },
  { label: 'Edit record' },
  { label: 'Export as CSV' },
  'separator',
  { label: 'Delete record' },
]);

const SORT_ENTRIES = JSON.stringify([
  { label: 'Name A–Z', checked: false },
  { label: 'Name Z–A', checked: true },
  { label: 'Date modified', checked: false },
  { label: 'Date created', checked: false },
]);

const FILE_ENTRIES_DISABLED = JSON.stringify([
  { label: 'New file' },
  { label: 'Open...' },
  { label: 'Open recent', disabled: true },
  'separator',
  { label: 'Save' },
  { label: 'Save as...' },
  'separator',
  { label: 'Print', disabled: true },
]);

const TOOLBAR_FILE = JSON.stringify([{ label: 'New' }, { label: 'Open...' }, 'separator', { label: 'Save' }]);
const TOOLBAR_EDIT = JSON.stringify([{ label: 'Undo' }, { label: 'Redo', disabled: true }, 'separator', { label: 'Cut' }, { label: 'Copy' }, { label: 'Paste' }]);
const TOOLBAR_VIEW = JSON.stringify([{ label: 'Zoom in' }, { label: 'Zoom out' }, { label: 'Reset zoom' }]);

const meta: Meta = {
  title: 'Components/Menu',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-menu>\` — dropdown list of actions triggered by a button. Implements the
[ARIA Menu Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/):
Arrow keys navigate items, Enter/Space activate, Escape closes and returns focus.

Use a menu when a single button would otherwise need 3+ secondary actions alongside it.
If you have 1–2 secondary actions, use separate \`<candor-button>\` elements instead.

Supports separators between logical groups (\`'separator'\` entry — rendered with
\`role="separator"\` so screen readers hear a grouping break) and disabled states on
individual items (\`{ label, disabled: true }\`). The trigger label becomes the accessible
name for the menu button — make it descriptive, not just "More" or "Options".

**Icon-only trigger:** omit \`label\` and set \`aria-label\` on the host element — the
component strips the attribute from the host and forwards it to the inner trigger button,
so screen readers announce it exactly once. The trigger renders a three-dot icon instead
of text + chevron.

**Checked items (\`role="menuitemradio"\`):** add \`checked: true | false\` to any entry to
switch all items to \`menuitemradio\` role with \`aria-checked\`. A checkmark appears
beside the selected item; a fixed-width spacer keeps text aligned across all items.
Use this for sort/view options where exactly one item is active at a time.

**Panel alignment:** \`align="right"\` anchors the panel to the right edge of the trigger —
use this when the trigger is near the right edge of the viewport to prevent overflow.

Pass \`entries\` as a JSON-encoded \`entries\` attribute (\`entries='${'$'}{JSON.stringify(...)}'\`)
or as the JS \`entries\` property. Emits a \`selected\` CustomEvent with the chosen entry.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Trigger button label. Omit for icon-only trigger (supply aria-label instead).' },
    align: { control: 'radio', options: ['left', 'right'], description: 'Panel alignment relative to trigger' },
  },
  render: () => html`<candor-menu label="Actions" entries='${DEMO_ENTRIES}'></candor-menu>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

// Opened via a play function (clicks the trigger) so Chromatic captures the
// dropdown panel. Excluded from the docs page (tags: !autodocs).
export const Open: Story = {
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, chromatic: { pauseAnimationAtEnd: true } },
  render: () => html`<candor-menu label="Actions" entries='${DEMO_ENTRIES}'></candor-menu>`,
  play: clickInShadow('candor-menu', '.menu-trigger'),
};

export const MoreActions: Story = {
  name: 'Icon trigger (More actions)',
  parameters: {
    docs: {
      description: {
        story: 'When the trigger sits inside a table row, card, or data grid cell, a labelled ' +
          'text button is too wide — use an icon-only trigger instead. Omit `label` and set ' +
          '`aria-label` on the host: the component strips the attribute from the host and ' +
          'forwards it to the inner `<button>` so screen readers hear the name exactly once.',
      },
    },
  },
  render: () => html`
    <div style="display:flex;align-items:center;gap:var(--spacing-md);font-family:var(--font-family-base);font-size:var(--font-size-md);">
      <span style="color:var(--color-text-default);">Project Alpha</span>
      <candor-menu aria-label="More actions for Project Alpha" entries='${ACTION_ENTRIES}'></candor-menu>
    </div>
  `,
};

export const ShortList: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When entries carry a `checked` property, the component switches to ' +
          '`role="menuitemradio"` with `aria-checked` on every item. A checkmark ' +
          'appears beside the active item; a fixed-width spacer keeps text aligned ' +
          'across all items. The `selected` event still fires on activation — update ' +
          '`checked` in the entries array to reflect the new selection.',
      },
    },
  },
  render: () => html`<candor-menu label="Sort by" entries='${SORT_ENTRIES}'></candor-menu>`,
};

export const WithDisabledItems: Story = {
  render: () => html`<candor-menu label="File" entries='${FILE_ENTRIES_DISABLED}'></candor-menu>`,
};

export const InToolbar: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The rightmost menu uses `align="right"` so its panel anchors to the ' +
          'right edge of the trigger instead of the left — preventing overflow when ' +
          'the trigger is near the viewport edge.',
      },
    },
  },
  render: () => html`
    <div style="display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);background:var(--color-bg-surface);border-radius:var(--radius-md);border:var(--border-width-thin) solid var(--color-border-default);">
      <candor-menu label="File" entries='${TOOLBAR_FILE}'></candor-menu>
      <candor-menu label="Edit" entries='${TOOLBAR_EDIT}'></candor-menu>
      <candor-menu label="View" align="right" entries='${TOOLBAR_VIEW}'></candor-menu>
    </div>
  `,
};
