import type { Meta, StoryObj } from '@storybook/angular';
import { ColorShowcaseComponent } from './color-showcase.component';

const meta: Meta<ColorShowcaseComponent> = {
  title: 'Design Tokens/Colors',
  component: ColorShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Atlas Color System

The Atlas design system uses **OKLCH** (Lightness, Chroma, Hue) color space for perceptual uniformity and predictable color manipulation.

## Why OKLCH?
- **Perceptually uniform**: Equal numeric changes produce equal perceived changes
- **Predictable lightness**: Lightness value directly correlates to brightness
- **Better than HSL/RGB**: Avoids perceptual inconsistencies
- **Accessibility-friendly**: Works natively with APCA contrast tools

## Color Philosophy
Our palette balances **modern professionalism** with **approachable warmth**, inspired by cartography and navigation.

## Accessibility
All color combinations have been validated using APCA (Accessible Perceptual Contrast Algorithm):
- ✓ WCAG 2.1 Level AA compliant
- ✓ Minimum contrast ratios met for all text combinations
- ✓ Tested with color blindness simulators
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ColorShowcaseComponent>;

export const AllColors: Story = {
  render: () => ({
    props: {},
  }),
  parameters: {
    docs: {
      description: {
        story: 'Complete palette showing all Atlas design system colors organized by category.',
      },
    },
  },
};
