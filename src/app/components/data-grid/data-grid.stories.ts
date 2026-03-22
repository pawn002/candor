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

// ─── Brand color ramps ────────────────────────────────────────────────────────
// Exact OKLCH primitives from design-tokens/primitives.scss.
// Anchor cells (the semantic token mapping) are pre-selected.

const RAMP_HEADERS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

// Navy — H 245.34 — anchor: navy-800 → --color-action-primary
const NAVY_CELLS = [
  { l: 0.97, c: 0.01 }, { l: 0.93, c: 0.02 }, { l: 0.86, c: 0.04 }, { l: 0.76, c: 0.05 },
  { l: 0.64, c: 0.06 }, { l: 0.53, c: 0.06 }, { l: 0.44, c: 0.06 }, { l: 0.35, c: 0.06 },
  { l: 0.27, c: 0.06 }, { l: 0.19, c: 0.05 },
].map(({ l, c }, i) => {
  const step = RAMP_HEADERS[i];
  const color = `oklch(${l} ${c} 245.34)`;
  const isAnchor = i === 8; // navy-800
  return {
    label: isAnchor
      ? `navy-${step} · --color-action-primary · ${color}`
      : `navy-${step} · ${color}`,
    value: color,
    background: color,
    foreground: l > 0.5 ? 'oklch(0.2 0.02 245)' : 'oklch(0.97 0.01 245)',
    selected: isAnchor,
  };
});

// Burgundy — H 347.43 — anchor: burgundy-700 → --color-action-secondary
const BURGUNDY_CELLS = [
  { l: 0.97, c: 0.01 }, { l: 0.93, c: 0.03 }, { l: 0.86, c: 0.05 }, { l: 0.76, c: 0.06 },
  { l: 0.64, c: 0.07 }, { l: 0.52, c: 0.08 }, { l: 0.44, c: 0.08 }, { l: 0.37, c: 0.08 },
  { l: 0.28, c: 0.07 }, { l: 0.20, c: 0.05 },
].map(({ l, c }, i) => {
  const step = RAMP_HEADERS[i];
  const color = `oklch(${l} ${c} 347.43)`;
  const isAnchor = i === 7; // burgundy-700
  return {
    label: isAnchor
      ? `burgundy-${step} · --color-action-secondary · ${color}`
      : `burgundy-${step} · ${color}`,
    value: color,
    background: color,
    foreground: l > 0.5 ? 'oklch(0.2 0.02 347)' : 'oklch(0.97 0.01 347)',
    selected: isAnchor,
  };
});

// Azure — H 250.80 — anchor #1: azure-400 → --color-focus; anchor #2: azure-500 → --color-link
const AZURE_CELLS = [
  { l: 0.97, c: 0.02 }, { l: 0.93, c: 0.05 }, { l: 0.86, c: 0.10 }, { l: 0.77, c: 0.15 },
  { l: 0.65, c: 0.18 }, { l: 0.53, c: 0.18 }, { l: 0.45, c: 0.17 }, { l: 0.37, c: 0.14 },
  { l: 0.28, c: 0.10 }, { l: 0.20, c: 0.06 },
].map(({ l, c }, i) => {
  const step = RAMP_HEADERS[i];
  const color = `oklch(${l} ${c} 250.80)`;
  const isAnchor = i === 3; // azure-400 → --color-focus (semantic anchor)
  return {
    label: i === 3
      ? `azure-${step} · --color-focus · ${color}`
      : i === 4
        ? `azure-${step} · --color-link · ${color}`
        : `azure-${step} · ${color}`,
    value: color,
    background: color,
    foreground: l > 0.5 ? 'oklch(0.2 0.04 251)' : 'oklch(0.97 0.02 251)',
    selected: isAnchor,
  };
});

// Purple — H 278.14 — anchor: purple-500 → brand anchor (#6969F7); purple-600 → --color-highlight
const PURPLE_CELLS = [
  { l: 0.97, c: 0.02 }, { l: 0.93, c: 0.05 }, { l: 0.86, c: 0.10 }, { l: 0.77, c: 0.15 },
  { l: 0.68, c: 0.18 }, { l: 0.60, c: 0.21 }, { l: 0.56, c: 0.21 }, { l: 0.47, c: 0.20 },
  { l: 0.37, c: 0.17 }, { l: 0.27, c: 0.13 },
].map(({ l, c }, i) => {
  const step = RAMP_HEADERS[i];
  const color = `oklch(${l} ${c} 278.14)`;
  const isAnchor = i === 4; // purple-500 brand anchor
  return {
    label: i === 4
      ? `purple-${step} · brand anchor · ${color}`
      : i === 5
        ? `purple-${step} · --color-highlight · ${color}`
        : `purple-${step} · ${color}`,
    value: color,
    background: color,
    foreground: l > 0.55 ? 'oklch(0.2 0.05 278)' : 'oklch(0.97 0.02 278)',
    selected: isAnchor,
  };
});

const NAVY_ROWS: GridRow[] = [{ rowHeader: 'Navy', cells: NAVY_CELLS }];
const BURGUNDY_ROWS: GridRow[] = [{ rowHeader: 'Burgundy', cells: BURGUNDY_CELLS }];
const BRAND_ROWS: GridRow[] = [
  { rowHeader: 'Navy', cells: NAVY_CELLS },
  { rowHeader: 'Burgundy', cells: BURGUNDY_CELLS },
  { rowHeader: 'Azure', cells: AZURE_CELLS },
  { rowHeader: 'Purple', cells: PURPLE_CELLS },
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

export const NavyRamp: Story = {
  name: 'Navy Ramp',
  render: () => ({
    props: {
      rows: NAVY_ROWS,
      columnHeaders: RAMP_HEADERS,
      caption: 'Navy — H 245.34',
      hideHeaders: false,
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All 10 navy primitive steps (50–900). Navy-800 is pre-selected — it maps to `--color-action-primary`. Column headers show the tonal step number.',
      },
    },
  },
};

export const BurgundyRamp: Story = {
  name: 'Burgundy Ramp',
  render: () => ({
    props: {
      rows: BURGUNDY_ROWS,
      columnHeaders: RAMP_HEADERS,
      caption: 'Burgundy — H 347.43',
      hideHeaders: false,
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All 10 burgundy primitive steps (50–900). Burgundy-700 is pre-selected — it maps to `--color-action-secondary`.',
      },
    },
  },
};

export const BrandPalette: Story = {
  name: 'Brand Palette',
  render: () => ({
    props: {
      rows: BRAND_ROWS,
      columnHeaders: RAMP_HEADERS,
      caption: 'Brand Palette — Navy · Burgundy · Azure · Purple',
      hideHeaders: false,
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'All four Candor brand ramps side-by-side. Semantic anchor cells are pre-selected: navy-800 (`--color-action-primary`), burgundy-700 (`--color-action-secondary`), azure-400 (`--color-focus`), and purple-500 (brand anchor for `--color-highlight`).',
      },
    },
  },
};
