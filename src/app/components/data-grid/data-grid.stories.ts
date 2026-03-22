import { Component, signal } from '@angular/core';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DataGridComponent, GridCellActivateEvent, GridRow } from './data-grid.component';

// ─── Color picker demo ────────────────────────────────────────────────────────
// Generates an OKLCH color grid — L (lightness) as rows, C (chroma) as columns.
// Mirrors the use-case from the color-pair-quick-iterator tool.

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${h})`;
}

function buildColorGrid(
  hue: number,
  lSteps: number[],
  cSteps: number[],
  selectedL = -1,
  selectedC = -1,
): GridRow[] {
  return lSteps.map((l, rowIdx) => ({
    rowHeader: `L ${(l * 100).toFixed(0)}`,
    cells: cSteps.map((c, colIdx) => ({
      label: `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${hue}) — L=${(l * 100).toFixed(0)}% C=${c.toFixed(3)}`,
      value: { l, c, h: hue },
      background: oklch(l, c, hue),
      selected: rowIdx === selectedL && colIdx === selectedC,
    })),
  }));
}

const L_STEPS = [0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15];
const C_STEPS = [0.00, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18];
const C_HEADERS = C_STEPS.map((c) => `C ${c.toFixed(2)}`);

// ─── Wrapper component for interactive state ──────────────────────────────────

@Component({
  selector: 'story-color-picker',
  standalone: true,
  imports: [DataGridComponent],
  template: `
    <div style="font-family: var(--font-family-accessible); padding: 1.5rem; background: var(--color-bg-page);">
      <app-data-grid
        caption="OKLCH Color Picker — Hue 245 (Navy)"
        [rows]="rows()"
        [columnHeaders]="colHeaders"
        [hideHeaders]="true"
        (cellActivate)="onActivate($event)"
      />
      <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-text-subtle); letter-spacing: 0.02em;">
        Selected: <code style="font-family: var(--font-family-mono); background: var(--color-bg-surface); padding: 0.15em 0.4em; border-radius: 3px;">{{ selected() }}</code>
      </p>
      <p style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--color-text-subtle); letter-spacing: 0.02em;">
        Arrow keys navigate · Enter or Space selects · Home/End jump to row edges · Ctrl+Home/End jump to grid corners
      </p>
    </div>
  `,
})
class ColorPickerStory {
  colHeaders = C_HEADERS;
  selectedRow = signal(-1);
  selectedCol = signal(-1);

  rows = signal(buildColorGrid(245, L_STEPS, C_STEPS));

  selected = signal('none');

  onActivate(e: GridCellActivateEvent) {
    this.selectedRow.set(e.rowIndex);
    this.selectedCol.set(e.colIndex);
    this.rows.set(
      buildColorGrid(245, L_STEPS, C_STEPS, e.rowIndex, e.colIndex),
    );
    const v = e.cell.value as { l: number; c: number; h: number };
    this.selected.set(`oklch(${v.l.toFixed(2)} ${v.c.toFixed(3)} ${v.h})`);
  }
}

// ─── Simple text grid demo ────────────────────────────────────────────────────

const TEXT_ROWS: GridRow[] = [
  {
    rowHeader: 'Backgrounds',
    cells: [
      { label: '--color-bg-page', background: 'oklch(1 0 0)', foreground: '#333' },
      { label: '--color-bg-surface', background: 'oklch(0.91 0 0)', foreground: '#333' },
      { label: '--color-bg-elevated', background: 'oklch(1 0 0)', foreground: '#333' },
      { label: '--color-bg-inverse', background: 'oklch(0.27 0.06 245)', foreground: '#fff' },
    ],
  },
  {
    rowHeader: 'Action',
    cells: [
      { label: '--color-action-primary', background: 'oklch(0.27 0.06 245)', foreground: '#fff' },
      { label: '--color-action-secondary', background: 'oklch(0.37 0.08 347)', foreground: '#fff' },
      { label: '--color-action-tertiary', background: 'oklch(0.88 0.005 17)', foreground: '#333' },
      { label: '--color-action-destructive-text', background: 'oklch(0.37 0.15 347)', foreground: '#fff' },
    ],
  },
  {
    rowHeader: 'Status',
    cells: [
      { label: '--color-status-error', background: 'oklch(0.55 0.22 25)', foreground: '#fff' },
      { label: '--color-status-success', background: 'oklch(0.63 0.15 144)', foreground: '#fff' },
      { label: '--color-status-warning', background: 'oklch(0.66 0.16 54)', foreground: '#333' },
      { label: '--color-focus (azure-400)', background: 'oklch(0.65 0.18 251)', foreground: '#fff' },
    ],
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<DataGridComponent> = {
  title: 'Components/Data Grid',
  component: DataGridComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
W3C APG-compliant data grid with full keyboard navigation.

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

**ARIA roles:** \`role="grid"\` → \`role="row"\` → \`role="gridcell"\` / \`role="columnheader"\` / \`role="rowheader"\`

Focus management uses the **roving tabindex** pattern — one cell holds \`tabindex="0"\` at a time; arrow keys move the tab stop.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataGridComponent>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ColorPicker: Story = {
  name: 'Color Picker (OKLCH grid)',
  decorators: [moduleMetadata({ imports: [ColorPickerStory] })],
  render: () => ({
    template: `<story-color-picker></story-color-picker>`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'OKLCH color grid with L (lightness) as rows and C (chroma) as columns at hue 245 (navy). Matches the use-case from the color-pair-quick-iterator tool — a curated set of color variants navigable via keyboard without tabbing through every cell.',
      },
    },
  },
};

export const TokenSwatch: Story = {
  name: 'Token Swatch Grid',
  render: () => ({
    props: {
      rows: TEXT_ROWS,
      columnHeaders: ['Token A', 'Token B', 'Token C', 'Token D'],
      ariaLabel: 'Design token color swatches',
      showLabels: true,
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Grid of design-system token colors with visible labels. Demonstrates the `showLabels` input and `rowHeader` on each row.',
      },
    },
  },
};
