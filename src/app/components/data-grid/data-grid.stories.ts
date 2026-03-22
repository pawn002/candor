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

// ─── Brand gamut grids (via cpqi variants --light-steps 9 --chroma-steps 7) ───
//
// Rows = Lightness steps, columns = Chroma steps, hue fixed per brand family.
// Cells where inGamut=false are outside sRGB — cpqi returned no hex value.
// The browser clamps their OKLCH background to the nearest in-gamut color;
// disabled=true dims them so the gamut boundary reads visually.

function buildGamutRows(
  grid: Array<Array<{ l: number; c: number; h: number; ig: boolean }>>,
  anchorL: number,
  anchorC: number,
): GridRow[] {
  return grid.map((row) => ({
    rowHeader: `L ${row[0].l.toFixed(2)}`,
    cells: row.map(({ l, c, h, ig }) => {
      const isAnchor = Math.abs(l - anchorL) < 0.001 && Math.abs(c - anchorC) < 0.001;
      return {
        label: ig
          ? isAnchor
            ? `L=${l.toFixed(2)} C=${c.toFixed(3)} — anchor`
            : `L=${l.toFixed(2)} C=${c.toFixed(3)}`
          : `L=${l.toFixed(2)} C=${c.toFixed(3)} — out of gamut`,
        value: ig ? { l, c, h } : undefined,
        background: `oklch(${l} ${c} ${h})`,
        foreground: l > 0.5 ? `oklch(0.2 0.04 ${h})` : `oklch(0.95 0.01 ${h})`,
        selected: isAnchor,
        disabled: !ig,
      };
    }),
  }));
}

// Navy — H 245.34
// Anchor: L=0.27 C=0.060 (navy-800 → --color-action-primary)
const NAVY_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9367, 0.8256, 0.7144, 0.6033, 0.4922, 0.3811, 0.2700, 0.1589, 0.0478];
    const C = [0.0129, 0.0600, 0.1071, 0.1543, 0.2014, 0.2486, 0.2957];
    const IG = [
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 245.34, ig: !!IG[ri][ci] })));
  })(),
  0.27, 0.06,
);
const NAVY_GAMUT_HEADERS = ['C 0.013', 'C 0.060', 'C 0.107', 'C 0.154', 'C 0.201', 'C 0.249', 'C 0.296'];

// Burgundy — H 347.43
// Anchor: L=0.37 C=0.080 (burgundy-700 → --color-action-secondary)
const BURGUNDY_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9256, 0.8144, 0.7033, 0.5922, 0.4811, 0.3700, 0.2589, 0.1478, 0.0367];
    const C = [0.0329, 0.0800, 0.1271, 0.1743, 0.2214, 0.2686, 0.3157];
    const IG = [
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 347.43, ig: !!IG[ri][ci] })));
  })(),
  0.37, 0.08,
);
const BURGUNDY_GAMUT_HEADERS = ['C 0.033', 'C 0.080', 'C 0.127', 'C 0.174', 'C 0.221', 'C 0.269', 'C 0.316'];

// Azure — H 250.80
// Anchor: L=0.65 C=0.180 (azure-400 → --color-focus)
const AZURE_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9833, 0.8722, 0.7611, 0.6500, 0.5389, 0.4278, 0.3167, 0.2056, 0.0944];
    const C = [0.0386, 0.0857, 0.1329, 0.1800, 0.2271, 0.2743, 0.3214];
    const IG = [
      [0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 250.80, ig: !!IG[ri][ci] })));
  })(),
  0.65, 0.18,
);
const AZURE_GAMUT_HEADERS = ['C 0.039', 'C 0.086', 'C 0.133', 'C 0.180', 'C 0.227', 'C 0.274', 'C 0.321'];

// Purple — H 278.14
// Anchor: L=0.60 C=0.210 (purple-500, brand anchor → --color-highlight)
const PURPLE_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.9333, 0.8222, 0.7111, 0.6000, 0.4889, 0.3778, 0.2667, 0.1556, 0.0444];
    const C = [0.0214, 0.0686, 0.1157, 0.1629, 0.2100, 0.2571, 0.3043];
    const IG = [
      [1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 278.14, ig: !!IG[ri][ci] })));
  })(),
  0.60, 0.21,
);
const PURPLE_GAMUT_HEADERS = ['C 0.021', 'C 0.069', 'C 0.116', 'C 0.163', 'C 0.210', 'C 0.257', 'C 0.304'];


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

export const NavyGamut: Story = {
  name: 'Navy Gamut (L × C)',
  render: () => ({
    props: {
      rows: NAVY_GAMUT_ROWS,
      columnHeaders: NAVY_GAMUT_HEADERS,
      caption: 'Navy H 245.34 — sRGB gamut',
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '9×7 gamut grid for navy (H 245.34). Rows sweep Lightness (light→dark), columns sweep Chroma (low→high). Dimmed cells fall outside sRGB — the browser clamps their OKLCH value to the nearest in-gamut color. Navy-800 (L=0.27 C=0.06, `--color-action-primary`) is pre-selected.',
      },
    },
  },
};

export const BurgundyGamut: Story = {
  name: 'Burgundy Gamut (L × C)',
  render: () => ({
    props: {
      rows: BURGUNDY_GAMUT_ROWS,
      columnHeaders: BURGUNDY_GAMUT_HEADERS,
      caption: 'Burgundy H 347.43 — sRGB gamut',
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '9×7 gamut grid for burgundy (H 347.43). Burgundy-700 (L=0.37 C=0.08, `--color-action-secondary`) is pre-selected. Burgundy has notably wider gamut at mid-lightness than navy.',
      },
    },
  },
};

export const AzureGamut: Story = {
  name: 'Azure Gamut (L × C)',
  render: () => ({
    props: {
      rows: AZURE_GAMUT_ROWS,
      columnHeaders: AZURE_GAMUT_HEADERS,
      caption: 'Azure H 250.80 — sRGB gamut',
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '9×7 gamut grid for azure (H 250.80). Azure-400 (L=0.65 C=0.18, `--color-focus`) is pre-selected. Note that the extreme light (L≈0.98) and extreme dark (L≈0.09) rows are entirely out of gamut.',
      },
    },
  },
};

export const PurpleGamut: Story = {
  name: 'Purple Gamut (L × C)',
  render: () => ({
    props: {
      rows: PURPLE_GAMUT_ROWS,
      columnHeaders: PURPLE_GAMUT_HEADERS,
      caption: 'Purple H 278.14 — sRGB gamut',
    } satisfies Partial<DataGridComponent>,
  }),
  parameters: {
    docs: {
      description: {
        story:
          '9×7 gamut grid for purple (H 278.14). Purple-500 (L=0.60 C=0.21, brand anchor for `--color-highlight`) is pre-selected. Purple has the widest mid-range gamut of the four brand hues.',
      },
    },
  },
};
