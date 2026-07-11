import React from 'react';
import { html } from 'lit';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Design Tokens/Icons',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: () => React.createElement(React.Fragment, null,
        React.createElement(Title, null),
        React.createElement(Description, null),
        React.createElement(Stories, { includePrimary: true })
      ),
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

Icons inherit \`font-size\` from their container, which works when the icon should match
the surrounding text. When you need a specific size, set it explicitly — and always pair
with \`line-height: 1\` to prevent baseline shift:

\`\`\`html
<i class="ph-fill ph-x" style="font-size: 1.25rem; line-height: 1;" aria-hidden="true"></i>
\`\`\`

## Using icons inside shadow DOM

The Phosphor font classes (\`ph-fill\`, \`ph-bold\`, \`ph\`) are **global CSS rules**, and
global CSS does not cross shadow boundaries. Where your \`<i>\` lives decides whether they
apply:

| Where the \`<i class="ph-…">\` is authored | Font classes work? |
|---|---|
| Main document (light DOM) | ✅ Yes |
| Slotted into a Candor component **from the main document** | ✅ Yes — slotted content stays in the document's light DOM, so global rules reach it |
| Inside **your own** web component's shadow root (incl. slotting into a Candor component from *within* your component) | ❌ No — global \`.ph-*\` rules never enter a shadow root |

So if you are building your own web components (Candor's own model), the font-class path
**silently fails** — the \`@font-face\` is global so the font loads, but the \`.ph-*\` class
rules that set \`font-family\` / \`::before { content }\` don't reach into your shadow root, and
the \`<i>\` renders nothing.

**Fix — inline the SVG path.** Render the glyph as an inline \`<svg>\` with \`currentColor\`,
which lives in your shadow DOM and needs no external stylesheet — exactly what Candor's own
components do:

\`\`\`html
<svg aria-hidden="true" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
  <path d="…phosphor path data…" />
</svg>
\`\`\`

Copy the path \`d\` from \`@phosphor-icons/core\` (the SVG source, not the web font), or from
Candor's bundled set for the handful it uses internally (below).

## Bundled Phosphor SVG paths

The WC components that need icons internally — \`candor-accordion-item\`, \`candor-menu\`,
\`candor-select\`, \`candor-pagination\`, \`candor-listbox\`, \`candor-combobox\`,
\`candor-alert\`, \`candor-toast\`, \`candor-drawer\`, \`candor-modal\`, \`candor-chip\`,
\`candor-chat-input\` — ship the SVG path data inline (see \`src/web-components/icons.ts\`)
so they don't depend on the \`@phosphor-icons/web\` stylesheet being loaded. This is the
same inline-SVG approach shadow-DOM consumers should use for their own icons (see above).
\`src/web-components/icons.ts\` exports only the ~9 glyphs the components use — it is not a
general icon library; for anything else, take the path from \`@phosphor-icons/core\`.

## Full icon reference

[phosphoricons.com](https://phosphoricons.com) — search by name, preview all weights.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const WeightComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The same icon (`ph-bell`) at all three Phosphor weights. Fill reads as a solid object — use for primary interactive affordances. Bold reads as an emphatic stroke — use for directional affordances like carets and arrows. Regular recedes into context — use for status indicators and ambient decoration.',
      },
    },
  },
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: var(--spacing-md);">

      <candor-card variant="default" padding="lg" role="group" aria-labelledby="icon-weight-fill">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
            <h3 id="icon-weight-fill" style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0;">Fill</h3>
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px; align-self: flex-start;">ph-fill</code>
            <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0;">High-salience interactions — buttons, toggles, active states</p>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; padding: var(--spacing-md) 0;">
            <i class="ph-fill ph-bell" style="font-size: 3rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
          </div>
        </div>
      </candor-card>

      <candor-card variant="default" padding="lg" role="group" aria-labelledby="icon-weight-bold">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
            <h3 id="icon-weight-bold" style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0;">Bold</h3>
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px; align-self: flex-start;">ph-bold</code>
            <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0;">Directional affordances — carets, arrows, interactive indicators</p>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; padding: var(--spacing-md) 0;">
            <i class="ph-bold ph-bell" style="font-size: 3rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
          </div>
        </div>
      </candor-card>

      <candor-card variant="default" padding="lg" role="group" aria-labelledby="icon-weight-regular">
        <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
          <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
            <h3 id="icon-weight-regular" style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0;">Regular</h3>
            <code style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px; align-self: flex-start;">ph</code>
            <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0;">Ambient and informational — status indicators, metadata, decoration</p>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; padding: var(--spacing-md) 0;">
            <i class="ph ph-bell" style="font-size: 3rem; line-height: 1; color: var(--color-text-default);" aria-hidden="true"></i>
          </div>
        </div>
      </candor-card>

    </div>
  `,
};

export const InContext: Story = {
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
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 480px;">

      <div style="display: flex; gap: var(--spacing-sm);">
        <candor-button variant="primary">
          <i class="ph-fill ph-plus" style="font-size: 1rem; line-height: 1; margin-right: 0.35em;" aria-hidden="true"></i>
          Add item
        </candor-button>
        <candor-button variant="secondary">
          <i class="ph-fill ph-magnifying-glass" style="font-size: 1rem; line-height: 1; margin-right: 0.35em;" aria-hidden="true"></i>
          Search
        </candor-button>
      </div>

      <candor-alert variant="success" message="Changes saved successfully." dismissible style="display: block;"></candor-alert>

      <candor-accordion-item heading="Settings">
        <p style="margin: 0; font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-subtle);">Notification preferences, display options, and account defaults.</p>
      </candor-accordion-item>

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
};

export const AccessibilityPatterns: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Correct accessibility patterns for icon usage with \`<candor-button>\`.

- **Decorative icons** (adjacent visible text): \`aria-hidden="true"\` only — the button's text label is the accessible name
- **Icon-only buttons** (no visible text): \`aria-hidden="true"\` on the icon + \`aria-label\` on \`<candor-button>\` — the component reflects it onto the inner \`<button>\`
- Never put \`aria-label\` on the \`<i>\` element — icon fonts are not semantically meaningful elements
        `.trim(),
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--spacing-md); max-width: 540px;">

      <candor-card variant="default" padding="md" role="group" aria-labelledby="pattern-a-heading">
        <div slot="header">
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-subtle); margin: 0 0 var(--spacing-xs);">Pattern A</p>
          <h3 id="pattern-a-heading" style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0;">Decorative icon</h3>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0;">Icon is paired with visible text — the text label is the accessible name. Add <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px;">aria-hidden="true"</code> to remove the icon from the accessibility tree.</p>
          <candor-button variant="primary" style="align-self: flex-start;">
            <i class="ph-fill ph-download-simple" style="font-size: 1rem; line-height: 1; margin-right: 0.35em;" aria-hidden="true"></i>
            Download
          </candor-button>
          <pre style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); background: var(--color-bg-code); color: var(--color-text-code); border: var(--border-width-thin) solid var(--color-border-code); padding: var(--spacing-md); border-radius: var(--radius-md); margin: 0; overflow-x: auto; line-height: var(--line-height-normal);">&lt;candor-button variant="primary"&gt;
  &lt;i class="ph-fill ph-download-simple" aria-hidden="true"&gt;&lt;/i&gt;
  Download
&lt;/candor-button&gt;</pre>
        </div>
      </candor-card>

      <candor-card variant="default" padding="md" role="group" aria-labelledby="pattern-b-heading">
        <div slot="header">
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text-subtle); margin: 0 0 var(--spacing-xs);">Pattern B</p>
          <h3 id="pattern-b-heading" style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0;">Icon-only button</h3>
        </div>
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0;">No visible text — the accessible name must be provided via <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px;">aria-label</code> on <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px;">&lt;candor-button&gt;</code>, which reflects it onto the inner <code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); color: var(--color-highlight); padding: 0.1em 0.35em; border-radius: 3px;">&lt;button&gt;</code>.</p>
          <candor-button variant="ghost" aria-label="Notifications" style="align-self: flex-start;">
            <i class="ph-fill ph-bell" style="font-size: 1.25rem; line-height: 1;" aria-hidden="true"></i>
          </candor-button>
          <pre style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); background: var(--color-bg-code); color: var(--color-text-code); border: var(--border-width-thin) solid var(--color-border-code); padding: var(--spacing-md); border-radius: var(--radius-md); margin: 0; overflow-x: auto; line-height: var(--line-height-normal);">&lt;candor-button variant="ghost" aria-label="Notifications"&gt;
  &lt;i class="ph-fill ph-bell" aria-hidden="true"&gt;&lt;/i&gt;
&lt;/candor-button&gt;</pre>
        </div>
      </candor-card>

    </div>
  `,
};
