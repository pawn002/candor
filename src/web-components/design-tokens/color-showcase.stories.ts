import React from 'react';
import { html } from 'lit';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

interface ColorSwatch {
  name: string;
  variable: string;
  description: string;
  light?: string;
  dark?: string;
}

interface ColorCategory {
  name: string;
  description: string;
  colors: ColorSwatch[];
}

const COLOR_CATEGORIES: ColorCategory[] = [
  {
    name: 'Backgrounds',
    description: 'Surface hierarchy — page floor, card surface, subtle interactive fill, elevated (shadow-lifted), and inverse',
    colors: [
      { name: 'Page', variable: '--color-bg-page', description: 'Page floor', light: 'oklch(1 0 0)', dark: 'oklch(0.16 0.02 248.99)' },
      { name: 'Surface', variable: '--color-bg-surface', description: 'Cards and panels', light: 'oklch(0.91 0 0)', dark: 'oklch(0.24 0.03 248.99)' },
      { name: 'Subtle', variable: '--color-bg-subtle', description: 'Subtle interactive fill — hover rows, selection, hover chips. One step beyond surface; direction flips per theme', light: 'oklch(0.88 0.005 17.2)', dark: 'oklch(0.32 0.03 249)' },
      { name: 'Elevated', variable: '--color-bg-elevated', description: 'Shadow-lifted surface', light: 'oklch(1 0 0)', dark: 'oklch(0.30 0.02 248)' },
      { name: 'Inverse', variable: '--color-bg-inverse', description: 'Dark inverse surface — flips in dark mode', light: 'oklch(0.27 0.06 245.34)', dark: 'oklch(1 0 0)' },
    ],
  },
  {
    name: 'Borders & Focus',
    description: 'Separators, control outlines, and focus indicators',
    colors: [
      { name: 'Default', variable: '--color-border-default', description: 'Subtle separator', light: 'oklch(0.88 0.005 17.2)', dark: 'oklch(0.46 0 0)' },
      { name: 'Strong', variable: '--color-border-strong', description: 'Emphasized separator — table rules, card edges', light: 'oklch(0.81 0 0)', dark: 'oklch(0.56 0 0)' },
      { name: 'Control', variable: '--color-border-control', description: 'Form control outlines — 3:1 non-text contrast', light: 'oklch(0.56 0 0)', dark: 'oklch(0.56 0 0)' },
      { name: 'Control on Surface', variable: '--color-border-control-on-surface', description: 'Form control outline on bg-surface — higher L for sufficient contrast', light: 'oklch(0.50 0 0)', dark: 'oklch(0.60 0 0)' },
      { name: 'On Inverse', variable: '--color-border-on-inverse', description: 'Divider on inverse (navy) surface', light: 'oklch(0.40 0.05 245)', dark: 'oklch(0.85 0 0)' },
      { name: 'Focus', variable: '--color-focus', description: 'Focus ring — high-visibility azure', light: 'oklch(0.65 0.18 250.80)', dark: 'oklch(0.77 0.15 250.80)' },
    ],
  },
  {
    name: 'Text',
    description: 'Neutral text colors from the gray ramp, contrast-validated against their intended backgrounds',
    colors: [
      { name: 'Default', variable: '--color-text-default', description: 'Body text', light: 'oklch(0.32 0 0)', dark: 'oklch(0.88 0.01 248)' },
      { name: 'Subtle', variable: '--color-text-subtle', description: 'Secondary / supporting text', light: 'oklch(0.50 0 0)', dark: 'oklch(0.71 0 0)' },
      { name: 'Subtle on Surface', variable: '--color-text-subtle-on-surface', description: 'Secondary text on bg-surface', light: 'oklch(0.44 0 0)', dark: 'oklch(0.71 0 0)' },
      { name: 'Disabled', variable: '--color-text-disabled', description: 'Disabled state — intentionally below AA', light: 'oklch(0.71 0 0)', dark: 'oklch(0.46 0 0)' },
      { name: 'Inverse', variable: '--color-text-inverse', description: 'Text on inverse surface — white in light mode, near-black in dark mode', light: 'oklch(1 0 0)', dark: 'oklch(0.24 0.03 248.99)' },
      { name: 'Subtle on Inverse', variable: '--color-text-subtle-on-inverse', description: 'Muted text on inverse surface — OKCA 5.5 on bg-inverse', light: 'oklch(0.75 0.02 245)', dark: 'oklch(0.40 0 0)' },
      { name: 'On Action', variable: '--color-text-on-action', description: 'Text on primary/secondary button fills', light: 'oklch(1 0 0)', dark: 'oklch(0.16 0.02 248.99)' },
      { name: 'Toast Message', variable: '--color-toast-message', description: 'Toast body text — text-default in light, text-subtle in dark', light: 'oklch(0.32 0 0)', dark: 'oklch(0.71 0 0)' },
    ],
  },
  {
    name: 'Action — Primary',
    description: 'Navy — main interactive color',
    colors: [
      { name: 'Primary', variable: '--color-action-primary', description: 'Primary button and action fill', light: 'oklch(0.27 0.06 245.34)', dark: 'oklch(0.79 0.12 245)' },
      { name: 'Primary Hover', variable: '--color-action-primary-hover', description: 'Hover state', light: 'oklch(0.19 0.05 245.34)', dark: 'oklch(0.87 0.08 245)' },
      { name: 'Primary Active', variable: '--color-action-primary-active', description: 'Pressed state', light: 'oklch(0.19 0.05 245.34)', dark: 'oklch(0.87 0.08 245)' },
    ],
  },
  {
    name: 'Action — Secondary',
    description: 'Burgundy — supporting action color',
    colors: [
      { name: 'Secondary', variable: '--color-action-secondary', description: 'Secondary button fill', light: 'oklch(0.37 0.08 347.43)', dark: 'oklch(0.76 0.06 347.43)' },
      { name: 'Secondary Hover', variable: '--color-action-secondary-hover', description: 'Hover state', light: 'oklch(0.28 0.07 347.43)', dark: 'oklch(0.86 0.05 347.43)' },
      { name: 'Secondary Active', variable: '--color-action-secondary-active', description: 'Pressed state', light: 'oklch(0.20 0.05 347.43)', dark: 'oklch(0.86 0.05 347.43)' },
    ],
  },
  {
    name: 'Action — Tertiary',
    description: 'Neutral fill — no border, low-hierarchy action',
    colors: [
      { name: 'Tertiary', variable: '--color-action-tertiary', description: 'Tertiary button fill', light: 'oklch(0.88 0.005 17.2)', dark: 'oklch(0.32 0.03 249)' },
      { name: 'Tertiary Hover', variable: '--color-action-tertiary-hover', description: 'Hover state', light: 'oklch(0.81 0 0)', dark: 'oklch(0.46 0.03 249)' },
      { name: 'Tertiary Text', variable: '--color-action-tertiary-text', description: 'Text / icon on tertiary bg', light: 'oklch(0.27 0.06 245.34)', dark: 'oklch(1 0 0)' },
    ],
  },
  {
    name: 'Action — Destructive',
    description: 'Crimson (hue=347) — outlined only; signals irreversibility. Distinct from error (hue=25).',
    colors: [
      { name: 'Destructive', variable: '--color-action-destructive', description: 'Button fill — transparent (outlined variant)', light: 'transparent', dark: 'transparent' },
      { name: 'Destructive Hover', variable: '--color-action-destructive-hover', description: 'Subtle crimson tint on hover', light: 'oklch(0.37 0.15 347 / 0.08)', dark: 'oklch(0.72 0.15 347 / 0.12)' },
      { name: 'Destructive Active', variable: '--color-action-destructive-active', description: 'Stronger crimson tint on press', light: 'oklch(0.37 0.15 347 / 0.15)', dark: 'oklch(0.72 0.15 347 / 0.22)' },
      { name: 'Destructive Text', variable: '--color-action-destructive-text', description: 'Button label — OKCA 8.8 on white', light: 'oklch(0.37 0.15 347)', dark: 'oklch(0.74 0.15 347)' },
      { name: 'Destructive Border', variable: '--color-action-destructive-border', description: 'Outline — matches destructive text', light: 'oklch(0.37 0.15 347)', dark: 'oklch(0.74 0.15 347)' },
    ],
  },
  {
    name: 'Links',
    description: 'Azure — #1493FB brand anchor. Accessible steps lighten in dark mode.',
    colors: [
      { name: 'Link', variable: '--color-link', description: 'Body link color', light: 'oklch(0.49 0.18 250.80)', dark: 'oklch(0.77 0.15 250.80)' },
      { name: 'Link Hover', variable: '--color-link-hover', description: 'Link hover state', light: 'oklch(0.45 0.17 250.80)', dark: 'oklch(0.86 0.10 250.80)' },
      { name: 'Link Visited', variable: '--color-link-visited', description: 'Visited link — purple, universal convention', light: 'oklch(0.47 0.20 278.14)', dark: 'oklch(0.77 0.15 278.14)' },
    ],
  },
  {
    name: 'Highlight',
    description: 'Inline code — burgundy (hue=347), clearly distinct from indigo visited links.',
    colors: [
      { name: 'Highlight', variable: '--color-highlight', description: 'Inline code text — burgundy, clearly distinct from indigo visited links', light: 'oklch(0.37 0.08 347.43)', dark: 'oklch(0.86 0.05 347.43)' },
    ],
  },
  {
    name: 'Status — Error',
    description: 'Orange-red (hue=25) — failure states and validation errors',
    colors: [
      { name: 'Error', variable: '--color-status-error', description: 'Icon / border use', light: 'oklch(0.55 0.22 25)', dark: 'oklch(0.68 0.11 25)' },
      { name: 'Error Background', variable: '--color-status-error-bg', description: 'Toast and alert fill', light: 'oklch(0.95 0.05 25)', dark: 'oklch(0.23 0.02 18)' },
      { name: 'Error Text', variable: '--color-status-error-text', description: 'Text on error-bg', light: 'oklch(0.45 0.22 25)', dark: 'oklch(0.79 0.22 25)' },
    ],
  },
  {
    name: 'Status — Success',
    description: 'Green (hue=144) — confirmation and completion',
    colors: [
      { name: 'Success', variable: '--color-status-success', description: 'Icon / border use', light: 'oklch(0.63 0.15 144.2)', dark: 'oklch(0.70 0.08 144.2)' },
      { name: 'Success Background', variable: '--color-status-success-bg', description: 'Toast and alert fill', light: 'oklch(0.95 0.05 145)', dark: 'oklch(0.23 0.02 144)' },
      { name: 'Success Text', variable: '--color-status-success-text', description: 'Text on success-bg', light: 'oklch(0.46 0.15 144.2)', dark: 'oklch(0.80 0.15 144.2)' },
    ],
  },
  {
    name: 'Status — Warning',
    description: 'Amber (hue=53) — caution and non-blocking issues',
    colors: [
      { name: 'Warning', variable: '--color-status-warning', description: 'Icon / border use', light: 'oklch(0.66 0.16 53.54)', dark: 'oklch(0.72 0.09 53.54)' },
      { name: 'Warning Background', variable: '--color-status-warning-bg', description: 'Toast and alert fill', light: 'oklch(0.95 0.05 53)', dark: 'oklch(0.25 0.02 68)' },
      { name: 'Warning Text', variable: '--color-status-warning-text', description: 'Text on warning-bg', light: 'oklch(0.40 0.16 53.54)', dark: 'oklch(0.82 0.16 53.54)' },
    ],
  },
  {
    name: 'Code Blocks',
    description: 'Dark navy surface for code blocks — always visually distinct from ambient backgrounds. Border required when the ambient background is also dark.',
    colors: [
      { name: 'Code Background', variable: '--color-bg-code', description: 'Code block surface', light: 'oklch(0.27 0.06 245.34)', dark: 'oklch(0.20 0.04 248)' },
      { name: 'Code Text', variable: '--color-text-code', description: 'Text on code bg', light: 'oklch(1 0 0)', dark: 'oklch(0.88 0.01 248)' },
      { name: 'Code Border', variable: '--color-border-code', description: 'Border required in dark mode — transparent in light', light: 'transparent', dark: 'oklch(0.56 0 0)' },
    ],
  },
  {
    name: 'Blockquote',
    description: 'Pull-quote surface — bg-surface fill with burgundy left border',
    colors: [
      { name: 'Blockquote Background', variable: '--color-blockquote-bg', description: 'Blockquote surface — inherits bg-surface', light: 'oklch(0.91 0 0)', dark: 'oklch(0.24 0.03 248.99)' },
      { name: 'Blockquote Border', variable: '--color-blockquote-border', description: 'Left accent border — burgundy (action-secondary)', light: 'oklch(0.37 0.08 347.43)', dark: 'oklch(0.76 0.06 347.43)' },
      { name: 'Blockquote Text', variable: '--color-blockquote-text', description: 'Blockquote prose — inherits text-subtle-on-surface', light: 'oklch(0.44 0 0)', dark: 'oklch(0.71 0 0)' },
    ],
  },
  {
    name: 'Callout',
    description: 'Tip / note panel — indigo wash with a decorative indigo left border. The action-oriented sibling of blockquote (a burgundy pull-quote): the callout is upright, default-colour guidance the reader should act on.',
    colors: [
      { name: 'Callout Background', variable: '--color-callout-bg', description: 'Callout surface — indigo wash, theme-aware', light: 'oklch(0.97 0.02 278.14)', dark: 'oklch(0.26 0.04 278)' },
      { name: 'Highlight Decorative', variable: '--color-highlight-decorative', description: 'Left accent border — indigo #6969F7 anchor; decorative (non-text) use only, never a text colour', light: 'oklch(0.60 0.21 278.14)', dark: 'oklch(0.68 0.18 278.14)' },
    ],
  },
];

const renderSwatchGrid = (categories: ColorCategory[]) => html`
  <div style="display: block; font-family: var(--font-family-base); padding: var(--spacing-lg); background: var(--color-bg-page);">
    ${categories.map(cat => html`
      <section style="margin-bottom: var(--spacing-lg);">
        <div style="margin-bottom: var(--spacing-sm);">
          <h2 style="
            font-family: var(--font-family-accessible);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-bold);
            color: var(--color-text-subtle);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 0 0 var(--spacing-2xs) 0;
            line-height: var(--line-height-tight);
          ">${cat.name}</h2>
          <p style="
            font-family: var(--font-family-base);
            font-size: var(--font-size-sm);
            color: var(--color-text-subtle);
            margin: 0;
            line-height: var(--line-height-normal);
          ">${cat.description}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--spacing-xs);">
          ${cat.colors.map(c => html`
            <div style="border: 1px solid var(--color-border-default); border-radius: var(--radius-sm); overflow: hidden; background: var(--color-bg-surface);">
              <div style="height: 56px; background: var(${c.variable});"></div>
              <div style="padding: var(--spacing-xs) var(--spacing-sm);">
                <code style="
                  display: block;
                  font-family: var(--font-family-mono);
                  font-size: 0.65rem;
                  color: var(--color-text-subtle);
                  word-break: break-all;
                  margin: 0;
                ">${c.variable}</code>
              </div>
            </div>
          `)}
        </div>
      </section>
    `)}
  </div>
`;

const renderReferenceTable = (categories: ColorCategory[]) => html`
  <div style="display: flex; flex-direction: column; gap: var(--spacing-xl);">
    ${categories.map(cat => {
      const headingId = `tokcat-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return html`
      <section>
        <h2 id="${headingId}" style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-2xs);">${cat.name}</h2>
        <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 var(--spacing-sm);">${cat.description}</p>
        <div style="overflow-x: auto;">
        <table aria-labelledby="${headingId}" style="
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-family-accessible);
          font-size: var(--font-size-sm);
          color: var(--color-text-default);
          letter-spacing: 0.02em;
        ">
          <thead>
            <tr>
              <th style="text-align: left; padding: 0.25rem var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Token</th>
              <th style="text-align: left; padding: 0.25rem var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Light</th>
              <th style="text-align: left; padding: 0.25rem var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Dark</th>
              <th style="text-align: left; padding: 0.25rem var(--spacing-sm); color: var(--color-text-subtle-on-surface); font-weight: var(--font-weight-bold); border-bottom: var(--border-width-medium) solid var(--color-border-strong);">Description</th>
            </tr>
          </thead>
          <tbody>
            ${cat.colors.map((c, i) => html`
              <tr style="${i % 2 === 1 ? 'background: var(--color-bg-surface);' : ''}">
                <td style="padding: 0.25rem var(--spacing-sm); font-family: var(--font-family-mono);">${c.variable}</td>
                <td style="padding: 0.25rem var(--spacing-sm); font-family: var(--font-family-mono);">${c.light ? html`<span style="display:inline-flex;align-items:center;gap:0.375em;"><span style="display:inline-block;width:0.875rem;height:0.875rem;border-radius:2px;background:${c.light};border:1px solid oklch(0 0 0 / 0.12);flex-shrink:0;"></span>${c.light}</span>` : '—'}</td>
                <td style="padding: 0.25rem var(--spacing-sm); font-family: var(--font-family-mono);">${c.dark ? html`<span style="display:inline-flex;align-items:center;gap:0.375em;"><span style="display:inline-block;width:0.875rem;height:0.875rem;border-radius:2px;background:${c.dark};border:1px solid oklch(0 0 0 / 0.12);flex-shrink:0;"></span>${c.dark}</span>` : '—'}</td>
                <td style="padding: 0.25rem var(--spacing-sm); color: var(--color-text-subtle-on-surface);">${c.description}</td>
              </tr>
            `)}
          </tbody>
        </table>
        </div>
      </section>
      `;
    })}
  </div>
`;

const meta: Meta = {
  title: 'Design Tokens/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => React.createElement(React.Fragment, null,
        React.createElement(Title, null),
        React.createElement(Description, null),
        React.createElement(Stories, { includePrimary: true })
      ),
      description: {
        component: `
Colors use **OKLCH** (Lightness, Chroma, Hue) for perceptual uniformity and predictable
manipulation.

## Two-tier architecture
- **Primitives** — raw named values (color ramps, type scale, spacing, borders) in \`primitives.scss\`
- **Semantics** — role-based tokens (--color-action-primary, --color-text-default, …) in \`semantics.scss\`

Components reference semantic tokens only. CSS custom properties pierce shadow DOM, so a
single \`candor-tokens.css\` load at the document level reaches into every web component's (WC)
internals.

## Brand palette
- **Navy** \`#082840\` — primary action (15.2:1 with white)
- **Burgundy** \`#5F2B48\` — secondary action (10.4:1 with white)
- **Azure** \`#1493FB\` — accent / link (decorative on white; accessible step at azure-500)
- **Indigo** \`#6969F7\` — visited link color; accessible step at indigo-600, 4.6:1

## Accessibility
All action and text tokens meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
Validated with \`klar contrast\`.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const LightTheme: Story = {
  name: 'Light Theme',
  globals: { theme: 'light' },
  parameters: {
    docs: {
      description: {
        story: 'Complete semantic palette in light mode. Token values shown are light-mode resolved values.',
      },
    },
  },
  render: () => renderSwatchGrid(COLOR_CATEGORIES),
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  globals: { theme: 'dark' },
  parameters: {
    docs: {
      description: {
        story: 'Complete semantic palette in dark mode. Swatch colors reflect the active dark-mode token values.',
      },
    },
  },
  render: () => renderSwatchGrid(COLOR_CATEGORIES),
};

export const TokenReference: Story = {
  name: 'Token Reference',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Full token reference — OKLCH values for both light and dark mode. Source of truth is `src/design-tokens/semantics.scss`.',
      },
    },
  },
  render: () => renderReferenceTable(COLOR_CATEGORIES),
};
