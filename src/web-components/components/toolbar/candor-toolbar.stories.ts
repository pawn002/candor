import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Toolbar',
  tags: ['autodocs'],
  argTypes: {
    ariaLabel: { control: 'text' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  args: { ariaLabel: 'Text formatting', orientation: 'horizontal' },
  render: (args) => ({
    template: `
      <candor-toolbar aria-label="${args['ariaLabel']}" orientation="${args['orientation']}">
        <candor-button variant="ghost" size="small">Bold</candor-button>
        <candor-button variant="ghost" size="small">Italic</candor-button>
        <candor-button variant="ghost" size="small">Underline</candor-button>
      </candor-toolbar>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithSeparators: Story = {
  name: 'With separators (grouped controls)',
  render: () => ({
    template: `
      <candor-toolbar aria-label="Text formatting">
        <candor-button variant="ghost" size="small" aria-label="Bold">B</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Italic">I</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Underline">U</candor-button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <candor-button variant="ghost" size="small" aria-label="Align left">←</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Align center">↔</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Align right">→</candor-button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <candor-button variant="ghost" size="small" aria-label="Bulleted list">• List</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Numbered list">1. List</candor-button>
      </candor-toolbar>
    `,
  }),
};

export const WithToggleButtons: Story = {
  name: 'Toggle buttons (aria-pressed)',
  render: () => ({
    template: `
      <candor-toolbar aria-label="Text formatting">
        <button
          type="button"
          aria-label="Bold"
          aria-pressed="true"
          title="Bold (active)"
          style="padding:0 0.5rem;height:2rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-family-base);font-weight:bold;background:var(--color-bg-elevated);color:var(--color-action-primary);"
        >B</button>
        <button
          type="button"
          aria-label="Italic"
          aria-pressed="false"
          title="Italic"
          style="padding:0 0.5rem;height:2rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-family-base);font-style:italic;background:transparent;color:var(--color-text-default);"
        >I</button>
        <button
          type="button"
          aria-label="Underline"
          aria-pressed="false"
          title="Underline"
          style="padding:0 0.5rem;height:2rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-family-base);text-decoration:underline;background:transparent;color:var(--color-text-default);"
        >U</button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <button
          type="button"
          aria-label="Align left"
          aria-pressed="true"
          title="Align left (active)"
          style="padding:0 0.5rem;height:2rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-family-base);background:var(--color-bg-elevated);color:var(--color-action-primary);"
        >←</button>
        <button
          type="button"
          aria-label="Align center"
          aria-pressed="false"
          title="Align center"
          style="padding:0 0.5rem;height:2rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-family-base);background:transparent;color:var(--color-text-default);"
        >↔</button>
        <button
          type="button"
          aria-label="Align right"
          aria-pressed="false"
          title="Align right"
          style="padding:0 0.5rem;height:2rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-family-base);background:transparent;color:var(--color-text-default);"
        >→</button>
      </candor-toolbar>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <candor-toolbar aria-label="Drawing tools" orientation="vertical">
        <candor-button variant="ghost" size="small" aria-label="Select" aria-pressed="true">Select</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Pan" aria-pressed="false">Pan</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Pencil" aria-pressed="false">Pencil</candor-button>
        <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>
        <candor-button variant="ghost" size="small" aria-label="Zoom in">+</candor-button>
        <candor-button variant="ghost" size="small" aria-label="Zoom out">−</candor-button>
      </candor-toolbar>
    `,
  }),
};

export const DataTableActions: Story = {
  name: 'Data table actions',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);max-width:640px;">
        <candor-toolbar aria-label="Table actions">
          <candor-button variant="ghost" size="small">Filter</candor-button>
          <candor-button variant="ghost" size="small">Sort</candor-button>
          <candor-toolbar-separator></candor-toolbar-separator>
          <candor-button variant="ghost" size="small" aria-label="Export as CSV">Export</candor-button>
          <candor-button variant="ghost" size="small" aria-label="Toggle column visibility">Columns</candor-button>
        </candor-toolbar>
        <div style="background:var(--color-bg-surface);border-radius:var(--radius-md);padding:var(--spacing-md);font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">↑ Table content would appear here</div>
      </div>
    `,
  }),
};
