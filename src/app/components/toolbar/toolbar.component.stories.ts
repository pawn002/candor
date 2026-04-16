import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarSeparatorComponent } from './toolbar-separator.component';

const meta: Meta<ToolbarComponent> = {
  title: 'Components/Toolbar',
  component: ToolbarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [ToolbarComponent, ToolbarSeparatorComponent] }),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Horizontal or vertical strip of related controls. Implements the APG Toolbar pattern — the entire toolbar is a **single tab stop**; arrow keys move focus between controls inside it.

**ARIA contract:** \`role="toolbar"\` on the container; \`aria-label\` or \`aria-labelledby\` required for identification when multiple toolbars appear on a page. \`aria-orientation\` is set automatically from the \`orientation\` input.

**Roving tabindex:** On first Tab into the toolbar, focus lands on the last-active item (or the first item on initial visit). Arrow keys (Left/Right for horizontal, Up/Down for vertical) move focus; Home/End jump to the first/last item. Tab moves focus out of the toolbar entirely — not to the next item within it.

**Toggle buttons:** Use \`aria-pressed\` on \`<button>\` elements for on/off state (Bold, Italic, active filter). The toolbar does not manage pressed state — that is the consumer's responsibility.

**When to use**

| Use | When |
|---|---|
| \`app-toolbar\` | A cluster of related controls users will use repeatedly — text formatting, table actions, drawing tools |
| Individual \`app-button\` elements | A small number of unrelated actions that don't benefit from arrow-key navigation |

**Separator:** Use \`<app-toolbar-separator>\` between logical groups. In a horizontal toolbar use the default \`orientation="vertical"\`; in a vertical toolbar set \`orientation="horizontal"\`.
        `.trim(),
      },
    },
  },
  argTypes: {
    ariaLabel: { control: 'text' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};

export default meta;
type Story = StoryObj<ToolbarComponent>;

// ── Base button styles used across stories ─────────────────────────────────
// These use Candor's .btn global utility classes.
const BTN = 'btn btn-ghost btn-sm';
const BTN_ACTIVE = 'btn btn-ghost btn-sm';

export const Default: Story = {
  args: { ariaLabel: 'Text formatting' },
  render: (args) => ({
    props: args,
    template: `
      <app-toolbar ariaLabel="Text formatting">
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
      </app-toolbar>
    `,
  }),
};

export const WithSeparators: Story = {
  name: 'With separators (grouped controls)',
  parameters: {
    docs: {
      description: {
        story: 'Use `<app-toolbar-separator>` to divide related groups. Each group should share a common action type — formatting vs. alignment vs. list style.',
      },
    },
  },
  render: () => ({
    template: `
      <app-toolbar ariaLabel="Text formatting">
        <button class="${BTN}" type="button" aria-label="Bold" title="Bold">
          <i class="ph-bold ph-text-b" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Italic" title="Italic">
          <i class="ph ph-text-italic" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Underline" title="Underline">
          <i class="ph ph-text-underline" aria-hidden="true"></i>
        </button>

        <app-toolbar-separator></app-toolbar-separator>

        <button class="${BTN}" type="button" aria-label="Align left" title="Align left">
          <i class="ph ph-text-align-left" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align center" title="Align center">
          <i class="ph ph-text-align-center" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align right" title="Align right">
          <i class="ph ph-text-align-right" aria-hidden="true"></i>
        </button>

        <app-toolbar-separator></app-toolbar-separator>

        <button class="${BTN}" type="button" aria-label="Bulleted list" title="Bulleted list">
          <i class="ph ph-list-bullets" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Numbered list" title="Numbered list">
          <i class="ph ph-list-numbers" aria-hidden="true"></i>
        </button>
      </app-toolbar>
    `,
  }),
};

export const WithToggleButtons: Story = {
  name: 'Toggle buttons (aria-pressed)',
  parameters: {
    docs: {
      description: {
        story: `
Use \`aria-pressed\` on \`<button>\` elements to express on/off state. The toolbar does not manage pressed state — bind it from your component.

\`aria-pressed="true"\` announces "pressed" to screen readers; \`aria-pressed="false"\` announces "not pressed". Both states must be explicitly set — omitting the attribute means the button is not a toggle at all.
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <app-toolbar ariaLabel="Text formatting">
        <button class="${BTN_ACTIVE}" type="button" aria-label="Bold" aria-pressed="true" title="Bold (active)"
                style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
          <i class="ph-bold ph-text-b" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Italic" aria-pressed="false" title="Italic">
          <i class="ph ph-text-italic" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Underline" aria-pressed="false" title="Underline">
          <i class="ph ph-text-underline" aria-hidden="true"></i>
        </button>
        <app-toolbar-separator></app-toolbar-separator>
        <button class="${BTN_ACTIVE}" type="button" aria-label="Align left" aria-pressed="true" title="Align left (active)"
                style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
          <i class="ph ph-text-align-left" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align center" aria-pressed="false" title="Align center">
          <i class="ph ph-text-align-center" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Align right" aria-pressed="false" title="Align right">
          <i class="ph ph-text-align-right" aria-hidden="true"></i>
        </button>
      </app-toolbar>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <app-toolbar ariaLabel="Drawing tools" orientation="vertical">
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
        <app-toolbar-separator orientation="horizontal"></app-toolbar-separator>
        <button class="${BTN}" type="button" aria-label="Zoom in" title="Zoom in">
          <i class="ph ph-magnifying-glass-plus" aria-hidden="true"></i>
        </button>
        <button class="${BTN}" type="button" aria-label="Zoom out" title="Zoom out">
          <i class="ph ph-magnifying-glass-minus" aria-hidden="true"></i>
        </button>
      </app-toolbar>
    `,
  }),
};

export const DataTableActions: Story = {
  name: 'Data table actions',
  parameters: {
    docs: {
      description: {
        story: 'Toolbars are well-suited to data table action bars — filter, sort, export, and column-picker controls grouped into a single tab stop above the table.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 640px;">
        <app-toolbar ariaLabel="Table actions">
          <button class="${BTN}" type="button" title="Filter rows">
            <i class="ph ph-funnel" aria-hidden="true"></i>
            Filter
          </button>
          <button class="${BTN}" type="button" title="Sort columns">
            <i class="ph ph-sort-ascending" aria-hidden="true"></i>
            Sort
          </button>
          <app-toolbar-separator></app-toolbar-separator>
          <button class="${BTN}" type="button" aria-label="Export as CSV" title="Export CSV">
            <i class="ph ph-export" aria-hidden="true"></i>
            Export
          </button>
          <button class="${BTN}" type="button" aria-label="Toggle column visibility" title="Columns">
            <i class="ph ph-columns" aria-hidden="true"></i>
            Columns
          </button>
        </app-toolbar>
        <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: var(--spacing-md);
                    font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
          ↑ Table content would appear here
        </div>
      </div>
    `,
  }),
};
