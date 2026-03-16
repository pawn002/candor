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
# Color System

Colors use **OKLCH** (Lightness, Chroma, Hue) for perceptual uniformity and predictable manipulation.

## Two-tier architecture
- **Primitives** — raw ramps (navy-800, burgundy-700, azure-400, …) in \`primitives.scss\`
- **Semantics** — role-based tokens (--color-action-primary, --color-text-default, …) in \`semantics.scss\`

Components reference semantic tokens only.

## Brand palette
- **Navy** \`#082840\` — primary action (15.2:1 with white)
- **Burgundy** \`#5F2B48\` — secondary action (10.4:1 with white)
- **Azure** \`#1493FB\` — accent / link (decorative on white; accessible step at azure-500)
- **Purple** \`#6969F7\` — highlight (decorative; accessible step at purple-600, 4.6:1)

## Accessibility
All action and text tokens meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
Validated with \`cpqi contrast\`.
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
        story: 'Complete palette showing all personal brand colors organized by semantic role.',
      },
    },
  },
};
