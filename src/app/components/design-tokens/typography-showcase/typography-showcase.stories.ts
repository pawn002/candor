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

export const Showcase: Story = {
  render: () => ({}),
};

// ── Size and weight guidance ───────────────────────────────────────────────────
// Based on OKCA (Accessible Perceptual Contrast Algorithm) contrast scores.
// OKCA models human perception more accurately than WCAG Lc for sub-16px text,
// where standard contrast ratios underestimate the additional legibility cost
// of smaller letterforms.

export const SizeAndWeightGuidance: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Sub-16px legibility guidance** — based on OKCA perceptual contrast analysis.

Standard WCAG 2.1 contrast ratios (4.5:1 normal text, 3:1 large text) were calibrated
for 16px body text. Below 16px, the same contrast ratio produces less perceived legibility
because smaller letterforms have thinner strokes, tighter counters, and reduced x-height.

OKCA (Optical/Kinetic Contrast Algorithm) models this degradation. The table below
gives practical guidance for Candor's token set:

| Token | Size | Minimum weight | Tracking | Notes |
|---|---|---|---|---|
| \`--font-size-3xl\` | 39px | 300 (light) | normal | Optical size compensates; lighter weights read clearly at this scale |
| \`--font-size-2xl\` | 31px | 400 (regular) | normal | |
| \`--font-size-xl\` | 25px | 400 (regular) | normal | |
| \`--font-size-lg\` | 20px | 400 (regular) | normal | |
| \`--font-size-md\` | 16px | 400 (regular) | normal | Base; standard WCAG thresholds apply |
| \`--font-size-sm\` | 14px | **500 (medium)** | +0.01–0.06em | **Floor for readable text.** Regular weight at 14px risks insufficient stroke weight on low-DPI displays |
| \`--font-size-xs\` | 12px | — | — | **Non-text only** — icons, badge chrome, decorative elements. Never use for readable content |

**The 14px floor rule:** \`--font-size-sm\` is the minimum size for any readable UI text.
At 14px, use at least \`font-weight: 500\` (medium) and apply positive letter-spacing to
prevent glyph clustering. The exact tracking value depends on the typeface:

| Typeface | 14px tracking | Reason |
|---|---|---|
| Roboto Flex | 0.01em | Variable \`opsz\` axis compensates partially |
| Atkinson Hyperlegible | **0.06em** | Wide glyphs cluster at small sizes — substantial tracking required |
| Roboto Mono | 0.02em | Monospace inherently spaced; light additional tracking only |

**Atkinson note:** Atkinson Hyperlegible is specifically designed for high legibility at
small sizes. Its wider letterforms and open counters make it the correct choice when
14px text must remain readable in adverse viewing conditions (glare, low contrast displays,
users with mild low vision). Never reduce its tracking below +0.02em.
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 720px; display: flex; flex-direction: column; gap: var(--spacing-lg);">

        <!-- Scale with weight guidance -->
        <div style="display: flex; flex-direction: column; gap: 0;">
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            background: var(--color-bg-surface);
            border-bottom: var(--border-width-thin) solid var(--color-border-default);
          ">
            <span style="font-family: var(--font-family-mono); font-size: 0.75rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Token</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.75rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Size</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.75rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Min weight</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.75rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Notes</span>
          </div>

          <!-- 3xl -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-3xl</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">39px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">300 light</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">opsz axis compensates; light reads clearly</span>
          </div>

          <!-- 2xl -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-2xl</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">31px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">400 regular</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);"></span>
          </div>

          <!-- xl -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-xl</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">25px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">400 regular</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);"></span>
          </div>

          <!-- lg -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-lg</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">20px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">400 regular</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);"></span>
          </div>

          <!-- md — base -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            background: var(--color-bg-surface);
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-md</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">16px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">400 regular</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Base — standard WCAG 4.5:1 applies</span>
          </div>

          <!-- sm — floor -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            border-left: 3px solid var(--color-status-warning);
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-sm</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">14px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); font-weight: 600;">500 medium</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">Readable text floor · positive tracking required</span>
          </div>

          <!-- xs — decorative only -->
          <div style="
            display: grid;
            grid-template-columns: 8rem 5rem 7rem 1fr;
            gap: 0;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            opacity: 0.6;
            align-items: center;
          ">
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">--font-size-xs</code>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">12px</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Decorative / non-text only — icons, badge chrome</span>
          </div>
        </div>

        <!-- Live weight comparison at 14px -->
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
          <p style="
            font-family: var(--font-family-base);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-semibold);
            text-transform: uppercase;
            letter-spacing: var(--letter-spacing-wide);
            color: var(--color-text-subtle);
            margin: 0;
          ">14px weight comparison (Roboto Flex)</p>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <span style="font-size: 14px; font-weight: 400; font-family: var(--font-family-base); letter-spacing: 0.01em;">400 regular — avoid at 14px for body text</span>
              <code style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">font-weight: 400</code>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <span style="font-size: 14px; font-weight: 500; font-family: var(--font-family-base); letter-spacing: 0.01em;">500 medium — minimum for 14px readable text</span>
              <code style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">font-weight: 500</code>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <span style="font-size: 14px; font-weight: 600; font-family: var(--font-family-base); letter-spacing: 0.01em;">600 semibold — for labels and emphasis at 14px</span>
              <code style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">font-weight: 600</code>
            </div>
          </div>

          <p style="
            font-family: var(--font-family-base);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-semibold);
            text-transform: uppercase;
            letter-spacing: var(--letter-spacing-wide);
            color: var(--color-text-subtle);
            margin: var(--spacing-sm) 0 0;
          ">14px tracking comparison (Atkinson Hyperlegible)</p>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <span style="font-size: 14px; font-weight: 400; font-family: var(--font-family-accessible); letter-spacing: 0;">No tracking — glyphs cluster</span>
              <code style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">letter-spacing: 0</code>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <span style="font-size: 14px; font-weight: 400; font-family: var(--font-family-accessible); letter-spacing: 0.02em;">+0.02em tracking — body annotation minimum</span>
              <code style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">letter-spacing: 0.02em</code>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <span style="font-size: 14px; font-weight: 400; font-family: var(--font-family-accessible); letter-spacing: 0.06em;">+0.06em tracking — badge / label recommended</span>
              <code style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">letter-spacing: 0.06em</code>
            </div>
          </div>
        </div>

      </div>
    `,
  }),
};
