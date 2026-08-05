import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { requireTokenValue } from '../../design-tokens/token-values';

// Backgrounds are read from audit/tokens.dtcg.json, never copied. These cells
// are labelled with the token name, so a copied value turns the demo into a
// lie the moment the token moves — which is what happened: this table painted
// `oklch(0.63 0.15 144)` as `--color-status-success` long after the token had
// moved to L=0.55 (#223).
//
// No `foreground` is passed. It used to carry a per-swatch label colour chosen
// for legibility, and for four of these twelve no such colour exists. White is
// the best available on each of the three status fills, and it is not enough
// against the 6.5 floor this label carries:
//   `#ffffff` reaches OKCA 4.4 on status-error
//   `#ffffff` reaches OKCA 4.2 on status-success
//   `#ffffff` reaches OKCA 4.4 on status-warning
// `--color-focus` is worse than close. klar reports `unreachable`: no colour
// whatsoever clears even 4.5 against it, at black or white, so there was never
// a label colour to pick. The label now carries its own opaque plate from the
// component, so its contrast no longer depends on the swatch at all (#229).
const swatch = (variable: string) => ({
  label: variable,
  background: requireTokenValue('light', variable),
});

const TOKEN_HEADERS = JSON.stringify(['Token A', 'Token B', 'Token C', 'Token D']);
const TOKEN_ROWS = JSON.stringify([
  { rowHeader: 'Backgrounds', cells: [
    swatch('--color-bg-page'),
    swatch('--color-bg-surface'),
    swatch('--color-bg-elevated'),
    swatch('--color-bg-inverse'),
  ]},
  { rowHeader: 'Action', cells: [
    swatch('--color-action-primary'),
    swatch('--color-action-secondary'),
    swatch('--color-action-tertiary'),
    swatch('--color-action-destructive-text'),
  ]},
  { rowHeader: 'Status', cells: [
    swatch('--color-status-error'),
    swatch('--color-status-success'),
    swatch('--color-status-warning'),
    swatch('--color-focus'),
  ]},
]);

const COL_HEADERS = JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
const GRID_ROWS = JSON.stringify([
  { rowHeader: '09:00', cells: [
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
    { label: 'High', background: 'oklch(0.55 0.15 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
  ]},
  { rowHeader: '12:00', cells: [
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'High', background: 'oklch(0.55 0.15 150)', foreground: '#fff', selected: true },
    { label: 'High', background: 'oklch(0.55 0.15 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
  ]},
  { rowHeader: '15:00', cells: [
    { label: 'High', background: 'oklch(0.55 0.15 150)', foreground: '#fff' },
    { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
    { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000', disabled: true },
    { label: 'High', background: 'oklch(0.55 0.15 150)', foreground: '#fff' },
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
  // Taller cells than the default 2.5rem. The label plate is centred and these
  // names run to 24 characters, so at the default height the plate fills the
  // cell and the swatch survives only as a rim — which defeats a demo whose
  // subject is the colour. The heat map needs no such override: "High"/"Med"
  // are short enough that the plate stays small and the fill dominates.
  render: () => html`<candor-data-grid
    caption="Design token colors"
    show-labels
    style="--candor-data-grid-cell-min-height: 4.5rem;"
    column-headers='${TOKEN_HEADERS}'
    rows='${TOKEN_ROWS}'></candor-data-grid>`,
};
