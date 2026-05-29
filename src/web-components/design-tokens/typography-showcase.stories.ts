import React from 'react';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/angular';

interface FontFamily {
  name: string;
  variable: string;
  voice: string;
  mode: 'Execution' | 'Interpretation';
  use: string;
  specimen: string;
}

interface TypeStep {
  token: string;
  size: string;
  px: string;
  use: string;
  isFloor?: boolean;
  isDecorative?: boolean;
}

const FONT_FAMILIES: FontFamily[] = [
  { name: 'Roboto Flex', variable: '--font-family-base', voice: 'Structural Sans', mode: 'Execution', use: 'Navigation, UI scaffolding, data-dense components', specimen: 'ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n0123456789' },
  { name: 'Roboto Mono', variable: '--font-family-mono', voice: 'Technical Mono', mode: 'Execution', use: 'Code, logs, terminal environments', specimen: 'oklch(0.27 0.06 245)\nconst ratio = fg / bg\n0123456789' },
  { name: 'Atkinson Hyperlegible', variable: '--font-family-accessible', voice: 'Accessibility Anchor', mode: 'Execution', use: 'Critical UI, form labels, high-contrast environments', specimen: 'rn il 0O 1Il —\nDisambiguation by design' },
  { name: 'Noto Serif', variable: '--font-family-serif', voice: 'Human-Centered Serif', mode: 'Interpretation', use: 'Long-form reading, articles, body prose', specimen: 'Good design tells the truth\nabout what actually works.' },
  { name: 'Noto Sans', variable: '--font-family-reading', voice: 'Human-Centered Sans', mode: 'Interpretation', use: 'Conversational UI, multilingual content', specimen: 'Accessibility is the baseline,\nnot the finish line.' },
];

const TYPE_SCALE: TypeStep[] = [
  { token: '--font-size-3xl', size: '2.441rem', px: '39px', use: 'Display / h1' },
  { token: '--font-size-2xl', size: '1.953rem', px: '31px', use: 'Section heading / h2' },
  { token: '--font-size-xl',  size: '1.5625rem', px: '25px', use: 'Subsection / h3' },
  { token: '--font-size-lg',  size: '1.25rem',   px: '20px', use: 'Minor heading / h4' },
  { token: '--font-size-md',  size: '1rem',      px: '16px', use: 'Body text (base)' },
  { token: '--font-size-sm',  size: '0.875rem',  px: '14px', use: 'UI labels, captions — floor', isFloor: true },
  { token: '--font-size-xs',  size: '0.75rem',   px: '12px', use: 'Decorative / non-text only', isDecorative: true },
];

const renderShowcase = () => `
  <div style="padding: var(--spacing-lg); background: var(--color-bg-page); font-family: var(--font-family-base);">

    <section style="margin-bottom: var(--spacing-2xl);">
      <div style="margin-bottom: var(--spacing-lg);">
        <h2 style="font-family: var(--font-family-display); font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0 0 var(--spacing-xs) 0; line-height: var(--line-height-tight);">Font Families</h2>
        <p style="font-size: var(--font-size-md); color: var(--color-text-subtle); margin: 0; line-height: var(--line-height-normal);">
          Four-voice system aligned to cognitive mode. Execution voices (navy accent) handle
          task completion and scanning. Interpretation voices (burgundy accent) handle reading
          and reflection.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-lg);">
        ${FONT_FAMILIES.map(f => {
          const isInterp = f.mode === 'Interpretation';
          const accentColor = isInterp ? 'var(--color-action-secondary)' : 'var(--color-action-primary)';
          const chipVariant = isInterp ? 'secondary' : 'primary';
          return `
            <candor-card variant="default" padding="none">
              <div style="height: var(--border-width-thick); background: ${accentColor};"></div>
              <div style="padding: var(--spacing-lg); font-family: var(${f.variable}); font-size: var(--font-size-lg); font-weight: var(--font-weight-regular); color: var(--color-text-default); line-height: var(--line-height-normal); white-space: pre-line; min-height: 112px; display: flex; align-items: center; border-bottom: var(--border-width-thin) solid var(--color-border-default);">${f.specimen}</div>
              <div style="padding: var(--spacing-md);">
                <div style="font-family: var(--font-family-base); font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin-bottom: var(--spacing-xs);">${f.name}</div>
                <div style="display: flex; gap: var(--spacing-xs); margin-bottom: var(--spacing-xs); flex-wrap: wrap; align-items: center;">
                  <candor-chip variant="${chipVariant}" label="${f.mode}"></candor-chip>
                  <candor-chip label="${f.voice}"></candor-chip>
                </div>
                <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 var(--spacing-xs) 0; line-height: var(--line-height-normal);">${f.use}</p>
                <code style="display: block; font-family: var(--font-family-mono); font-size: var(--font-size-xs); background: var(--color-bg-code); color: var(--color-text-code); border: var(--border-width-thin) solid var(--color-border-code); padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--radius-sm);">${f.variable}</code>
              </div>
            </candor-card>
          `;
        }).join('')}
      </div>
    </section>

    <section>
      <div style="margin-bottom: var(--spacing-lg);">
        <h2 style="font-family: var(--font-family-display); font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0 0 var(--spacing-xs) 0; line-height: var(--line-height-tight);">Type Scale</h2>
        <p style="font-size: var(--font-size-md); color: var(--color-text-subtle); margin: 0; line-height: var(--line-height-normal);">
          Major Third ratio (1.25×) from a 1rem (16px) base. The 14px floor
          (<code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">--font-size-sm</code>) is the minimum for readable
          text. <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">--font-size-xs</code> (12px) is for decorative
          and non-text use only.
        </p>
      </div>

      <div style="border: var(--border-width-thin) solid var(--color-border-default); border-radius: var(--radius-md); overflow: hidden; background: var(--color-bg-surface);">
        ${TYPE_SCALE.map((s, i) => {
          const floorStyle = s.isFloor ? `box-shadow: inset var(--border-width-thick) 0 0 var(--color-action-primary);` : '';
          const opacity = s.isDecorative ? '0.55' : '1';
          const isLast = i === TYPE_SCALE.length - 1;
          return `
            <div style="display: grid; grid-template-columns: 5rem 1fr; align-items: center; padding: var(--spacing-sm) var(--spacing-md); ${isLast ? '' : 'border-bottom: var(--border-width-thin) solid var(--color-border-strong);'} gap: var(--spacing-md); ${floorStyle} opacity: ${opacity};">
              <div style="font-family: var(--font-family-base); font-weight: var(--font-weight-semibold); color: var(--color-text-default); line-height: 1; text-align: right; font-optical-sizing: auto; font-size: ${s.size};">Aa</div>
              <div style="display: flex; align-items: baseline; gap: var(--spacing-sm); flex-wrap: wrap;">
                <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.4em; border-radius: var(--radius-sm); flex-shrink: 0;">${s.token}</code>
                <span style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; flex-shrink: 0;">${s.size} · ${s.px}</span>
                <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">${s.use}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

  </div>
`;

const sizeRampHeaders = ['Size', 'Token', 'Regular', 'Bold', 'Notes'];
const sizeRampRows = [
  { cells: ['≥ 24px', '3xl – xl', '3.0', '3.0', 'WCAG large text — both weights qualify'] },
  { cells: ['19 – 23px', '—', '4.5', '3.0', 'Bold qualifies as large from 18.67px; regular does not until 24px'] },
  { cells: ['16 – 18px', '--font-size-md', '4.5', '4.5', 'WCAG 4.5 floor — binds both weights'] },
  { cells: ['15px', '—', '6.5', '4.5', 'Sub-16px ramp (editorially derived)'] },
  { cells: ['14px', '--font-size-sm', '9.5', '6.5', 'Candor readable text floor — demand more than doubles vs. 16px'] },
  { cells: ['13px', '—', '13.8', '9.5', 'Not in Candor scale — ramp context only'] },
  { cells: ['12px', '--font-size-xs', '20', '13.8', 'Decorative / non-text only — 20 = black on white'] },
  { cells: ['< 12px', '—', '—', '—', 'Not supported — contrast cannot compensate for letterform resolution failure'] },
];

const tierHeaders = ['Tier', 'Perceptual task', '14px regular', '14px bold', 'Candor components'];
const tierRows = [
  { cells: ['1 — Reading', 'Sequential decoding — must read to act', '9.5', '6.5', 'Toast message, alert body, modal prose, form error messages, article inline text'] },
  { cells: ['2 — Functional UI', 'Recognition — sole channel for meaning', '6.5', '4.5', 'Breadcrumb links (bold), pagination numbers, table cell data, accordion quiet headings (bold), chip labels'] },
  { cells: ['3 — Supplementary', 'Pattern match — meaning redundantly coded', '4.5', '4.5', 'Badge text, hint text, breadcrumb separators, pagination ellipsis, stat labels, table metadata'] },
];

const renderContrastGuidance = () => `
  <div style="max-width: 720px; display: flex; flex-direction: column; gap: var(--spacing-xl); padding-bottom: var(--spacing-xl);">

    <section>
      <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin: 0 0 var(--spacing-sm);">Size ramp — Tier 1 (reading text) baseline</p>
      <candor-table compact
        headers='${JSON.stringify(sizeRampHeaders)}'
        rows='${JSON.stringify(sizeRampRows)}'></candor-table>
    </section>

    <section>
      <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); margin: 0 0 var(--spacing-xs);">Use-case tiers — 14px adjustments</p>
      <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 var(--spacing-sm);">The size ramp above assumes fluent reading. At 14px the tier system relaxes the threshold for text whose perceptual task is recognition rather than sequential decoding.</p>
      <candor-table
        headers='${JSON.stringify(tierHeaders)}'
        rows='${JSON.stringify(tierRows)}'></candor-table>
    </section>

    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
      <candor-alert variant="warning" heading="Tier 2 authoring constraint" style="display: block;"
        message="--color-text-subtle (OKCA 4.6) fails the 6.5 regular threshold. Functional 14px text using this token must be bold — bold OKCA 4.6 passes the 4.5 bold floor.">
      </candor-alert>
      <candor-alert variant="info" heading="Tier 3 condition" style="display: block;"
        message="Redundancy must be verified per component. Color-alone does not qualify — the redundant channel must be shape, icon, or spatial context so it holds under colorblindness. This tier is assigned by the system; it is not a consumer opt-in.">
      </candor-alert>
    </div>

  </div>
`;

const meta: Meta = {
  title: 'Design Tokens/Typography',
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
Four-voice typographic system aligned to two cognitive modes:

- **Execution** (task completion, navigation, scanning): Roboto Flex, Roboto Mono, Atkinson Hyperlegible
- **Interpretation** (reading, reflecting, conversing): Noto Serif, Noto Sans

Type scale uses a **Major Third ratio (1.25×)** from a 1rem (16px) base. The Major Third
sits between Minor Third (1.2× — steps too subtle for scanning-heavy UIs) and Perfect
Fourth (1.333× — steps too dramatic for dense data layouts). Two factors make the
conservative ratio work: Candor's five typefaces already carry intrinsic visual weight
through their distinct letterforms and stroke character, so the scale reinforces hierarchy
rather than having to create it alone; and Roboto Flex's optical sizing axis (\`opsz\`) adds
perceived weight as size increases, meaning the effective hierarchy reads larger than the
numeric ratio.

Minimum readable text size is 14px (\`--font-size-sm\`). \`--font-size-xs\` (12px) is for
decorative and non-text use only.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Showcase: Story = {
  render: () => ({ template: renderShowcase() }),
};

export const OKCAContrastGuidance: Story = {
  name: 'Contrast Guidance',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `
Candor's contrast requirements have **two axes**: font size and use-case tier.

**Size axis** — OKCA raises the required score as text shrinks. Contrast demand more than
doubles between 16px and 14px for regular-weight text. The ramp is anchored at the WCAG 4.5
floor at 16px and at the maximum achievable OKCA score (20 — black on white) at 12px.

**Use-case tier axis** — the size penalty at 14px applies in full only to text that is read
sequentially. The visual system processes short labels and pattern-matched status text
differently from fluent prose. Three tiers adjust the 14px threshold accordingly.

> Sub-16px ramp values (12–15px) are editorially derived from geometric interpolation between
> known anchors, not from a named standard. OKCA is polarity-aware and chroma-compressed —
> passing OKCA also passes WCAG (zero false-pass guarantee).
        `.trim(),
      },
    },
  },
  render: () => ({ template: renderContrastGuidance() }),
};
