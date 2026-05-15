import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Tooltip',
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
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
