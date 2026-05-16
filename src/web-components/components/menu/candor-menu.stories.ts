import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Menu',
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

Supports separators between logical groups (\`'separator'\` entry) and disabled states on
individual items (\`{ label, disabled: true }\`). The trigger label becomes the accessible
name for the menu button — make it descriptive, not just "More" or "Options".

Pass \`entries\` as \`(MenuItem | 'separator')[]\` via the JS property. Emits a
\`selected\` CustomEvent with the chosen entry.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Trigger button label (becomes the menu\'s accessible name)' },
  },
  render: () => ({
    template: `<candor-menu id="demo-menu" label="Actions"></candor-menu>
    <script>
      document.getElementById('demo-menu').entries = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        'separator',
        { label: 'Share' },
        'separator',
        { label: 'Delete', disabled: false }
      ];
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Actions: Story = {
  render: () => ({
    template: `<candor-menu id="menu-actions" label="Actions"></candor-menu>
    <script>
      document.getElementById('menu-actions').entries = [
        { label: 'View details' },
        { label: 'Edit record' },
        { label: 'Export as CSV' },
        'separator',
        { label: 'Delete record' }
      ];
    </script>`,
  }),
};

export const ShortList: Story = {
  render: () => ({
    template: `<candor-menu id="menu-short" label="Sort by"></candor-menu>
    <script>
      document.getElementById('menu-short').entries = [
        { label: 'Name A–Z' },
        { label: 'Name Z–A' },
        { label: 'Date modified' },
        { label: 'Date created' }
      ];
    </script>`,
  }),
};

export const WithDisabledItems: Story = {
  render: () => ({
    template: `<candor-menu id="menu-disabled" label="File"></candor-menu>
    <script>
      document.getElementById('menu-disabled').entries = [
        { label: 'New file' },
        { label: 'Open...' },
        { label: 'Open recent', disabled: true },
        'separator',
        { label: 'Save' },
        { label: 'Save as...' },
        'separator',
        { label: 'Print', disabled: true }
      ];
    </script>`,
  }),
};

export const InToolbar: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--color-bg-surface);border-radius:var(--radius-md);border:1px solid var(--color-border-default);">
        <candor-menu id="menu-file" label="File"></candor-menu>
        <candor-menu id="menu-edit" label="Edit"></candor-menu>
        <candor-menu id="menu-view" label="View"></candor-menu>
      </div>
      <script>
        document.getElementById('menu-file').entries = [{ label: 'New' }, { label: 'Open...' }, 'separator', { label: 'Save' }];
        document.getElementById('menu-edit').entries = [{ label: 'Undo' }, { label: 'Redo', disabled: true }, 'separator', { label: 'Cut' }, { label: 'Copy' }, { label: 'Paste' }];
        document.getElementById('menu-view').entries = [{ label: 'Zoom in' }, { label: 'Zoom out' }, { label: 'Reset zoom' }];
      </script>
    `,
  }),
};
