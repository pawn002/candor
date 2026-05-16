import type { Meta, StoryObj } from '@storybook/angular';
import { TonePickerComponent } from './tone-picker.component';
import {
  NAVY_GAMUT_ROWS,
  NAVY_GAMUT_HEADERS,
  BURGUNDY_GAMUT_ROWS,
  BURGUNDY_GAMUT_HEADERS,
  AZURE_GAMUT_ROWS,
  AZURE_GAMUT_HEADERS,
  PURPLE_GAMUT_ROWS,
  PURPLE_GAMUT_HEADERS,
} from './gamut-data';

const meta: Meta<TonePickerComponent> = {
  title: 'Angular Components/Tone Picker',
  component: TonePickerComponent,
  tags: ['autodocs'],
  argTypes: {
    rows: { table: { disable: true } },
    columnHeaders: { table: { disable: true } },
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption' },
    ariaLabel: { control: 'text', type: { name: 'string' }, description: 'aria-label for the grid element' },
    hideHeaders: { control: 'boolean', type: { name: 'boolean' }, description: 'Visually hide row/column headers while keeping them in the DOM for AT' },
    hideUi: { control: 'boolean', type: { name: 'boolean' }, description: 'Visually hide the preview swatch and hint text (live region stays in DOM for AT)' },
    size: { control: 'radio', options: ['normal', 'small'], type: { name: 'string' }, description: 'Button size — normal: 44px square, small: 22px square' },
    selectedValue: { control: 'text', type: { name: 'string' }, description: 'Pre-select a cell by oklch string (e.g. from a parent color state)' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Keyboard-navigable OKLCH gamut grid. Each cell represents a point in L × C space at a fixed hue.
In-gamut cells render as selectable color buttons; out-of-sRGB-gamut cells are blank.

**Keyboard interaction**
| Key | Action |
|---|---|
| Arrow keys | Move focus, skipping blank (OOG) cells |
| Home / End | First / last in-gamut cell in current row |
| Enter / Space | Select focused color |
| Tab | Move focus into / out of the grid |

Selection emits an \`oklch(L C H)\` string via \`colorSelect\` output.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<TonePickerComponent>;

export const Default: Story = {
  name: 'Navy H 245.34',
  args: {
    rows: NAVY_GAMUT_ROWS,
    columnHeaders: NAVY_GAMUT_HEADERS,
    ariaLabel: 'Navy H 245.34 — sRGB gamut',
    hideHeaders: false,
    hideUi: false,
    size: 'normal',
    selectedValue: null,
  },
  render: (args) => ({
    props: {
      ...args,
      colorSelect: (value: string) => console.log('colorSelect:', value),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Navy (H 245.34). Anchor at L=0.27 C=0.060 — navy-800, `--color-action-primary`.',
      },
    },
  },
};

export const PreSelected: Story = {
  name: 'Pre-selected value',
  render: () => ({
    props: {
      rows: NAVY_GAMUT_ROWS,
      columnHeaders: NAVY_GAMUT_HEADERS,
      ariaLabel: 'Navy H 245.34 — sRGB gamut',
      selectedValue: 'oklch(0.27 0.060 245.34)',
      colorSelect: (value: string) => console.log('colorSelect:', value),
    },
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Demonstrates `selectedValue` — pass an oklch string from a parent to mark the matching cell as selected without moving keyboard focus. Here navy-800 (`--color-action-primary`) is pre-selected on mount.',
      },
    },
  },
};

export const Burgundy: Story = {
  name: 'Burgundy H 347.43',
  args: {
    rows: BURGUNDY_GAMUT_ROWS,
    columnHeaders: BURGUNDY_GAMUT_HEADERS,
    ariaLabel: 'Burgundy H 347.43 — sRGB gamut',
  },
  render: (args) => ({
    props: {
      ...args,
      colorSelect: (value: string) => console.log('colorSelect:', value),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Burgundy (H 347.43). Anchor at L=0.37 C=0.080 — burgundy-700, `--color-action-secondary`.',
      },
    },
  },
};

export const Azure: Story = {
  name: 'Azure H 250.80',
  args: {
    rows: AZURE_GAMUT_ROWS,
    columnHeaders: AZURE_GAMUT_HEADERS,
    ariaLabel: 'Azure H 250.80 — sRGB gamut',
  },
  render: (args) => ({
    props: {
      ...args,
      colorSelect: (value: string) => console.log('colorSelect:', value),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Azure (H 250.80). Anchor at L=0.65 C=0.180 — azure-400, `--color-focus`.',
      },
    },
  },
};

export const Purple: Story = {
  name: 'Purple H 278.14',
  args: {
    rows: PURPLE_GAMUT_ROWS,
    columnHeaders: PURPLE_GAMUT_HEADERS,
    ariaLabel: 'Purple H 278.14 — sRGB gamut',
  },
  render: (args) => ({
    props: {
      ...args,
      colorSelect: (value: string) => console.log('colorSelect:', value),
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Purple (H 278.14). Anchor at L=0.60 C=0.210 — purple-500, `--color-highlight`. Widest mid-range gamut of the four brand hues.',
      },
    },
  },
};
