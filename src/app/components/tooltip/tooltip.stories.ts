import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';

const meta: Meta<TooltipComponent> = {
  title: 'Components/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [TooltipComponent] })],
  argTypes: {
    text: { control: 'text' },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Tooltips in Candor are **intentionally invisible to assistive technology**.

The tooltip bubble carries \`aria-hidden="true"\` and is never wired via \`aria-describedby\`. This is a deliberate design system position, not an oversight.

**The reasoning:** Tooltips solve a sighted-user problem — persistent label text isn't always visible. AT users already receive context through the accessible name, label, and surrounding content of the trigger element, without needing a tooltip. Wiring tooltips to AT creates double-announcements in browse mode and makes the tooltip a crutch that masks under-specified element names.

**The contract this creates for consumers:**

- Every trigger element must be self-describing. An icon-only button needs \`aria-label\`. A truncated label needs a full visible text alternative elsewhere.
- If the tooltip text is essential to understand the action, it belongs in the element's accessible name or a visible label — not in a tooltip.
- Use tooltips as a last resort for supplementary pointer-user context, never as the primary channel for critical information.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<TooltipComponent>;

export const Default: Story = {
  args: { text: 'Save document', position: 'top' },
  render: (args) => ({
    props: args,
    template: `
      <app-tooltip [text]="text" [position]="position">
        <button style="padding: 0.5rem 1rem; font-family: var(--font-family-base); background: var(--color-action-primary); color: var(--color-text-on-action); border: none; border-radius: var(--radius-md); cursor: pointer;">
          Save
        </button>
      </app-tooltip>
    `,
  }),
};

export const Bottom: Story = {
  args: { text: 'Opens in a new tab', position: 'bottom' },
  render: (args) => ({
    props: args,
    template: `
      <app-tooltip [text]="text" [position]="position">
        <a href="#" style="font-family: var(--font-family-base); color: var(--color-link);">External link</a>
      </app-tooltip>
    `,
  }),
};

export const Left: Story = {
  args: { text: 'Cannot undo this action', position: 'left' },
  render: (args) => ({
    props: args,
    template: `
      <app-tooltip [text]="text" [position]="position">
        <button style="padding: 0.5rem 1rem; font-family: var(--font-family-base); background: transparent; color: var(--color-action-destructive-text); border: 1px solid var(--color-action-destructive-border); border-radius: var(--radius-md); cursor: pointer;">
          Delete
        </button>
      </app-tooltip>
    `,
  }),
};

export const Right: Story = {
  args: { text: 'Keyboard shortcut: ⌘K', position: 'right' },
  render: (args) => ({
    props: args,
    template: `
      <app-tooltip [text]="text" [position]="position">
        <button style="padding: 0.5rem; font-family: var(--font-family-accessible); font-size: var(--font-size-sm); background: var(--color-bg-surface); color: var(--color-text-default); border: 1px solid var(--color-border-default); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; gap: 0.375rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Search
        </button>
      </app-tooltip>
    `,
  }),
};

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5rem; padding: 4rem;">
        <div style="display: flex; justify-content: center;">
          <app-tooltip text="Tooltip above" position="top">
            <button style="padding: 0.5rem 1rem; font-family: var(--font-family-base); background: var(--color-bg-surface); color: var(--color-text-default); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); cursor: pointer;">Top</button>
          </app-tooltip>
        </div>
        <div style="display: flex; justify-content: center;">
          <app-tooltip text="Tooltip below" position="bottom">
            <button style="padding: 0.5rem 1rem; font-family: var(--font-family-base); background: var(--color-bg-surface); color: var(--color-text-default); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); cursor: pointer;">Bottom</button>
          </app-tooltip>
        </div>
        <div style="display: flex; justify-content: center;">
          <app-tooltip text="Tooltip left" position="left">
            <button style="padding: 0.5rem 1rem; font-family: var(--font-family-base); background: var(--color-bg-surface); color: var(--color-text-default); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); cursor: pointer;">Left</button>
          </app-tooltip>
        </div>
        <div style="display: flex; justify-content: center;">
          <app-tooltip text="Tooltip right" position="right">
            <button style="padding: 0.5rem 1rem; font-family: var(--font-family-base); background: var(--color-bg-surface); color: var(--color-text-default); border: 1px solid var(--color-border-default); border-radius: var(--radius-md); cursor: pointer;">Right</button>
          </app-tooltip>
        </div>
      </div>
    `,
  }),
};

export const IconButton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem;">
        <app-tooltip text="Edit item" position="top">
          <button style="padding: 0.5rem; background: var(--color-bg-surface); color: var(--color-text-subtle); border: 1px solid var(--color-border-default); border-radius: var(--radius-sm); cursor: pointer; display: inline-flex;" aria-label="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </app-tooltip>
        <app-tooltip text="Duplicate" position="top">
          <button style="padding: 0.5rem; background: var(--color-bg-surface); color: var(--color-text-subtle); border: 1px solid var(--color-border-default); border-radius: var(--radius-sm); cursor: pointer; display: inline-flex;" aria-label="Duplicate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </app-tooltip>
        <app-tooltip text="Delete permanently" position="top">
          <button style="padding: 0.5rem; background: var(--color-bg-surface); color: var(--color-status-error); border: 1px solid var(--color-border-default); border-radius: var(--radius-sm); cursor: pointer; display: inline-flex;" aria-label="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </app-tooltip>
      </div>
    `,
  }),
};
