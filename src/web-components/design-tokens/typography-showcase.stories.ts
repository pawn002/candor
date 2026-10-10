import React from 'react';
import { html } from 'lit';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import '../components/alert/candor-alert';
import '../components/card/candor-card';
import '../components/chip/candor-chip';
import '../components/table/candor-table';
import { allModes } from '../../../.storybook/modes';

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

const renderShowcase = () => html`
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

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: var(--spacing-lg);">
        ${FONT_FAMILIES.map(f => {
          const isInterp = f.mode === 'Interpretation';
          const accentColor = isInterp ? 'var(--color-action-secondary)' : 'var(--color-action-primary)';
          const chipVariant = isInterp ? 'secondary' : 'primary';
          return html`
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
                <code style="display: block; font-family: var(--font-family-mono); font-size: var(--font-size-sm); background: var(--color-bg-code); color: var(--color-text-code); border: var(--border-width-thin) solid var(--color-border-code); padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--radius-sm);">${f.variable}</code>
              </div>
            </candor-card>
          `;
        })}
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
        <p style="font-size: var(--font-size-md); color: var(--color-text-subtle); margin: var(--spacing-sm) 0 0; line-height: var(--line-height-normal);">
          Reaching for the 12px row has two conditions attached. It is <strong style="color: var(--color-text-default); font-weight: var(--font-weight-semibold);">not reachable through
          <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">&lt;candor-text&gt;</code></strong>
          — that component's scale stops at 14px, because a component for readable text should not
          offer a size at which text is not permitted. Set the token directly on the element that
          needs it. And <strong style="color: var(--color-text-default); font-weight: var(--font-weight-semibold);">the audit will fail the build</strong> unless the declaration
          declares why, with a
          <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">12px-ok: badge-chrome</code>
          or
          <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">12px-ok: icon</code>
          comment — because 12px carries no contrast floor in either axis, so using it silently
          removed the text from contrast auditing altogether (#230).
        </p>
      </div>

      <div style="border: var(--border-width-thin) solid var(--color-border-default); border-radius: var(--radius-md); overflow: hidden; background: var(--color-bg-surface);">
        ${TYPE_SCALE.map((s, i) => {
          const floorStyle = s.isFloor ? `box-shadow: inset var(--border-width-thick) 0 0 var(--color-action-primary);` : '';
          const opacity = s.isDecorative ? '0.55' : '1';
          const isLast = i === TYPE_SCALE.length - 1;
          return html`
            <div style="display: grid; grid-template-columns: 5rem 1fr; align-items: center; padding: var(--spacing-sm) var(--spacing-md); ${isLast ? '' : 'border-bottom: var(--border-width-thin) solid var(--color-border-strong);'} gap: var(--spacing-md); ${floorStyle} opacity: ${opacity};">
              <div style="font-family: var(--font-family-base); font-weight: var(--font-weight-semibold); color: var(--color-text-default); line-height: 1; text-align: right; font-optical-sizing: auto; font-size: ${s.size};">Aa</div>
              <div style="display: flex; align-items: baseline; gap: var(--spacing-sm); flex-wrap: wrap;">
                <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.4em; border-radius: var(--radius-sm); flex-shrink: 0;">${s.token}</code>
                <span style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; flex-shrink: 0;">${s.size} · ${s.px}</span>
                <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">${s.use}</span>
              </div>
            </div>
          `;
        })}
      </div>
    </section>

    <section style="margin-top: var(--spacing-2xl);">
      <div style="margin-bottom: var(--spacing-lg);">
        <h2 style="font-family: var(--font-family-display); font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0 0 var(--spacing-xs) 0; line-height: var(--line-height-tight);">Leading</h2>
        <p style="font-size: var(--font-size-md); color: var(--color-text-subtle); margin: 0; line-height: var(--line-height-normal);">
          Line height tightens as type grows. It is a multiplier, so the gap between lines already
          grows with the size; large type wants proportionally less of it, or a wrapped heading
          reads as separate phrases rather than one line that broke (#264). Leading only shows when
          a heading wraps, so check headings at narrow widths.
          <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">candor-heading</code> and <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: var(--radius-sm);">candor-article</code>
          apply the heading rows below by level.
        </p>
      </div>
      <candor-table compact
        headers='${JSON.stringify(leadingHeaders)}'
        rows='${JSON.stringify(leadingRows)}'></candor-table>
    </section>

  </div>
`;

const leadingHeaders = ['Token', 'Value', 'Use'];
const leadingRows = [
  { cells: ['--line-height-display', '1.1', 'Display headings, 31px and up (h1, h2)'] },
  { cells: ['--line-height-snug', '1.2', 'Subsection headings, 20–25px (h3, h4)'] },
  { cells: ['--line-height-tight', '1.25', 'Body-sized headings (h5, h6) and compact UI: labels, buttons, badges'] },
  { cells: ['--line-height-normal', '1.5', 'UI text and short prose'] },
  { cells: ['--line-height-relaxed', '1.75', 'Long-form reading (candor-article body)'] },
];

const sizeRampHeaders = ['Size', 'Token', 'Regular', 'Bold', 'Notes'];
const sizeRampRows = [
  { cells: ['≥ 24px', '3xl – xl', '3.0', '3.0', 'WCAG large text — both weights qualify'] },
  { cells: ['19 – 23px', '—', '4.5', '3.0', 'Bold qualifies as large from 18.67px; regular does not until 24px'] },
  { cells: ['16 – 18px', '--font-size-md', '4.5', '4.5', 'WCAG 4.5 floor — binds both weights'] },
  { cells: ['14px', '--font-size-sm', '9.5', '6.5', 'Smallest text size. 9.5 is what neutral reading text needs here; no coloured text reaches it (#240), so Tier 1 regular text is 16px or larger'] },
  { cells: ['12px and below', '--font-size-xs', '—', '—', 'Decorative / non-text only (badge chrome, icons). No text is rendered here, so no floor applies'] },
];

const tierHeaders = ['Tier', 'Perceptual task', '14px regular', '14px bold', 'Candor components'];
const tierRows = [
  { cells: ['1 — Reading', 'Sequential decoding — must read to act', 'not permitted — use 16px', '6.5', 'Toast message, alert body, modal prose, form error messages, article inline text'] },
  { cells: ['2 — Functional UI', 'Recognition — sole channel for meaning', '6.5', '4.5', 'Breadcrumb links (bold), pagination numbers, table cell data, chip labels'] },
  { cells: ['3 — Supplementary', 'Pattern match — meaning redundantly coded', '4.5', '4.5', 'Badge text, hint text, breadcrumb separators, pagination ellipsis, stat labels, table metadata, accordion quiet headings (wght 500 — structural nesting is the redundant channel)'] },
];

const renderContrastGuidance = () => html`
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
        message="--color-text-subtle (OKCA 5.0 on page) fails the 6.5 regular threshold. Functional 14px text using this token must be bold (wght ≥ 700) — the same score clears the 4.5 bold floor.">
      </candor-alert>
      <candor-alert variant="info" heading="Tier 3 condition" style="display: block;"
        message="Redundancy must be verified per component. Color-alone does not qualify — the redundant channel must be shape, icon, or spatial context so it holds under colorblindness. This tier is assigned by the system; it is not a consumer opt-in.">
      </candor-alert>
      <candor-alert variant="info" heading="Variable font weight axis" style="display: block;"
        message="'Bold' in this table means wght ≥ 700 (the CSS font-weight axis). Non-wght axes — GRAD, opsz, wdth — affect perceived stroke weight visually but do not change the compliance column. A heading at font-weight: 500 with GRAD: -150 is regular for compliance purposes regardless of how it reads on screen.">
      </candor-alert>
    </div>

  </div>
`;

const meta: Meta = {
  title: 'Design Tokens/Typography',
  tags: ['autodocs'],
  parameters: {
    chromatic: { modes: { light: allModes.light, dark: allModes.dark } },
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
decorative and non-text use only — icon glyphs and badge chrome, not language.

That is enforced rather than asked for: \`npm run audit:contrast\` fails on any sub-14px
\`font-size\` in \`src/\` that does not carry a \`12px-ok: <reason>\` marker naming a reason the
audit recognises. The check lives in the *contrast* audit because 12px has no OKCA floor
defined for it, so setting it on text used to remove that text from auditing silently (#230).
\`candor-text\` no longer offers an \`xs\` size at all.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Showcase: Story = {
  render: () => renderShowcase(),
};

export const OKCAContrastGuidance: Story = {
  name: 'Contrast Guidance',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `
Candor's contrast requirements have **two axes**: font size and use-case tier.

**Size axis** — at 16px and above the floors are WCAG's: 4.5, dropping to 3.0 for large
text. Below 16px Candor sets its own, higher floors. They are a **margin**, not a measured
requirement. A pair sitting exactly on the WCAG line has nothing to spare against the display
brightness and ambient light it will actually be read in, and smaller text has less to spare,
so the floor rises. No specific score is known to be needed at a specific size — OKCA does not
model viewing conditions, and makes no such claim — so treat the 14px figures as policy, not as
measurements of legibility.

**14px is the only sub-16px size that carries text**, so it is the only row. 12px is decorative
and carries no floor. The 14px regular figure, 9.5, is what a neutral reading passage needs
there. Neutral text reaches it (\`--color-text-default\` is OKCA 11.5 on page), but no
coloured text in the system can (#240). That is why Tier 1 regular text must be 16px or larger
rather than held to 9.5: a floor only near-black text can meet would quietly ban colour from
must-read text.

**Use-case tier axis** — this adjusts the 14px row only. Text read sequentially keeps the full
floor; short labels and pattern-matched status text, which the eye recognises rather than
reads, carry lower ones. Three tiers set the 14px threshold accordingly. At 16px and above
every tier has the same floor.

> OKCA is polarity-aware and chroma-compressed — passing OKCA also passes WCAG (zero
> false-pass guarantee).
        `.trim(),
      },
    },
  },
  render: () => renderContrastGuidance(),
};
