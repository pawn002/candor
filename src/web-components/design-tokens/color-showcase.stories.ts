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
    name: 'Backgrounds: depth',
    description: 'How far a surface sits above the page. A card is surface; a modal, menu or popover is elevated and carries a shadow.',
    colors: [
      { name: 'Page', variable: '--color-bg-page', description: 'The page floor' },
      { name: 'Surface', variable: '--color-bg-surface', description: 'Cards and panels' },
      { name: 'Elevated', variable: '--color-bg-elevated', description: 'Modals, menus and popovers, lifted by a shadow' },
      { name: 'Muted', variable: '--color-bg-muted', description: 'A neutral fill that reads on page, surface and elevated alike. The default badge rests on it' },
      { name: 'Inverse', variable: '--color-bg-inverse', description: 'The navy band for app headers and inverse tabs. Navy in both modes, a step lighter in dark' },
    ],
  },
  {
    name: 'Backgrounds: layout',
    description: 'A second axis beside depth: which region a screen leads with. In light, content is the page lightness turned warm and chrome the surface lightness turned cool; in dark, content keeps the card lightness and chrome steps down to the page. Either way they rank regions by temperature while contrast barely moves. A tertiary cue, never the only one.',
    colors: [
      { name: 'Content', variable: '--color-bg-content', description: 'The region a screen leads with: the main reading column or workspace' },
      { name: 'Chrome', variable: '--color-bg-chrome', description: 'Sidebars, toolbars and secondary panels that should step back. Use text-subtle-on-surface on it' },
    ],
  },
  {
    name: 'Interaction',
    description: 'Fills for a borderless control under the pointer. The ghost button has its own names for the same values.',
    colors: [
      { name: 'Hover', variable: '--color-bg-hover', description: 'Close and dismiss buttons, navigation links, pagination' },
      { name: 'Active', variable: '--color-bg-active', description: 'Pressed, one in-between step below hover' },
      { name: 'Hover on Inverse', variable: '--color-bg-hover-on-inverse', description: 'Hover on the navy band: white at 10%' },
    ],
  },
  {
    name: 'Text',
    description: 'Neutral text from the grey ramp, each measured against the background it is meant for.',
    colors: [
      { name: 'Default', variable: '--color-text-default', description: 'Body text' },
      { name: 'Subtle', variable: '--color-text-subtle', description: 'Secondary text on the page' },
      { name: 'Subtle on Surface', variable: '--color-text-subtle-on-surface', description: 'Secondary text on a card' },
      { name: 'Disabled', variable: '--color-text-disabled', description: 'Disabled controls, intentionally below the floor (WCAG 1.4.3 exempts them)' },
      { name: 'On Inverse', variable: '--color-text-on-inverse', description: 'Text on the navy band' },
      { name: 'Subtle on Inverse', variable: '--color-text-subtle-on-inverse', description: 'Secondary text on the navy band' },
      { name: 'On Action', variable: '--color-text-on-action', description: 'The label on a filled action: primary button, badge, selected chip' },
      { name: 'Toast', variable: '--color-text-toast', description: 'Toast body text: text-default in light, text-subtle in dark' },
      { name: 'Blockquote', variable: '--color-text-blockquote', description: 'Blockquote prose. Inherits text-default' },
    ],
  },
  {
    name: 'Accent',
    description: 'The brand navy as a mark rather than a fill: a label, a line, an indicator. Pale in dark, where it sits on the dark page itself.',
    colors: [
      { name: 'Text', variable: '--color-text-accent', description: 'The active tab and nav link, a selected option, a hovered disclosure' },
      { name: 'Border', variable: '--color-border-accent', description: 'The active tab underline, a checked radio ring, a hovered control edge' },
      { name: 'Indicator', variable: '--color-fill-indicator', description: 'The selected radio dot and a progress bar' },
      { name: 'Border on Inverse', variable: '--color-border-accent-on-inverse', description: 'The active tab underline on the navy band' },
    ],
  },
  {
    name: 'Accent: secondary',
    description: 'Burgundy, the second brand hue, for badges and chips. Not the secondary button, which is navy.',
    colors: [
      { name: 'Background', variable: '--color-bg-accent-secondary', description: 'The secondary badge. Deep in both modes' },
      { name: 'Border', variable: '--color-border-accent-secondary', description: 'The secondary chip outline' },
      { name: 'Nav Badge', variable: '--color-bg-nav-badge', description: 'The navigation count badge, brighter than the secondary fill in dark so an unread count draws the eye' },
    ],
  },
  {
    name: 'Buttons',
    description: 'Named after the button variant that uses them. Primary is filled, secondary outlined in navy, tertiary a neutral fill, ghost borderless, destructive outlined in the error red.',
    colors: [
      { name: 'Primary', variable: '--color-bg-action-primary', description: 'The primary button fill; also the badge, the selected chip and a checked box. Deep in both modes' },
      { name: 'Primary Hover', variable: '--color-bg-action-primary-hover', description: 'Hover' },
      { name: 'Primary Active', variable: '--color-bg-action-primary-active', description: 'Pressed' },
      { name: 'Secondary Text', variable: '--color-text-action-secondary', description: 'The outlined secondary button label' },
      { name: 'Secondary Border', variable: '--color-border-action-secondary', description: 'Its edge, dimmed below the label in dark' },
      { name: 'Secondary Hover', variable: '--color-bg-action-secondary-hover', description: 'A navy tint on hover' },
      { name: 'Secondary Active', variable: '--color-bg-action-secondary-active', description: 'A stronger tint when pressed' },
      { name: 'Tertiary', variable: '--color-bg-action-tertiary', description: 'The neutral fill, its only edge' },
      { name: 'Tertiary Hover', variable: '--color-bg-action-tertiary-hover', description: 'Hover, a step darker' },
      { name: 'Tertiary Active', variable: '--color-bg-action-tertiary-active', description: 'Pressed, a step darker again' },
      { name: 'Tertiary Text', variable: '--color-text-action-tertiary', description: 'The tertiary label' },
      { name: 'Ghost Hover', variable: '--color-bg-action-ghost-hover', description: 'The ghost button on hover' },
      { name: 'Ghost Active', variable: '--color-bg-action-ghost-active', description: 'The ghost button pressed' },
      { name: 'Destructive', variable: '--color-bg-action-destructive', description: 'Transparent: destructive is outlined' },
      { name: 'Destructive Hover', variable: '--color-bg-action-destructive-hover', description: 'A red tint on hover' },
      { name: 'Destructive Active', variable: '--color-bg-action-destructive-active', description: 'A stronger tint when pressed' },
      { name: 'Destructive Text', variable: '--color-text-action-destructive', description: 'The label, the error red: OKCA 6.8 on white' },
      { name: 'Destructive Border', variable: '--color-border-action-destructive', description: 'The edge' },
    ],
  },
  {
    name: 'Links',
    description: 'Azure, the #1493FB brand anchor. Accessible steps lighten in dark mode.',
    colors: [
      { name: 'Link', variable: '--color-text-link', description: 'Body links' },
      { name: 'Link Hover', variable: '--color-text-link-hover', description: 'Hover' },
      { name: 'Link Visited', variable: '--color-text-link-visited', description: 'Visited, purple by universal convention' },
    ],
  },
  {
    name: 'Form controls',
    description: 'A field edge by state, and the marks and tracks that are their own signal. Edges, tracks and scrollbar thumbs clear 3:1 against what they sit on (WCAG 1.4.11); the slider thumb is carried by its outline, and a mark on an action by the action fill.',
    colors: [
      { name: 'Control', variable: '--color-border-control', description: 'A field edge at rest, safe on page, surface and elevated' },
      { name: 'Control Hover', variable: '--color-border-control-hover', description: 'Hovered: the same grey today' },
      { name: 'Control Focus', variable: '--color-border-control-focus', description: 'Focused, with the focus ring outside it' },
      { name: 'Control Error', variable: '--color-border-control-error', description: 'A field in error' },
      { name: 'Track', variable: '--color-fill-track', description: 'A switch off, a slider rail' },
      { name: 'On Action', variable: '--color-fill-on-action', description: 'A switch thumb and a checkbox tick on the action fill' },
      { name: 'Slider Thumb', variable: '--color-fill-slider-thumb', description: 'White in light, a pale grey in dark' },
      { name: 'Scrollbar Thumb', variable: '--color-fill-scrollbar-thumb', description: 'The scrollbar' },
      { name: 'Scrollbar Thumb Hover', variable: '--color-fill-scrollbar-thumb-hover', description: 'Hovered' },
    ],
  },
  {
    name: 'Borders and focus',
    description: 'Separators, and the focus ring every component draws.',
    colors: [
      { name: 'Default', variable: '--color-border-default', description: 'A subtle separator' },
      { name: 'Strong', variable: '--color-border-strong', description: 'Table rules and card edges' },
      { name: 'On Inverse', variable: '--color-border-on-inverse', description: 'A divider on the navy band' },
      { name: 'Focus', variable: '--color-ring-focus', description: 'The focus ring, high-visibility azure' },
    ],
  },
  {
    name: 'Status: error',
    description: 'Red (hue 25) for failure states and validation errors.',
    colors: [
      { name: 'Icon', variable: '--color-icon-error', description: 'The status icon' },
      { name: 'Background', variable: '--color-bg-error', description: 'Alert and toast fill: a pale tint, a dark tint in dark' },
      { name: 'Text', variable: '--color-text-error', description: 'Text on that fill' },
      { name: 'Border', variable: '--color-border-error', description: 'A status chip outline, a step dimmer in dark. A field in error uses border-control-error' },
    ],
  },
  {
    name: 'Status: success',
    description: 'Green (hue 144) for confirmation and completion.',
    colors: [
      { name: 'Icon', variable: '--color-icon-success', description: 'The status icon' },
      { name: 'Background', variable: '--color-bg-success', description: 'Alert and toast fill: a pale tint, a dark tint in dark' },
      { name: 'Text', variable: '--color-text-success', description: 'Text on that fill' },
      { name: 'Border', variable: '--color-border-success', description: 'A status chip outline, a step dimmer in dark' },
    ],
  },
  {
    name: 'Status: warning',
    description: 'Gold (hue 88) for caution and non-blocking issues.',
    colors: [
      { name: 'Icon', variable: '--color-icon-warning', description: 'The status icon' },
      { name: 'Background', variable: '--color-bg-warning', description: 'Alert and toast fill: a pale tint, a dark tint in dark' },
      { name: 'Text', variable: '--color-text-warning', description: 'Text on that fill' },
      { name: 'Border', variable: '--color-border-warning', description: 'A status chip outline, a step dimmer in dark' },
    ],
  },
  {
    name: 'Component surfaces',
    description: 'Colours that belong to one component.',
    colors: [
      { name: 'Tooltip', variable: '--color-bg-tooltip', description: 'The tooltip bubble. Inverse in light, a notch lighter in dark so it stands apart on a modal' },
      { name: 'Code Background', variable: '--color-bg-code', description: 'A quiet teal tint, about deltaE 8 to 9 from the page' },
      { name: 'Code Text', variable: '--color-text-code', description: 'Text in a code block' },
      { name: 'Code Border', variable: '--color-border-code', description: 'Transparent in light; dark adds a rule, where lightness alone barely separates the block' },
      { name: 'Callout', variable: '--color-bg-callout', description: 'A tip or note panel. Inherits bg-surface' },
    ],
  },
];

// Swatch label style, held out of the template on purpose.
//
// These names wrap — several exceed the 160px column at 14px — and they must break
// after a hyphen, not mid-token. The default `word-break: normal` does that; the
// `break-all` this replaced split `--color-border-default` as `--color-border-defaul`
// + `t`, which for a string whose whole purpose is to be copied is worse than a wrap.
//
// It lives in a const rather than inline because a CSS comment inside a style="…"
// attribute is one stray double quote away from truncating the attribute — which is
// exactly what happened when this explanation was written inline, silently dropping
// the two declarations that followed it. Prose belongs in TypeScript, where quoting
// it is free.
const SWATCH_LABEL_STYLE = [
  'display: block',
  'font-family: var(--font-family-mono)',
  'font-size: var(--font-size-sm)',
  'color: var(--color-text-subtle)',
  'word-break: normal',
  'overflow-wrap: break-word',
  'margin: 0',
].join('; ');

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
                <code style="${SWATCH_LABEL_STYLE}">${c.variable}</code>
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
          letter-spacing: var(--letter-spacing-body);
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
- **Primitives**: raw named values (color ramps, type scale, spacing, borders) in \`primitives.scss\`
- **Semantics**: role-based tokens named property first (--color-bg-page, --color-text-default, --color-border-control, …) in \`semantics.scss\`

Components reference semantic tokens only. CSS custom properties pierce shadow DOM, so a
single \`candor-tokens.css\` load at the document level reaches into every web component's (WC)
internals.

## Brand palette
Figures are OKCA on white, the algorithm Candor's thresholds are written against.
These measure the **brand hex** (the anchor the palette was derived from) and not
the token derived from it. Converting a hex to OKLCH rounds, so a token's score can
sit a tenth away from its own anchor's. Both numbers are correct about different
colours, so a figure here and the one in the token's comment are not expected to
agree, and reconciling them makes one of them wrong.

- **Navy** \`#082840\`: primary action (OKCA 14.2 on white)
- **Burgundy** \`#5F2B48\`: secondary action (OKCA 9.3 on white)
- **Azure** \`#1493FB\`: accent / link; decorative at OKCA 2.4 on white, so \`--color-text-link\` uses azure-600 for OKCA 6.4 on white
- **Indigo** \`#6969F7\`: visited link anchor; decorative at OKCA 3.0 on white, so \`--color-text-link-visited\` uses indigo-625 for OKCA 6.6 on white

## Accessibility
Action and text tokens meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components) and the
stricter Candor OKCA tier floors. Two pairings are exempt (a disabled field's value and a
placeholder), recorded in \`docs/ACCESSIBILITY-CONFORMANCE.md\`. Every authored colour is renderable in sRGB, and
\`npm run audit:tokens\` fails the build if one is not. Validated with
\`klar contrast\` 4.x; re-measure with \`npm run audit:contrast\`.
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
        story: 'Complete semantic palette in light mode. Token Reference lists the values.',
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
        story: 'Full token reference: OKLCH values for both light and dark mode. Source of truth is `src/design-tokens/semantics.scss`.',
      },
    },
  },
  render: () => renderReferenceTable(COLOR_CATEGORIES),
};
