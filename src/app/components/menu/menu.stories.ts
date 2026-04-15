import type { Meta, StoryObj } from '@storybook/angular';
import { MenuComponent } from './menu.component';

const meta: Meta<MenuComponent> = {
  title: 'Components/Menu',
  component: MenuComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Dropdown list of actions triggered by a button. Implements the
[ARIA Menu Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/):
Arrow keys navigate items, Enter/Space activate, Escape closes and returns focus.

Use a menu when a single button would otherwise need 3+ secondary actions alongside it.
If you have 1–2 secondary actions, use separate Buttons instead.

Supports separators between logical groups and disabled states on individual items.
The trigger label becomes the accessible name for the menu button — make it descriptive,
not just "More" or "Options".
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<MenuComponent>;

export const Default: Story = {
  args: {
    label: 'Options',
    entries: [
      { label: 'Edit' },
      { label: 'Duplicate' },
      'separator',
      { label: 'Archive' },
      { label: 'Delete', disabled: true },
    ],
  },
};

export const Actions: Story = {
  args: {
    label: 'Actions',
    entries: [
      { label: 'View details' },
      { label: 'Edit record' },
      { label: 'Export as CSV' },
      'separator',
      { label: 'Delete record' },
    ],
  },
};

export const ShortList: Story = {
  args: {
    label: 'Sort by',
    entries: [
      { label: 'Name A–Z' },
      { label: 'Name Z–A' },
      { label: 'Date modified' },
      { label: 'Date created' },
    ],
  },
};

export const WithDisabledItems: Story = {
  args: {
    label: 'File',
    entries: [
      { label: 'New file' },
      { label: 'Open...' },
      { label: 'Open recent', disabled: true },
      'separator',
      { label: 'Save' },
      { label: 'Save as...' },
      'separator',
      { label: 'Print', disabled: true },
    ],
  },
};

export const InToolbar: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--color-bg-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border-default);">
        <app-menu label="File" [entries]="[
          { label: 'New' },
          { label: 'Open...' },
          'separator',
          { label: 'Save' }
        ]"></app-menu>
        <app-menu label="Edit" [entries]="[
          { label: 'Undo' },
          { label: 'Redo', disabled: true },
          'separator',
          { label: 'Cut' },
          { label: 'Copy' },
          { label: 'Paste' }
        ]"></app-menu>
        <app-menu label="View" [entries]="[
          { label: 'Zoom in' },
          { label: 'Zoom out' },
          { label: 'Reset zoom' }
        ]"></app-menu>
      </div>
    `,
  }),
};
