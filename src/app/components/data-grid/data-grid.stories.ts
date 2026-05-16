import { type Meta, type StoryObj } from '@storybook/angular';
import { DataGridComponent, GridRow } from './data-grid.component';
import {
  NAVY_GAMUT_ROWS,
  NAVY_GAMUT_HEADERS,
  BURGUNDY_GAMUT_ROWS,
  BURGUNDY_GAMUT_HEADERS,
  AZURE_GAMUT_ROWS,
  AZURE_GAMUT_HEADERS,
  PURPLE_GAMUT_ROWS,
  PURPLE_GAMUT_HEADERS,
} from '../tone-picker/gamut-data';

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
  title: 'Angular Components/Data Grid',
  component: DataGridComponent,
  tags: ['autodocs'],
  argTypes: {
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption (visible above the grid)' },
    showLabels: { control: 'boolean', type: { name: 'boolean' }, description: 'Show cell label text inside each cell' },
    hideHeaders: { control: 'boolean', type: { name: 'boolean' }, description: 'Visually hide row/column headers while keeping them in the DOM for AT' },
  },
  parameters: {
    docs: {
      description: {
        component: `
W3C APG-compliant data grid with full keyboard navigation (Pattern 2 — gridcell is the interactive unit).

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

For grids where cells contain interactive elements (buttons, links), use \`TonePickerComponent\` (Pattern 1) instead.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<DataGridComponent>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    caption: 'Design token colors',
    showLabels: true,
    hideHeaders: false,
  },
  render: (args) => ({
    props: {
      ...args,
      rows: TEXT_ROWS,
      columnHeaders: ['Token A', 'Token B', 'Token C', 'Token D'],
    },
  }),
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
    controls: { disable: true },
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
    controls: { disable: true },
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
    controls: { disable: true },
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
    controls: { disable: true },
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
    controls: { disable: true },
    docs: {
      description: {
        story:
          '9×7 gamut grid for purple (H 278.14). Purple-500 (L=0.60 C=0.21, brand anchor for `--color-highlight`) is pre-selected. Purple has the widest mid-range gamut of the four brand hues.',
      },
    },
  },
};
