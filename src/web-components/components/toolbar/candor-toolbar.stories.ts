import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import { allModes } from '../../../../.storybook/modes';
import './candor-toolbar';

const BTN = 'btn btn-ghost btn-sm';

// Icon-only buttons follow the icon-weight rule (#296). A glyph with a fill form
// is drawn filled at 1.75rem; a stroke-only glyph (text formatting, align, list,
// link, arrows), whose fill form is a box, is drawn bold at 1.25rem. Both take
// --color-text-subtle from the button, so a pressed toggle's own colour still wins.
// The 2px padding keeps the button at 32px with the larger glyph inside.
const ICON_ONLY = 'padding:0.125rem;min-width:2rem;color:var(--color-text-subtle);';
const FILL_ICON = 'font-size:1.75rem;line-height:1;';
const BOLD_ICON = 'font-size:1.25rem;line-height:1;';

const meta: Meta = {
  title: 'Components/Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-toolbar>\`: a horizontal or vertical strip of related controls. Implements the APG
Toolbar pattern: the entire toolbar is a **single tab stop**; arrow keys move focus
between controls inside it.

**ARIA contract:** \`role="toolbar"\` on the container; \`aria-label\` or
\`aria-labelledby\` required for identification when multiple toolbars appear on a page.
\`aria-orientation\` is set automatically from the \`orientation\` attribute.

**Roving tabindex:** On first Tab into the toolbar, focus lands on the last-active item
(or the first item on initial visit). Arrow keys (Left/Right for horizontal, Up/Down for
vertical) move focus; Home/End jump to first/last. Tab moves focus out of the toolbar
entirely, not to the next item within it.

**Toggle buttons:** Use \`aria-pressed\` on \`<button>\` elements for on/off state (Bold,
Italic, active filter). The toolbar does not manage pressed state. That is the consumer's
responsibility.

**Separator:** Use \`<candor-toolbar-separator>\` between logical groups. In a horizontal
toolbar use the default \`orientation="vertical"\`; in a vertical toolbar set
\`orientation="horizontal"\`.

**Story authoring note: the \`btn btn-ghost btn-sm\` classes are Storybook-only.**
These stories style their toolbar buttons with utility classes that exist in the
Storybook harness but are **not** shipped in \`@candor-design/tokens\`. Don't copy them
into an app, or they'll render as unstyled browser buttons. The toolbar is a generic
container: it supplies structure, ARIA, and roving focus for whatever \`<button>\`s you
put inside. For plain controls use \`<candor-button variant="ghost" size="small">\`; for
**toggle** controls (Bold/Italic with \`aria-pressed\`) supply your own \`<button>\` and
style it, because \`candor-button\` has no pressed state.
        `.trim(),
      },
    },
  },
  argTypes: {
    'aria-label': { control: 'text', type: { name: 'string' }, description: 'Accessible label for the toolbar. Required when no visible label element exists on the page.' },
    ariaLabelledby: { control: 'text', type: { name: 'string' }, description: 'ID of an element that already labels this toolbar. Use instead of aria-label when the label is visible elsewhere on the page.' },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      type: { name: 'string' },
      description: 'Layout direction; controls which arrow keys navigate and the required separator orientation',
    },
  },
  args: { 'aria-label': 'Text formatting', orientation: 'horizontal' },
  render: (args) => html`
    <candor-toolbar aria-label="${args['aria-label']}" orientation="${args['orientation']}">
      <button class="${BTN}" type="button" aria-label="Bold" title="Bold" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-b" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Italic" title="Italic" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-italic" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Underline" title="Underline" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-underline" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Strikethrough" title="Strikethrough" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-strikethrough" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
    </candor-toolbar>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithSeparators: Story = {
  name: 'With separators (grouped controls)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Use `<candor-toolbar-separator>` between logical groups of controls. ' +
          'In a horizontal toolbar the default `orientation="vertical"` produces a thin vertical rule. ' +
          'Arrow key navigation crosses separators. They are presentational only and are not focusable.',
      },
    },
  },
  render: () => html`
    <candor-toolbar aria-label="Text formatting">
      <button class="${BTN}" type="button" aria-label="Bold" title="Bold" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-b" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Italic" title="Italic" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-italic" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Underline" title="Underline" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-underline" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>

      <candor-toolbar-separator></candor-toolbar-separator>

      <button class="${BTN}" type="button" aria-label="Align left" title="Align left" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-align-left" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Align center" title="Align center" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-align-center" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Align right" title="Align right" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-align-right" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>

      <candor-toolbar-separator></candor-toolbar-separator>

      <button class="${BTN}" type="button" aria-label="Bulleted list" title="Bulleted list" style="${ICON_ONLY}">
        <i class="ph-bold ph-list-bullets" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Numbered list" title="Numbered list" style="${ICON_ONLY}">
        <i class="ph-bold ph-list-numbers" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
    </candor-toolbar>
  `,
};

export const WithToggleButtons: Story = {
  name: 'Toggle buttons (aria-pressed)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Toggle buttons carry `aria-pressed="true"` when active. ' +
          'The toolbar does not manage pressed state. The consumer toggles `aria-pressed` and applies an active visual style on each click. ' +
          'Bold and Align Left are shown pre-pressed here; clicking does not toggle state in this static demo.',
      },
    },
  },
  render: () => html`
    <candor-toolbar aria-label="Text formatting">
      <button class="${BTN}" type="button" aria-label="Bold" aria-pressed="true" title="Bold (active)"
              style="${ICON_ONLY} background: var(--color-bg-elevated); color: var(--color-action-primary);">
        <i class="ph-bold ph-text-b" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Italic" aria-pressed="false" title="Italic" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-italic" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Underline" aria-pressed="false" title="Underline" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-underline" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <candor-toolbar-separator></candor-toolbar-separator>
      <button class="${BTN}" type="button" aria-label="Align left" aria-pressed="true" title="Align left (active)"
              style="${ICON_ONLY} background: var(--color-bg-elevated); color: var(--color-action-primary);">
        <i class="ph-bold ph-text-align-left" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Align center" aria-pressed="false" title="Align center" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-align-center" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Align right" aria-pressed="false" title="Align right" style="${ICON_ONLY}">
        <i class="ph-bold ph-text-align-right" aria-hidden="true" style="${BOLD_ICON}"></i>
      </button>
    </candor-toolbar>
  `,
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Set `orientation="vertical"` to stack controls top to bottom. ' +
          'Arrow navigation switches to Up/Down; Left/Right have no effect. ' +
          'Use `orientation="horizontal"` on `<candor-toolbar-separator>` to produce a horizontal dividing line inside a vertical toolbar.',
      },
    },
  },
  render: () => html`
    <candor-toolbar aria-label="Drawing tools" orientation="vertical">
      <button class="${BTN}" type="button" aria-label="Select" aria-pressed="true" title="Select"
              style="${ICON_ONLY} background: var(--color-bg-elevated); color: var(--color-action-primary);">
        <i class="ph-fill ph-cursor" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Pan" aria-pressed="false" title="Pan" style="${ICON_ONLY}">
        <i class="ph-fill ph-hand" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Pencil" aria-pressed="false" title="Pencil" style="${ICON_ONLY}">
        <i class="ph-fill ph-pencil" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>
      <button class="${BTN}" type="button" aria-label="Zoom in" title="Zoom in" style="${ICON_ONLY}">
        <i class="ph-fill ph-magnifying-glass-plus" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Zoom out" title="Zoom out" style="${ICON_ONLY}">
        <i class="ph-fill ph-magnifying-glass-minus" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
    </candor-toolbar>
  `,
};

export const VerticalScrolling: Story = {
  name: 'Vertical, in a short space',
  parameters: {
    controls: { disable: true },
    // Dark is set on this story alone: it is the one that shows a toolbar's
    // scrollbar, and dark is where the UA scrollbar was wrong (#307).
    chromatic: { modes: { light: allModes.light, dark: allModes.dark } },
    docs: {
      description: {
        story:
          'A vertical toolbar taller than its space scrolls within its own bounds instead of spilling out of its container. ' +
          'The cap is the host\'s height, so give the host one: set it, as here, or let the toolbar stretch as a flex or grid item. ' +
          'The scrollbar draws a 6px bar inside a 24px grab area (`--scrollbar-size`, the AA target size), so the whole lane can be dragged. ' +
          'Keyboard users never need it: arrow keys move focus through the toolbar and scroll the focused control into view.',
      },
    },
  },
  render: () => html`
    <candor-toolbar aria-label="Drawing tools" orientation="vertical" style="height: 9rem;">
      <button class="${BTN}" type="button" aria-label="Select" aria-pressed="true" title="Select"
              style="${ICON_ONLY} background: var(--color-bg-elevated); color: var(--color-action-primary);">
        <i class="ph-fill ph-cursor" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Pan" aria-pressed="false" title="Pan" style="${ICON_ONLY}">
        <i class="ph-fill ph-hand" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Pencil" aria-pressed="false" title="Pencil" style="${ICON_ONLY}">
        <i class="ph-fill ph-pencil" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Erase" aria-pressed="false" title="Erase" style="${ICON_ONLY}">
        <i class="ph-fill ph-eraser" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>
      <button class="${BTN}" type="button" aria-label="Zoom in" title="Zoom in" style="${ICON_ONLY}">
        <i class="ph-fill ph-magnifying-glass-plus" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
      <button class="${BTN}" type="button" aria-label="Zoom out" title="Zoom out" style="${ICON_ONLY}">
        <i class="ph-fill ph-magnifying-glass-minus" aria-hidden="true" style="${FILL_ICON}"></i>
      </button>
    </candor-toolbar>
  `,
};

export const DataTableActions: Story = {
  name: 'Data table actions',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Toolbars above data tables typically mix icon-only and icon+text buttons. ' +
          'Buttons with visible text labels do not need `aria-label`. The visible text is already the accessible name. ' +
          'Icon-only buttons always need `aria-label`.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 640px;">
      <candor-toolbar aria-label="Table actions">
        <button class="${BTN}" type="button">
          <i class="ph ph-funnel" aria-hidden="true"></i>
          Filter
        </button>
        <button class="${BTN}" type="button">
          <i class="ph ph-sort-ascending" aria-hidden="true"></i>
          Sort
        </button>
        <candor-toolbar-separator></candor-toolbar-separator>
        <button class="${BTN}" type="button">
          <i class="ph ph-export" aria-hidden="true"></i>
          Export
        </button>
        <button class="${BTN}" type="button">
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
};
