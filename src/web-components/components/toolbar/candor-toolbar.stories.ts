import type { Meta, StoryObj } from '@storybook/angular';

const BTN = 'btn btn-ghost btn-sm';

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
        <button class="${BTN}" type="button" aria-label="Bold" title="Bold">
          <i class="ph-bold ph-text-b" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Italic" title="Italic">
          <i class="ph ph-text-italic" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Underline" title="Underline">
          <i class="ph ph-text-underline" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Strikethrough" title="Strikethrough">
          <i class="ph ph-text-strikethrough" aria-hidden="true"></i>
        </button>
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
        <button class="${BTN}" type="button" aria-label="Bold" title="Bold">
          <i class="ph-bold ph-text-b" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Italic" title="Italic">
          <i class="ph ph-text-italic" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Underline" title="Underline">
          <i class="ph ph-text-underline" aria-hidden="true"></i>
        </button>

        <candor-toolbar-separator></candor-toolbar-separator>

        <button class="${BTN}" type="button" aria-label="Align left" title="Align left">
          <i class="ph ph-text-align-left" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align center" title="Align center">
          <i class="ph ph-text-align-center" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align right" title="Align right">
          <i class="ph ph-text-align-right" aria-hidden="true"></i>
        </button>

        <candor-toolbar-separator></candor-toolbar-separator>

        <button class="${BTN}" type="button" aria-label="Bulleted list" title="Bulleted list">
          <i class="ph ph-list-bullets" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Numbered list" title="Numbered list">
          <i class="ph ph-list-numbers" aria-hidden="true"></i>
        </button>
      </candor-toolbar>
    `,
  }),
};

export const WithToggleButtons: Story = {
  name: 'Toggle buttons (aria-pressed)',
  render: () => ({
    template: `
      <candor-toolbar aria-label="Text formatting">
        <button class="${BTN}" type="button" aria-label="Bold" aria-pressed="true" title="Bold (active)"
                style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
          <i class="ph-bold ph-text-b" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Italic" aria-pressed="false" title="Italic">
          <i class="ph ph-text-italic" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Underline" aria-pressed="false" title="Underline">
          <i class="ph ph-text-underline" aria-hidden="true"></i>
        </button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <button class="${BTN}" type="button" aria-label="Align left" aria-pressed="true" title="Align left (active)"
                style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
          <i class="ph ph-text-align-left" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align center" aria-pressed="false" title="Align center">
          <i class="ph ph-text-align-center" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align right" aria-pressed="false" title="Align right">
          <i class="ph ph-text-align-right" aria-hidden="true"></i>
        </button>
      </candor-toolbar>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <candor-toolbar aria-label="Drawing tools" orientation="vertical">
        <button class="${BTN}" type="button" aria-label="Select" aria-pressed="true" title="Select"
                style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
          <i class="ph ph-cursor" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Pan" aria-pressed="false" title="Pan">
          <i class="ph ph-hand" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Pencil" aria-pressed="false" title="Pencil">
          <i class="ph ph-pencil" aria-hidden="true"></i>
        </button>
        <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>
        <button class="${BTN}" type="button" aria-label="Zoom in" title="Zoom in">
          <i class="ph ph-magnifying-glass-plus" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Zoom out" title="Zoom out">
          <i class="ph ph-magnifying-glass-minus" aria-hidden="true"></i>
        </button>
      </candor-toolbar>
    `,
  }),
};

export const DataTableActions: Story = {
  name: 'Data table actions',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 640px;">
        <candor-toolbar aria-label="Table actions">
          <button class="${BTN}" type="button" title="Filter rows">
            <i class="ph ph-funnel" aria-hidden="true"></i>
            Filter
          </button>
          <button class="${BTN}" type="button" title="Sort columns">
            <i class="ph ph-sort-ascending" aria-hidden="true"></i>
            Sort
          </button>
          <candor-toolbar-separator></candor-toolbar-separator>
          <button class="${BTN}" type="button" aria-label="Export as CSV" title="Export CSV">
            <i class="ph ph-export" aria-hidden="true"></i>
            Export
          </button>
          <button class="${BTN}" type="button" aria-label="Toggle column visibility" title="Columns">
            <i class="ph ph-columns" aria-hidden="true"></i>
            Columns
          </button>
        </candor-toolbar>
        <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: var(--spacing-md);
                    font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
          ↑ Table content would appear here
        </div>
      </div>
    `,
  }),
};
