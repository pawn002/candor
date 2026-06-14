import React from 'react';
import { html } from 'lit';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

interface SpacingItem {
  name: string;
  value: string;
  pixels: string;
}

const SPACINGS: SpacingItem[] = [
  { name: '2xs', value: '0.25rem', pixels: '4px' },
  { name: 'xs', value: '0.5rem', pixels: '8px' },
  { name: 'sm', value: '1rem', pixels: '16px' },
  { name: 'md', value: '1.5rem', pixels: '24px' },
  { name: 'lg', value: '2rem', pixels: '32px' },
  { name: 'xl', value: '3rem', pixels: '48px' },
  { name: '2xl', value: '4rem', pixels: '64px' },
  { name: '3xl', value: '6rem', pixels: '96px' },
];

const renderShowcase = () => html`
  <div style="
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background-color: var(--color-bg-page);
  ">
    ${SPACINGS.map(s => html`
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
          border: var(--border-width-thin) solid var(--color-border-default);
          border-radius: var(--radius-sm);
        ">
          <div style="height: 100%; background-color: var(--color-action-primary); opacity: 0.3; border-radius: var(--radius-sm); width: ${s.value};"></div>
        </div>
      </div>
    `)}
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
| \`--spacing-2xs\` | 0.25rem | 4 |
| \`--spacing-xs\` | 0.5rem | 8 |
| \`--spacing-sm\` | 1rem | 16 |
| \`--spacing-md\` | 1.5rem | 24 |
| \`--spacing-lg\` | 2rem | 32 |
| \`--spacing-xl\` | 3rem | 48 |
| \`--spacing-2xl\` | 4rem | 64 |
| \`--spacing-3xl\` | 6rem | 96 |

**Why 8px?** Most screen sizes divide evenly by 8, and common component dimensions (icon
sizes, input heights, button heights) land naturally on 8px multiples. A shared base keeps
components visually aligned without manual negotiation.

**Why these steps?** The scale has two distinct zones. The compact end (2xs → xs → sm)
doubles at each step — fine-grained control for internal component spacing like gaps between
an icon and its label. The large end (md → lg → xl → 2xl → 3xl) grows more gradually —
these are layout-scale values for section padding, card gaps, and page margins where the
difference between adjacent steps needs to feel intentional rather than incremental.
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
  render: () => renderShowcase(),
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
  render: () => html`
    <div style="max-width: 600px; display: flex; flex-direction: column; gap: var(--spacing-xl);">

      <div>
        <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin: 0 0 var(--spacing-xs);">Tight — spacing-xs (8px)</p>
        <div style="display: flex; gap: var(--spacing-xs); flex-wrap: wrap;">
          <candor-chip label="Item 1"></candor-chip>
          <candor-chip label="Item 2"></candor-chip>
          <candor-chip label="Item 3"></candor-chip>
        </div>
      </div>

      <div>
        <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin: 0 0 var(--spacing-xs);">Compact — spacing-sm (16px)</p>
        <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
          <candor-button variant="primary">Save changes</candor-button>
          <candor-button variant="secondary">Preview</candor-button>
          <candor-button variant="ghost">Cancel</candor-button>
        </div>
      </div>

      <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0; border-left: var(--border-width-medium) solid var(--color-border-default); padding-left: var(--spacing-sm);">Above this line, tokens govern spacing <em>within</em> components — the gap between a chip and its neighbour, the distance between buttons in a toolbar. Below, they govern spacing <em>between</em> components at layout scale: card padding, card grids, and page margins. The same token system, two distinct domains.</p>

      <div>
        <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin: 0 0 var(--spacing-xs);">Comfortable — spacing-md (24px)</p>
        <div style="display: flex; gap: var(--spacing-md);">
          <candor-card variant="default" padding="md" style="flex: 1;">
            <candor-stat value="2,847" label="Active users" size="lg"></candor-stat>
          </candor-card>
          <candor-card variant="default" padding="md" style="flex: 1;">
            <candor-stat value="94%" label="Uptime" color="success" size="lg"></candor-stat>
          </candor-card>
          <candor-card variant="default" padding="md" style="flex: 1;">
            <candor-stat value="138" label="Open tickets" size="lg"></candor-stat>
          </candor-card>
        </div>
      </div>

      <div>
        <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin: 0 0 var(--spacing-xs);">Loose — spacing-xl (48px)</p>
        <div style="display: flex; gap: var(--spacing-xl);">
          <candor-card variant="default" padding="lg" style="flex: 1;">
            <candor-stat value="2,847" label="Active users" size="lg"></candor-stat>
          </candor-card>
          <candor-card variant="default" padding="lg" style="flex: 1;">
            <candor-stat value="94%" label="Uptime" color="success" size="lg"></candor-stat>
          </candor-card>
          <candor-card variant="default" padding="lg" style="flex: 1;">
            <candor-stat value="138" label="Open tickets" size="lg"></candor-stat>
          </candor-card>
        </div>
      </div>

    </div>
  `,
};
