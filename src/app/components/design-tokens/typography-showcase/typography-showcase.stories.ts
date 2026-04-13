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

// ── OKCA contrast score guidance ──────────────────────────────────────────────
// Source: issue #62 / @pawn002/okca issue #11.
// OKCA is polarity-aware and applies chroma compression — its scores are always
// ≤ the equivalent WCAG score (FP = 0 guarantee). Passing OKCA at these thresholds
// also passes WCAG. The sub-16px ramp values (12–15px) are editorially derived
// from a geometric interpolation between known anchors, not from a named standard.

export const OKCAContrastGuidance: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**OKCA contrast score requirements by font size**

WCAG 2.x applies the same 4.5 floor to 16px and 10px alike — it is silent on small text.
OKCA closes that gap with a geometric ramp anchored at:
- **16px regular → 4.5** (WCAG normal text floor)
- **12px regular → 20** (maximum achievable OKCA score: black on white)

**Bold adjustment:** bold text at size N uses the threshold for regular text at N+1 (a one-pixel
shift, mirroring WCAG's own approach at the large text boundary). All bold values remain ≥ 4.5.

**Candor token mapping:** Candor's scale jumps from 14px (\`--font-size-sm\`) directly to 16px
(\`--font-size-md\`) — the 13px and 15px rows exist for interpolation context only. The 12px
floor row maps to \`--font-size-xs\`, which Candor already reserves for decorative/non-text use.

> The ramp values for 12–15px are editorially derived, not from a named accessibility standard.
> Re-validate when \`@pawn002/okca\` releases a new version.
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 640px; display: flex; flex-direction: column; gap: var(--spacing-lg);">

        <!-- OKCA contrast table -->
        <div style="display: flex; flex-direction: column; gap: 0;">

          <!-- Header -->
          <div style="
            display: grid;
            grid-template-columns: 5rem 5rem 5rem 5rem 1fr;
            padding: var(--spacing-xs) var(--spacing-sm);
            background: var(--color-bg-surface);
            border-bottom: 2px solid var(--color-border-default);
          ">
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Size</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Token</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Regular</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Bold</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; font-weight: 600; color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em;">Notes</span>
          </div>

          <!-- ≥24px large text -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">≥ 24px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">3xl–lg</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">3.0</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">3.0</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">WCAG large text — both weights qualify</span>
          </div>

          <!-- 23–19px transition zone -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">19–23px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">4.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">3.0</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Bold qualifies as large from 18.67px; regular does not until 24px</span>
          </div>

          <!-- 16–18px normal text -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); background: var(--color-bg-surface); align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">16–18px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">--f-md</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">4.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">4.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">WCAG 4.5 floor binds both weights</span>
          </div>

          <!-- 15px sub-16 ramp start -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">15px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">6.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">4.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Sub-16px ramp (editorially derived)</span>
          </div>

          <!-- 14px — Candor floor -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); border-left: 3px solid var(--color-status-warning); align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">14px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem;">--f-sm</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); font-weight: 600;">9.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); font-weight: 600;">6.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">Candor readable text floor — contrast demand more than doubles vs. 16px</span>
          </div>

          <!-- 13px — not in Candor scale, shown for ramp context -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); opacity: 0.6; align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">13px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">13.8</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">9.5</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Not in Candor scale — ramp context only</span>
          </div>

          <!-- 12px — OKCA floor -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); border-bottom: var(--border-width-thin) solid var(--color-border-subtle); opacity: 0.6; align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">12px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">--f-xs</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">20</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">13.8</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Decorative / non-text only — score of 20 = black on white</span>
          </div>

          <!-- <12px — unsupported -->
          <div style="display: grid; grid-template-columns: 5rem 5rem 5rem 5rem 1fr; padding: var(--spacing-xs) var(--spacing-sm); opacity: 0.4; align-items: center;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">&lt; 12px</span>
            <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">—</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">Not supported — contrast cannot compensate for letterform resolution failure</span>
          </div>

        </div>

        <!-- Key implication callout -->
        <div style="
          background: var(--color-status-warning-bg);
          border: var(--border-width-thin) solid var(--color-status-warning);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        ">
          <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">What this means at 14px (--font-size-sm)</span>
          <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm);">
            Regular text requires an OKCA score of <strong>9.5</strong> — more than double the 4.5 that WCAG requires at 16px.
            Bold text requires <strong>6.5</strong>. Verify with <code style="font-family: var(--font-family-mono);">cpqi contrast &lt;fg&gt; &lt;bg&gt; -q</code> before shipping any 14px token combination.
          </span>
        </div>

      </div>
    `,
  }),
};
