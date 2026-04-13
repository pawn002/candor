import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';

// Minimal host component — all content is inline HTML in the template.
@Component({
  selector: 'app-icons-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
class IconsShowcaseComponent {}

const meta: Meta<IconsShowcaseComponent> = {
  title: 'Design Tokens/Icons',
  component: IconsShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Candor uses **Phosphor Icons** as its icon system. Phosphor is a humanist icon family —
rounded, consistent stroke weights, no sharp corners — which aligns with Candor's
typeface choices (Roboto Flex, Noto Serif, Atkinson Hyperlegible).

## Installation

\`\`\`bash
npm install @phosphor-icons/web
\`\`\`

Import the CSS weights you need in your global stylesheet:

\`\`\`css
@import '@phosphor-icons/web/bold/style.css';   /* interactive controls */
@import '@phosphor-icons/web/regular/style.css'; /* informational / status */
\`\`\`

## Usage

Icons are CSS font-based — no SVG imports, no component wrappers needed:

\`\`\`html
<i class="ph ph-bell ph-bold" aria-hidden="true"></i>
\`\`\`

Always add \`aria-hidden="true"\` to decorative icons. For icons that carry meaning
without adjacent text, add a visually-hidden \`<span class="sr-only">\` label instead.

## Weight convention

| Weight | CSS class | When to use |
|---|---|---|
| **Bold** | \`ph-bold\` | Interactive controls — buttons, toggle affordances, navigation triggers |
| **Regular** | \`ph-regular\` | Informational and status — alerts, badges, metadata, decorative |

The rule mirrors the typographic weight convention: bold carries **action intent**, regular
carries **informational content**. An icon on a button that does something is bold; an icon
that tells you something is regular.

## Sizing

Icons inherit \`font-size\` from their container. Set size explicitly with inline style or
a utility class. Always pair with \`line-height: 1\` to prevent baseline shift:

\`\`\`html
<i class="ph ph-bell ph-bold"
   style="font-size: 1.25rem; line-height: 1;"
   aria-hidden="true"></i>
\`\`\`

## Full icon reference

[phosphoricons.com](https://phosphoricons.com) — search by name, preview all weights.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<IconsShowcaseComponent>;

// ── Weight comparison ──────────────────────────────────────────────────────────

export const WeightComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Same icon at Bold (interactive) and Regular (informational) weight side by side.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">

        <div style="display: flex; gap: var(--spacing-2xl); align-items: flex-start;">

          <!-- Bold — interactive -->
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-sm);
              font-weight: var(--font-weight-semibold);
              text-transform: uppercase;
              letter-spacing: var(--letter-spacing-wide);
              color: var(--color-text-subtle);
              margin: 0;
            ">ph-bold — interactive</p>
            <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-bell ph-bold" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-bell</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-x ph-bold" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-x</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-caret-down ph-bold" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-caret-down</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-plus ph-bold" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-plus</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-magnifying-glass ph-bold" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-magnifying-glass</span>
              </div>
            </div>
          </div>

          <!-- Regular — informational -->
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-sm);
              font-weight: var(--font-weight-semibold);
              text-transform: uppercase;
              letter-spacing: var(--letter-spacing-wide);
              color: var(--color-text-subtle);
              margin: 0;
            ">ph-regular — informational</p>
            <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-info ph-regular" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-info</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-check-circle ph-regular" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-check-circle</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-warning ph-regular" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-warning</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-x-circle ph-regular" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-x-circle</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-sparkle ph-regular" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-sparkle</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `,
  }),
};

// ── In-context examples ────────────────────────────────────────────────────────

export const InContext: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Icons in realistic UI contexts. Bold on button controls, regular on status and metadata.

Note: the dismiss button on a toast uses \`ph-bold\` (it's a control); the status icon
inside the toast uses \`ph-regular\` (it's informational).
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 480px;">

        <!-- Button with bold icon — action intent -->
        <div style="display: flex; gap: var(--spacing-sm);">
          <button style="
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: var(--color-action-primary); color: var(--color-text-on-action);
            border: none; border-radius: var(--radius-md);
            padding: var(--spacing-button-padding-y) var(--spacing-button-padding-x);
            font-family: var(--font-family-base); font-size: var(--font-size-md);
            font-weight: var(--font-weight-medium); cursor: pointer;
          ">
            <i class="ph ph-plus ph-bold" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            Add item
          </button>
          <button style="
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: transparent; color: var(--color-action-primary);
            border: var(--border-width-thin) solid var(--color-action-primary);
            border-radius: var(--radius-md);
            padding: var(--spacing-button-padding-y) var(--spacing-button-padding-x);
            font-family: var(--font-family-base); font-size: var(--font-size-md);
            font-weight: var(--font-weight-medium); cursor: pointer;
          ">
            <i class="ph ph-magnifying-glass ph-bold" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            Search
          </button>
        </div>

        <!-- Toast — regular status icon, bold dismiss -->
        <div style="
          display: flex; align-items: flex-start; gap: var(--spacing-sm);
          background: var(--color-status-success-bg);
          border: var(--border-width-thin) solid var(--color-status-success);
          border-radius: var(--radius-md); padding: var(--spacing-sm);
        ">
          <!-- informational — ph-regular -->
          <i class="ph ph-check-circle ph-regular" style="font-size: 1.25rem; line-height: 1; color: var(--color-status-success); flex-shrink: 0;" aria-hidden="true"></i>
          <span style="flex: 1; font-family: var(--font-family-base); font-size: var(--font-size-md);">Changes saved successfully.</span>
          <!-- interactive dismiss — ph-bold -->
          <button style="background: none; border: none; cursor: pointer; padding: 0; display: flex; color: var(--color-text-subtle);" aria-label="Dismiss">
            <i class="ph ph-x ph-bold" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Nav item — bold caret (interactive toggle affordance) -->
        <div style="
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md); cursor: pointer;
        ">
          <span style="font-family: var(--font-family-base); font-size: var(--font-size-md);">Settings</span>
          <!-- toggle affordance — ph-bold -->
          <i class="ph ph-caret-down ph-bold" style="font-size: 1rem; line-height: 1; color: var(--color-text-subtle);" aria-hidden="true"></i>
        </div>

        <!-- Metadata strip — regular icons (informational) -->
        <div style="
          display: flex; gap: var(--spacing-md); align-items: center;
          padding: var(--spacing-xs) 0;
        ">
          <span style="display: flex; align-items: center; gap: 0.375rem; font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
            <i class="ph ph-calendar ph-regular" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            12 Apr 2026
          </span>
          <span style="display: flex; align-items: center; gap: 0.375rem; font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
            <i class="ph ph-user ph-regular" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            J. Rampling
          </span>
          <span style="display: flex; align-items: center; gap: 0.375rem; font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
            <i class="ph ph-tag ph-regular" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            Planning
          </span>
        </div>

      </div>
    `,
  }),
};

// ── Accessibility patterns ─────────────────────────────────────────────────────

export const AccessibilityPatterns: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Correct accessibility patterns for icon usage.

- **Decorative icons** (adjacent visible text): \`aria-hidden="true"\` only — no label needed
- **Standalone icons** (no visible text): \`aria-hidden="true"\` on the icon + \`<span class="sr-only">\` for the label
- Never put \`aria-label\` on the \`<i>\` element — icon fonts are not semantically meaningful elements
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 480px;">

        <!-- Pattern A: decorative icon with visible label -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <p style="font-family: var(--font-family-mono); font-size: 0.75rem; color: var(--color-text-subtle); margin: 0;">Pattern A — decorative (aria-hidden only)</p>
          <button style="
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: var(--color-action-primary); color: var(--color-text-on-action);
            border: none; border-radius: var(--radius-md);
            padding: var(--spacing-button-padding-y) var(--spacing-button-padding-x);
            font-family: var(--font-family-base); font-size: var(--font-size-md);
            font-weight: var(--font-weight-medium); cursor: pointer;
          ">
            <!-- aria-hidden — the button text "Download" is the accessible name -->
            <i class="ph ph-download-simple ph-bold" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            Download
          </button>
          <pre style="font-family: var(--font-family-mono); font-size: 0.75rem; background: var(--color-bg-surface); padding: 0.5rem; border-radius: var(--radius-sm); margin: 0;">&lt;button&gt;
  &lt;i class="ph ph-download-simple ph-bold" aria-hidden="true"&gt;&lt;/i&gt;
  Download
&lt;/button&gt;</pre>
        </div>

        <!-- Pattern B: standalone icon with sr-only label -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <p style="font-family: var(--font-family-mono); font-size: 0.75rem; color: var(--color-text-subtle); margin: 0;">Pattern B — standalone (aria-hidden + sr-only span)</p>
          <button style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 2.5rem; height: 2.5rem;
            background: transparent; color: var(--color-text-subtle);
            border: var(--border-width-thin) solid var(--color-border-subtle);
            border-radius: var(--radius-md); cursor: pointer;
          ">
            <i class="ph ph-bell ph-bold" style="font-size: 1.25rem; line-height: 1;" aria-hidden="true"></i>
            <span style="position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); clip-path: inset(50%); white-space: nowrap;">Notifications</span>
          </button>
          <pre style="font-family: var(--font-family-mono); font-size: 0.75rem; background: var(--color-bg-surface); padding: 0.5rem; border-radius: var(--radius-sm); margin: 0;">&lt;button&gt;
  &lt;i class="ph ph-bell ph-bold" aria-hidden="true"&gt;&lt;/i&gt;
  &lt;span class="sr-only"&gt;Notifications&lt;/span&gt;
&lt;/button&gt;</pre>
        </div>

      </div>
    `,
  }),
};
