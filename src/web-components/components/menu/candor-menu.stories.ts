import type { Meta, StoryObj } from '@storybook/angular';

const DEMO_ENTRIES = JSON.stringify([
  { label: 'Edit' },
  { label: 'Duplicate' },
  'separator',
  { label: 'Share' },
  'separator',
  { label: 'Delete', disabled: false },
]);

const ACTION_ENTRIES = JSON.stringify([
  { label: 'View details' },
  { label: 'Edit record' },
  { label: 'Export as CSV' },
  'separator',
  { label: 'Delete record' },
]);

const SORT_ENTRIES = JSON.stringify([
  { label: 'Name A–Z' },
  { label: 'Name Z–A' },
  { label: 'Date modified' },
  { label: 'Date created' },
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

Pass \`entries\` as a JSON-encoded \`entries\` attribute (\`entries='${'$'}{JSON.stringify(...)}'\`)
or as the JS \`entries\` property. Emits a \`selected\` CustomEvent with the chosen entry.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Trigger button label (becomes the menu\'s accessible name)' },
  },
  render: () => ({
    template: `<candor-menu label="Actions" entries='${DEMO_ENTRIES}'></candor-menu>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Actions: Story = {
  render: () => ({
    template: `<candor-menu label="Actions" entries='${ACTION_ENTRIES}'></candor-menu>`,
  }),
};

export const ShortList: Story = {
  render: () => ({
    template: `<candor-menu label="Sort by" entries='${SORT_ENTRIES}'></candor-menu>`,
  }),
};

export const WithDisabledItems: Story = {
  render: () => ({
    template: `<candor-menu label="File" entries='${FILE_ENTRIES_DISABLED}'></candor-menu>`,
  }),
};

export const InToolbar: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--color-bg-surface);border-radius:var(--radius-md);border:1px solid var(--color-border-default);">
        <candor-menu label="File" entries='${TOOLBAR_FILE}'></candor-menu>
        <candor-menu label="Edit" entries='${TOOLBAR_EDIT}'></candor-menu>
        <candor-menu label="View" entries='${TOOLBAR_VIEW}'></candor-menu>
      </div>
    `,
  }),
};
