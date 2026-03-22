import type { Meta, StoryObj } from '@storybook/angular';
import { TypographyShowcaseComponent } from './typography-showcase.component';

const meta: Meta<TypographyShowcaseComponent> = {
  title: 'Design Tokens/Typography',
  component: TypographyShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Four-voice typographic system aligned to two cognitive modes:

- **Execution** (task completion, navigation, scanning): Roboto Flex, Roboto Mono, Atkinson Hyperlegible
- **Interpretation** (reading, reflecting, conversing): Noto Serif, Noto Sans

Type scale uses a **Major Third ratio (1.25×)** from a 1rem (16px) base. Minimum readable text size is 14px (\`--font-size-sm\`). \`--font-size-xs\` (12px) is for decorative and non-text use only.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<TypographyShowcaseComponent>;

export const Default: Story = {
  render: () => ({}),
};
