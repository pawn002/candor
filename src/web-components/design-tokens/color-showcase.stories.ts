import React from 'react';
import { html } from 'lit';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { requireTokenValue } from './token-values';

// Values are NOT recorded here. They are read from audit/tokens.dtcg.json,
// which `npm run audit:tokens` generates from the SCSS and CI gates — so this
// table cannot disagree with the stylesheet it documents (#223). Adding a
// swatch means naming the token; its colour follows automatically.
interface ColorSwatch {
  name: string;
  variable: string;
  description: string;
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
      { name: 'Page', variable: '--color-bg-page', description: 'Page floor' },
      { name: 'Surface', variable: '--color-bg-surface', description: 'Cards and panels' },
      { name: 'Subtle', variable: '--color-bg-subtle', description: 'Subtle interactive fill — hover rows, selection, hover chips. One step beyond surface; direction flips per theme' },
      { name: 'Elevated', variable: '--color-bg-elevated', description: 'Shadow-lifted surface' },
      { name: 'Inverse', variable: '--color-bg-inverse', description: 'Dark inverse surface — flips in dark mode' },
    ],
  },
  {
    name: 'Borders & Focus',
    description: 'Separators, control outlines, and focus indicators',
    colors: [
      { name: 'Default', variable: '--color-border-default', description: 'Subtle separator' },
      { name: 'Strong', variable: '--color-border-strong', description: 'Emphasized separator — table rules, card edges' },
      { name: 'Control', variable: '--color-border-control', description: 'Form control outlines — 3:1 non-text contrast' },
      { name: 'Control on Surface', variable: '--color-border-control-on-surface', description: 'Form control outline on bg-surface — higher L for sufficient contrast' },
      { name: 'On Inverse', variable: '--color-border-on-inverse', description: 'Divider on inverse (navy) surface' },
      { name: 'Focus', variable: '--color-focus', description: 'Focus ring — high-visibility azure' },
    ],
  },
  {
    name: 'Text',
    description: 'Neutral text colors from the gray ramp, contrast-validated against their intended backgrounds',
    colors: [
      { name: 'Default', variable: '--color-text-default', description: 'Body text' },
      { name: 'Subtle', variable: '--color-text-subtle', description: 'Secondary / supporting text' },
      { name: 'Subtle on Surface', variable: '--color-text-subtle-on-surface', description: 'Secondary text on bg-surface' },
      { name: 'Disabled', variable: '--color-text-disabled', description: 'Disabled state — intentionally below AA' },
      { name: 'Inverse', variable: '--color-text-inverse', description: 'Text on inverse surface — white in light mode, near-black in dark mode' },
      { name: 'Subtle on Inverse', variable: '--color-text-subtle-on-inverse', description: 'Muted text on inverse surface — OKCA 6.0 on bg-inverse' },
      { name: 'On Action', variable: '--color-text-on-action', description: 'Text on primary/secondary button fills' },
      { name: 'Toast Message', variable: '--color-toast-message', description: 'Toast body text — text-default in light, text-subtle in dark' },
    ],
  },
  {
    name: 'Action — Primary',
    description: 'Navy — main interactive color',
    colors: [
      { name: 'Primary', variable: '--color-action-primary', description: 'Primary button and action fill' },
      { name: 'Primary Hover', variable: '--color-action-primary-hover', description: 'Hover state' },
      { name: 'Primary Active', variable: '--color-action-primary-active', description: 'Pressed state' },
    ],
  },
  {
    name: 'Action — Secondary',
    description: 'Burgundy — supporting action color',
    colors: [
      { name: 'Secondary', variable: '--color-action-secondary', description: 'Secondary button fill' },
      { name: 'Secondary Hover', variable: '--color-action-secondary-hover', description: 'Hover state' },
      { name: 'Secondary Active', variable: '--color-action-secondary-active', description: 'Pressed state' },
    ],
  },
  {
    name: 'Action — Tertiary',
    description: 'Neutral fill — no border, low-hierarchy action',
    colors: [
      { name: 'Tertiary', variable: '--color-action-tertiary', description: 'Tertiary button fill' },
      { name: 'Tertiary Hover', variable: '--color-action-tertiary-hover', description: 'Hover state' },
      { name: 'Tertiary Text', variable: '--color-action-tertiary-text', description: 'Text / icon on tertiary bg' },
    ],
  },
  {
    name: 'Action — Destructive',
    description: 'Crimson (hue=347) — outlined only; signals irreversibility. Distinct from error (hue=25).',
    colors: [
      { name: 'Destructive', variable: '--color-action-destructive', description: 'Button fill — transparent (outlined variant)' },
      { name: 'Destructive Hover', variable: '--color-action-destructive-hover', description: 'Subtle crimson tint on hover' },
      { name: 'Destructive Active', variable: '--color-action-destructive-active', description: 'Stronger crimson tint on press' },
      { name: 'Destructive Text', variable: '--color-action-destructive-text', description: 'Button label — OKCA 9.3 on white' },
      { name: 'Destructive Border', variable: '--color-action-destructive-border', description: 'Outline — matches destructive text' },
    ],
  },
  {
    name: 'Links',
    description: 'Azure — #1493FB brand anchor. Accessible steps lighten in dark mode.',
    colors: [
      { name: 'Link', variable: '--color-link', description: 'Body link color' },
      { name: 'Link Hover', variable: '--color-link-hover', description: 'Link hover state' },
      { name: 'Link Visited', variable: '--color-link-visited', description: 'Visited link — purple, universal convention' },
    ],
  },
  {
    name: 'Highlight',
    description: 'Inline code — burgundy (hue=347), clearly distinct from indigo visited links.',
    colors: [
      { name: 'Highlight', variable: '--color-highlight', description: 'Inline code text — burgundy, clearly distinct from indigo visited links' },
    ],
  },
  {
    name: 'Status — Error',
    description: 'Orange-red (hue=25) — failure states and validation errors',
    colors: [
      { name: 'Error', variable: '--color-status-error', description: 'Icon / border use' },
      { name: 'Error Background', variable: '--color-status-error-bg', description: 'Toast and alert fill' },
      { name: 'Error Text', variable: '--color-status-error-text', description: 'Text on error-bg' },
    ],
  },
  {
    name: 'Status — Success',
    description: 'Green (hue=144) — confirmation and completion',
    colors: [
      { name: 'Success', variable: '--color-status-success', description: 'Icon / border use' },
      { name: 'Success Background', variable: '--color-status-success-bg', description: 'Toast and alert fill' },
      { name: 'Success Text', variable: '--color-status-success-text', description: 'Text on success-bg' },
    ],
  },
  {
    name: 'Status — Warning',
    description: 'Amber (hue=53) — caution and non-blocking issues',
    colors: [
      { name: 'Warning', variable: '--color-status-warning', description: 'Icon / border use' },
      { name: 'Warning Background', variable: '--color-status-warning-bg', description: 'Toast and alert fill' },
      { name: 'Warning Text', variable: '--color-status-warning-text', description: 'Text on warning-bg' },
    ],
  },
  {
    name: 'Code Blocks',
    description: 'Dark navy surface for code blocks — always visually distinct from ambient backgrounds. Border required when the ambient background is also dark.',
    colors: [
      { name: 'Code Background', variable: '--color-bg-code', description: 'Code block surface' },
      { name: 'Code Text', variable: '--color-text-code', description: 'Text on code bg' },
      { name: 'Code Border', variable: '--color-border-code', description: 'Border required in dark mode — transparent in light' },
    ],
  },
  {
    name: 'Blockquote',
    description: 'Pull-quote surface — bg-surface fill with burgundy left border',
    colors: [
      { name: 'Blockquote Background', variable: '--color-blockquote-bg', description: 'Blockquote surface — inherits bg-surface' },
      { name: 'Blockquote Border', variable: '--color-blockquote-border', description: 'Left accent border — burgundy (action-secondary)' },
      { name: 'Blockquote Text', variable: '--color-blockquote-text', description: 'Blockquote prose — inherits text-subtle-on-surface' },
    ],
  },
  {
    name: 'Callout',
    description: 'Tip / note panel — indigo wash with a decorative indigo left border. The action-oriented sibling of blockquote (a burgundy pull-quote): the callout is upright, default-colour guidance the reader should act on.',
    colors: [
      { name: 'Callout Background', variable: '--color-callout-bg', description: 'Callout surface — indigo wash, theme-aware' },
      { name: 'Highlight Decorative', variable: '--color-highlight-decorative', description: 'Left accent border — indigo #6969F7 anchor; decorative (non-text) use only, never a text colour' },
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
                  font-size: var(--font-size-sm);
                  color: var(--color-text-subtle);
                  /* Break after the hyphens, not mid-word. break-all splits
                     --color-border-default as "--color-border-defaul / t",
                     which is unreadable and, since these names are meant to be
                     copied, actively misleading. */
                  word-break: normal;
                  overflow-wrap: break-word;
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

// A value cell: the colour as painted, next to the string that produced it.
// Both come from the artifact, so the chip can never contradict its own label.
const renderValueCell = (mode: 'light' | 'dark', variable: string) => {
  const value = requireTokenValue(mode, variable);
  return html`<td style="padding: 0.25rem var(--spacing-sm); font-family: var(--font-family-mono);"
    ><span style="display:inline-flex;align-items:center;gap:0.375em;"
      ><span
        style="display:inline-block;width:0.875rem;height:0.875rem;border-radius:2px;background:${value};border:1px solid oklch(0 0 0 / 0.12);flex-shrink:0;"
      ></span
      >${value}</span
    ></td
  >`;
};

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
                ${renderValueCell('light', c.variable)}
                ${renderValueCell('dark', c.variable)}
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
Figures are OKCA on white — the algorithm Candor's thresholds are written against.
These measure the **brand hex** — the anchor the palette was derived from — and not
the token derived from it. Converting a hex to OKLCH rounds, so a token's score can
sit a tenth away from its own anchor's. Both numbers are correct about different
colours, so a figure here and the one in the token's comment are not expected to
agree, and reconciling them makes one of them wrong.

- **Navy** \`#082840\` — primary action (OKCA 14.0 on white)
- **Burgundy** \`#5F2B48\` — secondary action (OKCA 9.3 on white)
- **Azure** \`#1493FB\` — accent / link; decorative at OKCA 2.5 on white, so \`--color-link\` steps to \`L=0.49\` for OKCA 5.3 on white
- **Indigo** \`#6969F7\` — visited link anchor; decorative at OKCA 3.2 on white, so \`--color-link-visited\` uses indigo-700 for OKCA 5.8 on white

## Accessibility
Action and text tokens meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components) and the
stricter Candor OKCA tier floors, with the tracked exceptions listed in
\`docs/ACCESSIBILITY-CONFORMANCE.md\`. Every authored colour is renderable in sRGB —
\`npm run audit:tokens\` fails the build if one is not. Validated with
\`klar contrast\` 3.x; re-measure with \`npm run audit:contrast\`.
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
