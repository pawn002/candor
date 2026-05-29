import React from 'react';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/angular';

interface SpacingItem {
  name: string;
  value: string;
  pixels: string;
}

const SPACINGS: SpacingItem[] = [
  { name: 'xs', value: '0.5rem', pixels: '8px' },
  { name: 'sm', value: '1rem', pixels: '16px' },
  { name: 'md', value: '1.5rem', pixels: '24px' },
  { name: 'lg', value: '2rem', pixels: '32px' },
  { name: 'xl', value: '3rem', pixels: '48px' },
  { name: '2xl', value: '4rem', pixels: '64px' },
  { name: '3xl', value: '6rem', pixels: '96px' },
];

const renderShowcase = () => `
  <div style="
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background-color: var(--color-bg-page);
  ">
    ${SPACINGS.map(s => `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-size: var(--font-size-md); font-weight: var(--font-weight-bold); color: var(--color-text-default); font-family: var(--font-family-mono);">${s.name}</span>
          <span style="font-size: var(--font-size-sm); color: var(--color-text-subtle); font-family: var(--font-family-mono);">${s.value} / ${s.pixels}</span>
        </div>
        <div style="
          position: relative;
          height: 40px;
          background: repeating-linear-gradient(
            90deg,
            var(--color-bg-surface) 0px,
            var(--color-bg-surface) 7px,
            transparent 7px,
            transparent 8px
          );
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-sm);
        ">
          <div style="height: 100%; background-color: var(--color-action-primary); opacity: 0.3; border-radius: var(--radius-sm); width: ${s.value};"></div>
        </div>
      </div>
    `).join('')}
  </div>
`;

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () => React.createElement(React.Fragment, null,
        React.createElement(Title, null),
        React.createElement(Description, null),
        React.createElement(Stories, { includePrimary: true })
      ),
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

The scale doubles at the compact end (2xs → xs → sm) and widens at the large end to give
components room to breathe at layout scale. The bars below are proportional — each bar's
width equals the spacing value it represents.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SpacingScale: Story = {
  name: 'Scale',
  parameters: {
    docs: {
      description: {
        story: 'Full spacing scale — token name, rem value, and pixel equivalent. Bar widths are proportional to the spacing value.',
      },
    },
  },
  render: () => ({ template: renderShowcase() }),
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
