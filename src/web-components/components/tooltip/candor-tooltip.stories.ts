import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tooltips in Candor are **intentionally invisible to assistive technology**.

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
    text: { control: 'text', type: { name: 'string' }, description: 'Tooltip text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      type: { name: 'string' },
      description: 'Where the bubble appears relative to the trigger',
    },
  },
  args: { text: 'Helpful information', position: 'top' },
  render: (args) => ({
    template: `
      <div style="padding:4rem;display:flex;justify-content:center;">
        <candor-tooltip text="${args['text']}" position="${args['position']}">
          <candor-button variant="secondary">Hover or focus me</candor-button>
        </candor-tooltip>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Bottom: Story = {
  args: { text: 'Opens in a new tab', position: 'bottom' },
  render: (args) => ({
    template: `<div style="padding:4rem;display:flex;justify-content:center;"><candor-tooltip text="${args['text']}" position="bottom"><a href="#" style="font-family:var(--font-family-base);color:var(--color-link);">External link</a></candor-tooltip></div>`,
  }),
};

export const Left: Story = {
  args: { text: 'Cannot undo this action', position: 'left' },
  render: (args) => ({
    template: `<div style="padding:4rem;display:flex;justify-content:center;"><candor-tooltip text="${args['text']}" position="left"><candor-button variant="destructive">Delete</candor-button></candor-tooltip></div>`,
  }),
};

export const Right: Story = {
  args: { text: 'Keyboard shortcut: ⌘K', position: 'right' },
  render: (args) => ({
    template: `<div style="padding:4rem;display:flex;justify-content:center;"><candor-tooltip text="${args['text']}" position="right"><candor-button variant="secondary">Search</candor-button></candor-tooltip></div>`,
  }),
};

export const IconButton: Story = {
  render: () => ({
    template: `
      <div style="padding:4rem;display:flex;gap:1rem;">
        <candor-tooltip text="Edit item" position="top">
          <button style="padding:0.5rem;background:var(--color-bg-surface);color:var(--color-text-subtle);border:1px solid var(--color-border-default);border-radius:var(--radius-sm);cursor:pointer;display:inline-flex;" aria-label="Edit">✏</button>
        </candor-tooltip>
        <candor-tooltip text="Duplicate" position="top">
          <button style="padding:0.5rem;background:var(--color-bg-surface);color:var(--color-text-subtle);border:1px solid var(--color-border-default);border-radius:var(--radius-sm);cursor:pointer;display:inline-flex;" aria-label="Duplicate">⧉</button>
        </candor-tooltip>
        <candor-tooltip text="Delete permanently" position="top">
          <button style="padding:0.5rem;background:var(--color-bg-surface);color:var(--color-status-error);border:1px solid var(--color-border-default);border-radius:var(--radius-sm);cursor:pointer;display:inline-flex;" aria-label="Delete">🗑</button>
        </candor-tooltip>
      </div>
    `,
  }),
};

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div style="padding:4rem;display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;">
        <candor-tooltip text="Top tooltip" position="top"><candor-button variant="secondary">Top</candor-button></candor-tooltip>
        <candor-tooltip text="Bottom tooltip" position="bottom"><candor-button variant="secondary">Bottom</candor-button></candor-tooltip>
        <candor-tooltip text="Left tooltip" position="left"><candor-button variant="secondary">Left</candor-button></candor-tooltip>
        <candor-tooltip text="Right tooltip" position="right"><candor-button variant="secondary">Right</candor-button></candor-tooltip>
      </div>
    `,
  }),
};
