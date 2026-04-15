import type { Meta, StoryObj } from '@storybook/angular';
import { SpacingShowcaseComponent } from './spacing-showcase.component';

const meta: Meta<SpacingShowcaseComponent> = {
  title: 'Design Tokens/Spacing',
  component: SpacingShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Candor's spacing scale is built on an **8px grid**. Every step is a named semantic token —
use these instead of raw pixel or rem values in components and layouts.

| Token | Value | px |
|---|---|---|
| \`--spacing-2xs\` | 0.25rem | 4px |
| \`--spacing-xs\` | 0.5rem | 8px |
| \`--spacing-sm\` | 1rem | 16px |
| \`--spacing-md\` | 1.5rem | 24px |
| \`--spacing-lg\` | 2rem | 32px |
| \`--spacing-xl\` | 3rem | 48px |
| \`--spacing-2xl\` | 4rem | 64px |
| \`--spacing-3xl\` | 6rem | 96px |

The scale doubles at the compact end (2xs → xs → sm) and widens at the large end to give components room to breathe at layout scale. The bars below are proportional — each bar's width equals the spacing value it represents.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<SpacingShowcaseComponent>;

export const SpacingScale: Story = {
  name: 'Scale',
  parameters: {
    docs: {
      description: {
        story: 'Full spacing scale — token name, rem value, and pixel equivalent. Bar widths are proportional to the spacing value.',
      },
    },
  },
  render: () => ({
    template: `<app-spacing-showcase></app-spacing-showcase>`,
  }),
};

export const SpacingInComponents: Story = {
  name: 'Applied Example',
  parameters: {
    docs: {
      description: {
        story: 'The same token scale applied at three densities. Use `--spacing-xs` for tight inline groups, `--spacing-md` for comfortable component padding, `--spacing-xl` for section-level layout gaps.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 600px; display: flex; flex-direction: column; gap: var(--spacing-xl);">

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-xs);">Tight — spacing-xs (8px)</p>
          <div style="display: flex; gap: var(--spacing-xs);">
            <div style="padding: var(--spacing-xs) var(--spacing-sm); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 1</div>
            <div style="padding: var(--spacing-xs) var(--spacing-sm); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 2</div>
            <div style="padding: var(--spacing-xs) var(--spacing-sm); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 3</div>
          </div>
        </div>

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-xs);">Comfortable — spacing-md (24px)</p>
          <div style="display: flex; gap: var(--spacing-md);">
            <div style="padding: var(--spacing-md); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 1</div>
            <div style="padding: var(--spacing-md); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 2</div>
            <div style="padding: var(--spacing-md); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 3</div>
          </div>
        </div>

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-xs);">Loose — spacing-xl (48px)</p>
          <div style="display: flex; gap: var(--spacing-xl);">
            <div style="padding: var(--spacing-lg); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 1</div>
            <div style="padding: var(--spacing-lg); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 2</div>
            <div style="padding: var(--spacing-lg); background: var(--color-bg-surface); border-radius: var(--radius-sm); font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default);">Item 3</div>
          </div>
        </div>

      </div>
    `,
  }),
};
