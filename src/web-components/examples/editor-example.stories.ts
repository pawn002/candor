import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../components/badge/candor-badge';
import '../components/button/candor-button';
import '../components/toast/candor-toast';
import '../components/toolbar/candor-toolbar';
import '../components/typography/accessible-text/candor-accessible-text';
import '../components/typography/heading/candor-heading';
import '../components/typography/text/candor-text';

// Icon-only buttons follow the icon-weight rule (#296). A glyph with a fill form
// is drawn filled at 1.75rem; a stroke-only glyph (text formatting, align, list,
// link, arrows), whose fill form is a box, is drawn bold at 1.25rem. Both take
// --color-text-subtle from the button, so a pressed toggle's own colour still wins.
// The 2px padding keeps the button at 32px with the larger glyph inside.
const ICON_ONLY = 'padding:0.125rem;min-width:2rem;color:var(--color-text-subtle);';
const FILL_ICON = 'font-size:1.75rem;line-height:1;';
const BOLD_ICON = 'font-size:1.25rem;line-height:1;';

const meta: Meta = {
  title: 'Examples/Editor Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Document editor layout using \`<candor-toolbar>\`, \`<candor-toolbar-separator>\`,
\`<candor-button>\`, \`<candor-badge>\`, \`<candor-heading>\`, \`<candor-text>\`, and
\`<candor-toast>\`.

The toolbar implements the [ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
with roving tabindex. Tab moves focus into/out of the toolbar, arrow keys navigate between
controls inside it. Toolbar buttons use native \`<button>\` elements, not
\`<candor-button>\`, because roving tabindex requires direct focus management on the
element itself.

**The \`btn btn-ghost btn-sm\` classes on these buttons are Storybook-only.** They
exist in the Storybook harness but are not shipped in \`@candor-design/tokens\`. Don't
copy them into an app; style your own \`<button>\`s instead. See the Toolbar story for
the full note.

Separators (\`<candor-toolbar-separator>\`) divide the toolbar into logical groups (text style
vs. alignment vs. insert). The Badge on the document title communicates draft/published
status at a glance without requiring the user to open a settings panel.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DocumentEditor: Story = {
  render: () => html`
    <main style="max-width: 760px; padding: 2rem;">

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
        <div>
          <candor-heading level="h1" style="margin-bottom: 0.25rem;">Q2 Design Review</candor-heading>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <candor-text variant="body" style="color: var(--color-text-subtle);">Last saved 2 minutes ago</candor-text>
            <candor-badge variant="warning">Draft</candor-badge>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; padding-top: var(--spacing-2xs);">
          <candor-button variant="ghost" size="small">Discard</candor-button>
          <candor-button variant="primary" size="small">
            <i class="ph ph-cloud-arrow-up" aria-hidden="true" style="margin-right: 0.35em;"></i>
            Save
          </candor-button>
        </div>
      </div>

      <div style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); overflow: hidden;">

        <div style="border-bottom: 1px solid var(--color-border-default); padding: 0.375rem 0.5rem; background: var(--color-bg-surface); overflow-x: auto;">
          <candor-toolbar aria-label="Text formatting">

            <select
              aria-label="Paragraph style"
              style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-default); background: transparent; border: none; cursor: pointer; padding: 0.25rem 0.375rem; border-radius: var(--radius-sm); line-height: 1.4;">
              <option>Normal</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Heading 3</option>
              <option>Code block</option>
              <option>Quote</option>
            </select>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Bold" aria-pressed="true" title="Bold"
                    style="${ICON_ONLY} background: var(--color-bg-elevated); color: var(--color-action-primary);">
              <i class="ph-bold ph-text-b" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Italic" aria-pressed="false" title="Italic" style="${ICON_ONLY}">
              <i class="ph-bold ph-text-italic" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Underline" aria-pressed="false" title="Underline" style="${ICON_ONLY}">
              <i class="ph-bold ph-text-underline" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Strikethrough" aria-pressed="false" title="Strikethrough" style="${ICON_ONLY}">
              <i class="ph-bold ph-text-strikethrough" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Align left" aria-pressed="true" title="Align left"
                    style="${ICON_ONLY} background: var(--color-bg-elevated); color: var(--color-action-primary);">
              <i class="ph-bold ph-text-align-left" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Align center" aria-pressed="false" title="Align center" style="${ICON_ONLY}">
              <i class="ph-bold ph-text-align-center" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Align right" aria-pressed="false" title="Align right" style="${ICON_ONLY}">
              <i class="ph-bold ph-text-align-right" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Bulleted list" title="Bulleted list" style="${ICON_ONLY}">
              <i class="ph-bold ph-list-bullets" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Numbered list" title="Numbered list" style="${ICON_ONLY}">
              <i class="ph-bold ph-list-numbers" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Insert link" title="Insert link" style="${ICON_ONLY}">
              <i class="ph-bold ph-link" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Insert image" title="Insert image" style="${ICON_ONLY}">
              <i class="ph-fill ph-image" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Undo" title="Undo" style="${ICON_ONLY}">
              <i class="ph-bold ph-arrow-counter-clockwise" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Redo" title="Redo" disabled style="${ICON_ONLY}">
              <i class="ph-bold ph-arrow-clockwise" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>

          </candor-toolbar>
        </div>

        <div style="padding: 1.75rem 2rem; min-height: 320px; background: var(--color-bg-page);"
             role="region" aria-label="Document content">

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-text-default); margin: 0 0 1rem; line-height: var(--line-height-tight);">
            Q2 Design Review: Summary
          </p>

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); margin: 0 0 1rem; line-height: var(--line-height-normal);">
            This review covers the outcomes of the Q2 design sprint: component library coverage, accessibility conformance, and outstanding work heading into Q3.
          </p>

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0 0 0.5rem; line-height: var(--line-height-tight);">
            Coverage
          </p>

          <ul style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); margin: 0 0 1rem; padding-left: 1.5rem; line-height: var(--line-height-normal);">
            <li>26 components shipped, all with Storybook stories and A11Y audit notes</li>
            <li>Token system migrated to OKLCH, with all contrast ratios re-validated</li>
            <li>Dark mode parity achieved across the full component set</li>
          </ul>

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-subtle); margin: 0; margin-inline-start: var(--spacing-xl); line-height: var(--line-height-normal); font-style: italic;">
            "The bar for 'done' is: any engineer on the team could pick up a component, read the story, and use it correctly without asking anyone."
          </p>

        </div>
      </div>

      <candor-toast
        variant="success"
        heading="Draft saved"
        message="Your changes have been saved."
        style="display: block; margin-top: 1.5rem;">
      </candor-toast>

    </main>
  `,
};

export const ImageEditor: Story = {
  render: () => html`
    <main style="min-height: 100vh; background: var(--color-bg-page); padding: 1.5rem 2rem;">

      <div style="max-width: 760px; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;">
        <div>
          <candor-heading level="h1" style="margin-bottom: 0.125rem;">hero-banner.png</candor-heading>
          <candor-text variant="body" style="color: var(--color-text-subtle);">1440 × 480 px · PNG</candor-text>
        </div>
        <div style="display: flex; gap: 0.75rem; padding-top: var(--spacing-2xs);">
          <candor-button variant="secondary" size="small">Export</candor-button>
          <candor-button variant="primary" size="small">Save</candor-button>
        </div>
      </div>

      <div style="display: flex; border: 1px solid var(--color-border-default); border-radius: var(--radius-md); overflow: hidden; max-width: 760px;">

        <div style="border-right: 1px solid var(--color-border-default); background: var(--color-bg-elevated); padding: 0.375rem; flex-shrink: 0;">
          <candor-toolbar aria-label="Drawing tools" orientation="vertical">

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Select" aria-pressed="true" title="Select"
                    style="${ICON_ONLY} background: var(--color-bg-page); color: var(--color-action-primary);">
              <i class="ph-fill ph-cursor" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Pan" aria-pressed="false" title="Pan" style="${ICON_ONLY}">
              <i class="ph-fill ph-hand" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>

            <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Crop" aria-pressed="false" title="Crop" style="${ICON_ONLY}">
              <i class="ph-bold ph-crop" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Draw" aria-pressed="false" title="Draw" style="${ICON_ONLY}">
              <i class="ph-fill ph-pencil" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Erase" aria-pressed="false" title="Erase" style="${ICON_ONLY}">
              <i class="ph-fill ph-eraser" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Text" aria-pressed="false" title="Add text" style="${ICON_ONLY}">
              <i class="ph-bold ph-text-t" aria-hidden="true" style="${BOLD_ICON}"></i>
            </button>

            <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Zoom in" title="Zoom in" style="${ICON_ONLY}">
              <i class="ph-fill ph-magnifying-glass-plus" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Zoom out" title="Zoom out" style="${ICON_ONLY}">
              <i class="ph-fill ph-magnifying-glass-minus" aria-hidden="true" style="${FILL_ICON}"></i>
            </button>

          </candor-toolbar>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">

          <div style="border-bottom: 1px solid var(--color-border-default); background: var(--color-bg-surface); padding: 0.375rem 0.625rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <candor-toolbar aria-label="View controls">
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Fit to window" title="Fit to window" style="${ICON_ONLY}">
                <i class="ph-bold ph-arrows-out" aria-hidden="true" style="${BOLD_ICON}"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Actual size" title="Actual size" style="${ICON_ONLY}">
                <i class="ph-bold ph-frame-corners" aria-hidden="true" style="${BOLD_ICON}"></i>
              </button>
              <candor-toolbar-separator></candor-toolbar-separator>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Undo" title="Undo" style="${ICON_ONLY}">
                <i class="ph-bold ph-arrow-counter-clockwise" aria-hidden="true" style="${BOLD_ICON}"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Redo" title="Redo" style="${ICON_ONLY}">
                <i class="ph-bold ph-arrow-clockwise" aria-hidden="true" style="${BOLD_ICON}"></i>
              </button>
            </candor-toolbar>
            <div style="display: flex; align-items: center; gap: 0.375rem;">
              <candor-accessible-text role_="annotation">Zoom</candor-accessible-text>
              <candor-badge variant="default">75%</candor-badge>
            </div>
          </div>

          <div style="flex: 1; min-height: 300px; background: var(--color-bg-surface); display: flex; align-items: center; justify-content: center; padding: 2rem;">
            <div
              role="img"
              aria-label="Canvas: hero-banner.png, 1440 × 480"
              style="
                width: 100%;
                height: 160px;
                background: var(--color-bg-page);
                border-radius: var(--radius-sm);
                box-shadow: 0 2px 16px oklch(0.4 0 0 / 0.18);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              <candor-text variant="body" style="color: var(--color-text-subtle);">hero-banner.png, 1440 × 480</candor-text>
            </div>
          </div>

        </div>
      </div>
    </main>
  `,
};
