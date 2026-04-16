import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../../button/button.component';
import { AlertComponent } from '../../alert/alert.component';

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

Import the three weights in your global stylesheet:

\`\`\`css
@import '@phosphor-icons/web/bold/style.css';
@import '@phosphor-icons/web/fill/style.css';
@import '@phosphor-icons/web/regular/style.css';
\`\`\`

> **Import order matters.** Each weight sets \`font-family: !important\` on its base class.
> Never put two weight classes on the same element — the last-imported stylesheet wins
> and the other is silently ignored.

## Usage

Each weight has its own base class. Use one base class per icon element:

\`\`\`html
<!-- Fill — action icon -->
<i class="ph-fill ph-x" aria-hidden="true"></i>

<!-- Bold — directional affordance -->
<i class="ph-bold ph-caret-down" aria-hidden="true"></i>

<!-- Regular — informational -->
<i class="ph ph-info" aria-hidden="true"></i>
\`\`\`

> **There is no \`ph-regular\` class.** The regular weight's base class is simply \`ph\`.

Always add \`aria-hidden="true"\` to decorative icons. For icons that carry meaning
without adjacent text, add a visually-hidden \`<span class="sr-only">\` label instead.

## Three-tier weight convention

| Weight | Base class | When to use | Why |
|---|---|---|---|
| **Fill** | \`ph-fill\` | Action icons — close, dismiss, add, search, download | Solid forms read as "tappable objects" — the fill signals intent to act |
| **Bold** | \`ph-bold\` | Directional affordances — carets, chevrons, arrows | Bold outline is enough for directional cues; fill would over-weight a subtle hint |
| **Regular** | \`ph\` | Informational / status — alerts, badges, metadata, decorative | Lighter weight recedes; the adjacent text or color carries the meaning |

## Sizing

Icons inherit \`font-size\` from their container. Set size explicitly and always pair
with \`line-height: 1\` to prevent baseline shift:

\`\`\`html
<i class="ph-fill ph-x" style="font-size: 1.25rem; line-height: 1;" aria-hidden="true"></i>
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

// ── Three-tier weight comparison ───────────────────────────────────────────────

export const WeightComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The same icon at all three weights. Fill reads as an object to press; bold reads as a directional hint; regular recedes into context.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">

        <div style="display: flex; gap: var(--spacing-2xl); align-items: flex-start;">

          <!-- Fill — action icons -->
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
            <p style="
              font-family: var(--font-family-base); font-size: var(--font-size-sm);
              font-weight: var(--font-weight-semibold); text-transform: uppercase;
              letter-spacing: var(--letter-spacing-wide); color: var(--color-text-subtle); margin: 0;
            ">ph-fill — action</p>
            <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-fill ph-x" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-x</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-fill ph-plus" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-plus</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-fill ph-magnifying-glass" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-magnifying-glass</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-fill ph-bell" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-bell</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-fill ph-download-simple" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-download-simple</span>
              </div>
            </div>
          </div>

          <!-- Bold — directional affordances -->
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
            <p style="
              font-family: var(--font-family-base); font-size: var(--font-size-sm);
              font-weight: var(--font-weight-semibold); text-transform: uppercase;
              letter-spacing: var(--letter-spacing-wide); color: var(--color-text-subtle); margin: 0;
            ">ph-bold — directional</p>
            <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-bold ph-caret-down" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-caret-down</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-bold ph-caret-right" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-caret-right</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph-bold ph-arrow-left" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-arrow-left</span>
              </div>
            </div>
          </div>

          <!-- Regular — informational -->
          <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); align-items: center;">
            <p style="
              font-family: var(--font-family-base); font-size: var(--font-size-sm);
              font-weight: var(--font-weight-semibold); text-transform: uppercase;
              letter-spacing: var(--letter-spacing-wide); color: var(--color-text-subtle); margin: 0;
            ">ph — regular (informational)</p>
            <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; justify-content: center;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-info" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-info</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-check-circle" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-check-circle</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-warning" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-warning</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-x-circle" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
                <span style="font-family: var(--font-family-mono); font-size: 0.7rem; color: var(--color-text-subtle);">ph-x-circle</span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;">
                <i class="ph ph-sparkle" style="font-size: 1.5rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
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
  decorators: [
    moduleMetadata({ imports: [ButtonComponent, AlertComponent] }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Icons in realistic UI contexts demonstrating all three tiers.

- **Buttons** use fill — solid forms signal action intent
- **Accordion / dropdown carets** use bold — a directional hint, not an action object
- **Metadata icons** use regular — informational content, the colour carries the meaning
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 480px;">

        <!-- Buttons: fill icons -->
        <div style="display: flex; gap: var(--spacing-sm);">
          <app-button variant="primary">
            <i class="ph-fill ph-plus" style="font-size: 1rem; line-height: 1; margin-right: 0.35em;" aria-hidden="true"></i>
            Add item
          </app-button>
          <app-button variant="secondary">
            <i class="ph-fill ph-magnifying-glass" style="font-size: 1rem; line-height: 1; margin-right: 0.35em;" aria-hidden="true"></i>
            Search
          </app-button>
        </div>

        <!-- Alert: status feedback -->
        <app-alert variant="success" message="Changes saved successfully." [dismissible]="true" style="display: block;"></app-alert>

        <!-- Accordion-style row: bold caret (directional) -->
        <div style="
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md); cursor: pointer;
        ">
          <span style="font-family: var(--font-family-base); font-size: var(--font-size-md);">Settings</span>
          <!-- directional affordance — bold (ph-bold) -->
          <i class="ph-bold ph-caret-down" style="font-size: 1rem; line-height: 1; color: var(--color-text-subtle);" aria-hidden="true"></i>
        </div>

        <!-- Metadata strip: regular icons (informational) -->
        <div style="
          display: flex; gap: var(--spacing-md); align-items: center;
          padding: var(--spacing-xs) 0;
        ">
          <span style="display: flex; align-items: center; gap: 0.375rem; font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
            <i class="ph ph-calendar" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            12 Apr 2026
          </span>
          <span style="display: flex; align-items: center; gap: 0.375rem; font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
            <i class="ph ph-user" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            J. Rampling
          </span>
          <span style="display: flex; align-items: center; gap: 0.375rem; font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
            <i class="ph ph-tag" style="font-size: 1rem; line-height: 1;" aria-hidden="true"></i>
            Planning
          </span>
        </div>

      </div>
    `,
  }),
};

// ── Accessibility patterns ─────────────────────────────────────────────────────

export const AccessibilityPatterns: Story = {
  decorators: [
    moduleMetadata({ imports: [ButtonComponent] }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Correct accessibility patterns for icon usage with \`app-button\`.

- **Decorative icons** (adjacent visible text): \`aria-hidden="true"\` only — the button's text label is the accessible name
- **Icon-only buttons** (no visible text): \`aria-hidden="true"\` on the icon + \`ariaLabel\` input on \`app-button\` — sets \`aria-label\` on the inner button element
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
          <app-button variant="primary">
            <i class="ph-fill ph-download-simple" style="font-size: 1rem; line-height: 1; margin-right: 0.35em;" aria-hidden="true"></i>
            Download
          </app-button>
          <pre style="font-family: var(--font-family-mono); font-size: 0.75rem; background: var(--color-bg-surface); padding: 0.5rem; border-radius: var(--radius-sm); margin: 0;">&lt;app-button variant="primary"&gt;
  &lt;i class="ph-fill ph-download-simple" aria-hidden="true"&gt;&lt;/i&gt;
  Download
&lt;/app-button&gt;</pre>
        </div>

        <!-- Pattern B: icon-only with ariaLabel -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <p style="font-family: var(--font-family-mono); font-size: 0.75rem; color: var(--color-text-subtle); margin: 0;">Pattern B — icon-only (ariaLabel input)</p>
          <app-button variant="ghost" ariaLabel="Notifications">
            <i class="ph-fill ph-bell" style="font-size: 1.25rem; line-height: 1;" aria-hidden="true"></i>
          </app-button>
          <pre style="font-family: var(--font-family-mono); font-size: 0.75rem; background: var(--color-bg-surface); padding: 0.5rem; border-radius: var(--radius-sm); margin: 0;">&lt;app-button variant="ghost" ariaLabel="Notifications"&gt;
  &lt;i class="ph-fill ph-bell" aria-hidden="true"&gt;&lt;/i&gt;
&lt;/app-button&gt;</pre>
        </div>

      </div>
    `,
  }),
};
