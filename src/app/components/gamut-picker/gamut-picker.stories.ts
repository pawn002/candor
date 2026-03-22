import type { Meta, StoryObj } from '@storybook/angular';
import { GamutPickerComponent } from './gamut-picker.component';
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

const meta: Meta<GamutPickerComponent> = {
  title: 'Components/Gamut Picker',
  component: GamutPickerComponent,
  tags: ['autodocs'],
  argTypes: {
    rows: { table: { disable: true } },
    columnHeaders: { table: { disable: true } },
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption' },
    ariaLabel: { control: 'text', type: { name: 'string' }, description: 'aria-label for the grid element' },
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
type Story = StoryObj<GamutPickerComponent>;

export const Default: Story = {
  name: 'Navy H 245.34',
  args: {
    rows: NAVY_GAMUT_ROWS,
    columnHeaders: NAVY_GAMUT_HEADERS,
    ariaLabel: 'Navy H 245.34 — sRGB gamut',
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
