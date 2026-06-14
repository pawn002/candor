import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const TOKEN_HEADERS = JSON.stringify(['Token A', 'Token B', 'Token C', 'Token D']);
const TOKEN_ROWS = JSON.stringify([
  { rowHeader: 'Backgrounds', cells: [
    { label: '--color-bg-page',     background: 'oklch(1 0 0)',        foreground: '#333' },
    { label: '--color-bg-surface',  background: 'oklch(0.91 0 0)',     foreground: '#333' },
    { label: '--color-bg-elevated', background: 'oklch(1 0 0)',        foreground: '#333' },
    { label: '--color-bg-inverse',  background: 'oklch(0.27 0.06 245)', foreground: '#fff' },
  ]},
  { rowHeader: 'Action', cells: [
    { label: '--color-action-primary',          background: 'oklch(0.27 0.06 245)', foreground: '#fff' },
    { label: '--color-action-secondary',        background: 'oklch(0.37 0.08 347)', foreground: '#fff' },
    { label: '--color-action-tertiary',         background: 'oklch(0.88 0.005 17)', foreground: '#333' },
    { label: '--color-action-destructive-text', background: 'oklch(0.37 0.15 347)', foreground: '#fff' },
  ]},
  { rowHeader: 'Status', cells: [
    { label: '--color-status-error',   background: 'oklch(0.55 0.22 25)',  foreground: '#fff' },
    { label: '--color-status-success', background: 'oklch(0.63 0.15 144)', foreground: '#fff' },
    { label: '--color-status-warning', background: 'oklch(0.66 0.16 54)',  foreground: '#333' },
    { label: '--color-focus',          background: 'oklch(0.65 0.18 251)', foreground: '#fff' },
  ]},
]);

const COL_HEADERS = JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
const GRID_ROWS = JSON.stringify([
  { rowHeader: '09:00', cells: [
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
    { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
  ]},
  { rowHeader: '12:00', cells: [
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff', selected: true },
    { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
  ]},
  { rowHeader: '15:00', cells: [
    { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000', disabled: true },
    { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
  ]},
]);

const meta: Meta = {
  title: 'Components/DataGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-data-grid>\` — W3C APG-compliant data grid with full keyboard navigation
(Pattern 2 — gridcell is the interactive unit).

**Keyboard interaction**

| Key | Action |
|---|---|
| Arrow keys | Move focus one cell in any direction |
| Home | First cell in current row |
| End | Last cell in current row |
| Ctrl+Home | First cell in grid |
| Ctrl+End | Last cell in grid |
| Enter / Space | Activate focused cell |
| Tab | Move focus into / out of the grid |

**ARIA roles:** \`role="grid"\` → \`role="row"\` → \`role="gridcell"\` /
\`role="columnheader"\` / \`role="rowheader"\`

Focus management uses the **roving tabindex** pattern — one cell holds \`tabindex="0"\` at
a time; arrow keys move the tab stop.

Pass \`rows\` and \`columnheaders\` via JS properties (or JSON-encoded as attributes). Each
cell has \`{ label, background, foreground, selected?, disabled? }\` — well-suited to
color-grid and heat-map use cases.
        `.trim(),
      },
    },
  },
  argTypes: {
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption (visible above the grid)' },
    showLabels: { control: 'boolean', type: { name: 'boolean' }, description: 'Show cell label text inside each cell' },
    hideHeaders: { control: 'boolean', type: { name: 'boolean' }, description: 'Visually hide row/column headers while keeping them in the DOM for AT' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<candor-data-grid caption="Heat map" column-headers='${COL_HEADERS}' rows='${GRID_ROWS}'></candor-data-grid>`,
};

export const ShowLabels: Story = {
  render: () => html`<candor-data-grid caption="Heat map" show-labels column-headers='${COL_HEADERS}' rows='${GRID_ROWS}'></candor-data-grid>`,
};

export const HideHeaders: Story = {
  render: () => html`<candor-data-grid caption="Heat map" hide-headers column-headers='${COL_HEADERS}' rows='${GRID_ROWS}'></candor-data-grid>`,
};

export const TokenSwatch: Story = {
  name: 'Token Swatch Grid',
  parameters: { controls: { disable: true } },
  render: () => html`<candor-data-grid caption="Design token colors" show-labels column-headers='${TOKEN_HEADERS}' rows='${TOKEN_ROWS}'></candor-data-grid>`,
};
