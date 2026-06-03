import type { Meta, StoryObj } from '@storybook/angular';
import './candor-tone-picker';
import {
  NAVY_GAMUT_ROWS,
  NAVY_GAMUT_HEADERS,
  BURGUNDY_GAMUT_ROWS,
  BURGUNDY_GAMUT_HEADERS,
  AZURE_GAMUT_ROWS,
  AZURE_GAMUT_HEADERS,
  INDIGO_GAMUT_ROWS,
  INDIGO_GAMUT_HEADERS,
} from './gamut-data';

const NAVY_ROWS = JSON.stringify(NAVY_GAMUT_ROWS);
const NAVY_HEADERS = JSON.stringify(NAVY_GAMUT_HEADERS);
const BURGUNDY_ROWS = JSON.stringify(BURGUNDY_GAMUT_ROWS);
const BURGUNDY_HEADERS = JSON.stringify(BURGUNDY_GAMUT_HEADERS);
const AZURE_ROWS = JSON.stringify(AZURE_GAMUT_ROWS);
const AZURE_HEADERS = JSON.stringify(AZURE_GAMUT_HEADERS);
const INDIGO_ROWS = JSON.stringify(INDIGO_GAMUT_ROWS);
const INDIGO_HEADERS = JSON.stringify(INDIGO_GAMUT_HEADERS);

const meta: Meta = {
  title: 'Components/TonePicker',
  tags: ['autodocs'],
  argTypes: {
    'aria-label': { control: 'text', description: 'Required. Labels the grid for screen readers. Set on the host — forwarded to [role="grid"] internally.' },
    caption: { control: 'text', type: { name: 'string' }, description: 'Fallback accessible label when no aria-label is set. Does not render a visible caption element.' },
    rows: { control: 'object', description: 'Array of { rowHeader?, cells: ToneCell[] }. Each cell: { label, value?: { l, c, h }, background?, disabled? }.' },
    columnHeaders: { control: 'object', description: 'Array of column header strings (C-axis labels). Attribute: column-headers.' },
    hideHeaders: { control: 'boolean', type: { name: 'boolean' }, description: 'Visually hide row/column headers while keeping them in the DOM for AT' },
    hideUi: { control: 'boolean', type: { name: 'boolean' }, description: 'Visually hide the preview swatch and hint text (live region stays in DOM for AT)' },
    size: { control: 'radio', options: ['normal', 'small'], type: { name: 'string' }, description: 'Button size — normal: 44px square, small: 22px square' },
    selectedValue: { control: 'text', type: { name: 'string' }, description: 'Pre-select a cell by oklch string (e.g. from a parent color state)' },
    'color-select': { control: false, description: 'CustomEvent fired on cell activation. detail: { value: string, row, col, l, c, h }.' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
\`<candor-tone-picker>\` — keyboard-navigable OKLCH gamut grid. Each cell represents a point in L × C space
at a fixed hue. In-gamut cells render as selectable color buttons; out-of-sRGB-gamut cells are blank.

**Keyboard interaction**

| Key | Action |
|---|---|
| Arrow keys | Move focus, skipping blank (OOG) cells |
| Home / End | First / last in-gamut cell in current row |
| Enter / Space | Select focused color |
| Tab | Move focus into / out of the grid |

**ARIA roles:** \`role="grid"\` wraps \`role="radio"\` cells inside a \`role="group"\`. Each radio carries
\`aria-setsize\` and \`aria-posinset\` based on the in-gamut count, so AT reads positional context that
matches what sighted users see.

Pass \`rows\` and \`column-headers\` as JSON-encoded attributes (or set the \`rows\` / \`columnHeaders\` JS
properties directly). Each cell has \`{ label, value: { l, c, h }, background?, foreground?, disabled? }\` —
\`disabled: true\` marks out-of-sRGB-gamut cells, which render as blank but stay in the DOM for grid semantics.

Selection dispatches a \`color-select\` CustomEvent with \`{ value, row, col, l, c, h }\` in \`detail\` —
\`value\` is the formatted \`oklch(L C H)\` string. Pass \`selected-value\` to pre-select a cell by oklch
string (matched on L and C, hue is implicit per grid).
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Navy H 245.34',
  parameters: {
    docs: {
      description: {
        story: 'Navy (H 245.34). Anchor at L=0.27 C=0.060 — navy-800, `--color-action-primary`.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-tone-picker
        aria-label="Navy H 245.34 — sRGB gamut"
        rows='${NAVY_ROWS}'
        column-headers='${NAVY_HEADERS}'>
      </candor-tone-picker>
    `,
  }),
};

export const PreSelected: Story = {
  name: 'Pre-selected value',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Demonstrates `selected-value` — pass an oklch string from a parent to mark the matching cell as selected without moving keyboard focus. Here navy-800 (`--color-action-primary`) is pre-selected on mount.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-tone-picker
        aria-label="Navy H 245.34 — sRGB gamut"
        selected-value="oklch(0.27 0.060 245.34)"
        rows='${NAVY_ROWS}'
        column-headers='${NAVY_HEADERS}'>
      </candor-tone-picker>
    `,
  }),
};

export const Burgundy: Story = {
  name: 'Burgundy H 347.43',
  parameters: {
    docs: {
      description: {
        story: 'Burgundy (H 347.43). Anchor at L=0.37 C=0.080 — burgundy-700, `--color-action-secondary`.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-tone-picker
        aria-label="Burgundy H 347.43 — sRGB gamut"
        rows='${BURGUNDY_ROWS}'
        column-headers='${BURGUNDY_HEADERS}'>
      </candor-tone-picker>
    `,
  }),
};

export const Azure: Story = {
  name: 'Azure H 250.80',
  parameters: {
    docs: {
      description: {
        story: 'Azure (H 250.80). Anchor at L=0.65 C=0.180 — azure-400, `--color-focus`.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-tone-picker
        aria-label="Azure H 250.80 — sRGB gamut"
        rows='${AZURE_ROWS}'
        column-headers='${AZURE_HEADERS}'>
      </candor-tone-picker>
    `,
  }),
};

export const Indigo: Story = {
  name: 'Indigo H 278.14',
  parameters: {
    docs: {
      description: {
        story: 'Indigo (H 278.14). Anchor at L=0.60 C=0.210 — indigo-500, `--color-highlight`. Widest mid-range gamut of the four brand hues.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-tone-picker
        aria-label="Indigo H 278.14 — sRGB gamut"
        rows='${INDIGO_ROWS}'
        column-headers='${INDIGO_HEADERS}'>
      </candor-tone-picker>
    `,
  }),
};

export const SmallSize: Story = {
  name: 'Small size',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Compact 22px buttons via `size="small"` — useful inside accordions, side panels, or examples where the picker is one element among many.',
      },
    },
  },
  render: () => ({
    template: `
      <candor-tone-picker
        aria-label="Indigo H 278.14 — compact"
        size="small"
        hide-headers
        hide-ui
        rows='${INDIGO_ROWS}'
        column-headers='${INDIGO_HEADERS}'>
      </candor-tone-picker>
    `,
  }),
};
