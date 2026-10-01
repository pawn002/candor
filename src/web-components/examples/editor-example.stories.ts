import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../components/badge/candor-badge';
import '../components/button/candor-button';
import '../components/toast/candor-toast';
import '../components/toolbar/candor-toolbar';
import '../components/typography/accessible-text/candor-accessible-text';
import '../components/typography/heading/candor-heading';
import '../components/typography/text/candor-text';

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
with roving tabindex — Tab moves focus into/out of the toolbar, arrow keys navigate between
controls inside it. Toolbar buttons use native \`<button>\` elements, not
\`<candor-button>\`, because roving tabindex requires direct focus management on the
element itself.

> **The \`btn btn-ghost btn-sm\` classes on these buttons are Storybook-only** — they
> exist in the Storybook harness but are not shipped in \`@candor-design/tokens\`. Don't
> copy them into an app; style your own \`<button>\`s instead. See the Toolbar story for
> the full note.

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
                    style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
              <i class="ph-bold ph-text-b" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Italic" aria-pressed="false" title="Italic">
              <i class="ph ph-text-italic" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Underline" aria-pressed="false" title="Underline">
              <i class="ph ph-text-underline" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Strikethrough" aria-pressed="false" title="Strikethrough">
              <i class="ph ph-text-strikethrough" aria-hidden="true"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Align left" aria-pressed="true" title="Align left"
                    style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
              <i class="ph ph-text-align-left" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Align center" aria-pressed="false" title="Align center">
              <i class="ph ph-text-align-center" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Align right" aria-pressed="false" title="Align right">
              <i class="ph ph-text-align-right" aria-hidden="true"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Bulleted list" title="Bulleted list">
              <i class="ph ph-list-bullets" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Numbered list" title="Numbered list">
              <i class="ph ph-list-numbers" aria-hidden="true"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Insert link" title="Insert link">
              <i class="ph ph-link" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Insert image" title="Insert image">
              <i class="ph ph-image" aria-hidden="true"></i>
            </button>

            <candor-toolbar-separator></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Undo" title="Undo">
              <i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Redo" title="Redo" disabled>
              <i class="ph ph-arrow-clockwise" aria-hidden="true"></i>
            </button>

          </candor-toolbar>
        </div>

        <div style="padding: 1.75rem 2rem; min-height: 320px; background: var(--color-bg-page);"
             role="region" aria-label="Document content">

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-text-default); margin: 0 0 1rem; line-height: var(--line-height-tight);">
            Q2 Design Review — Summary
          </p>

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); margin: 0 0 1rem; line-height: var(--line-height-normal);">
            This review covers the outcomes of the Q2 design sprint: component library coverage, accessibility conformance, and outstanding work heading into Q3.
          </p>

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); color: var(--color-text-default); margin: 0 0 0.5rem; line-height: var(--line-height-tight);">
            Coverage
          </p>

          <ul style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-default); margin: 0 0 1rem; padding-left: 1.5rem; line-height: var(--line-height-normal);">
            <li>26 components shipped, all with Storybook stories and A11Y audit notes</li>
            <li>Token system migrated to OKLCH — all contrast ratios re-validated</li>
            <li>Dark mode parity achieved across the full component set</li>
          </ul>

          <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-subtle); margin: 0; line-height: var(--line-height-normal); border-left: var(--border-width-thick) solid var(--color-border-default); padding-left: 1rem; font-style: italic;">
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
                    style="background: var(--color-bg-page); color: var(--color-action-primary);">
              <i class="ph ph-cursor" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Pan" aria-pressed="false" title="Pan">
              <i class="ph ph-hand" aria-hidden="true"></i>
            </button>

            <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Crop" aria-pressed="false" title="Crop">
              <i class="ph ph-crop" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Draw" aria-pressed="false" title="Draw">
              <i class="ph ph-pencil" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Erase" aria-pressed="false" title="Erase">
              <i class="ph ph-eraser" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Text" aria-pressed="false" title="Add text">
              <i class="ph ph-text-t" aria-hidden="true"></i>
            </button>

            <candor-toolbar-separator orientation="horizontal"></candor-toolbar-separator>

            <button class="btn btn-ghost btn-sm" type="button" aria-label="Zoom in" title="Zoom in">
              <i class="ph ph-magnifying-glass-plus" aria-hidden="true"></i>
            </button>
            <button class="btn btn-ghost btn-sm" type="button" aria-label="Zoom out" title="Zoom out">
              <i class="ph ph-magnifying-glass-minus" aria-hidden="true"></i>
            </button>

          </candor-toolbar>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">

          <div style="border-bottom: 1px solid var(--color-border-default); background: var(--color-bg-surface); padding: 0.375rem 0.625rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <candor-toolbar aria-label="View controls">
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Fit to window" title="Fit to window">
                <i class="ph ph-arrows-out" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Actual size" title="Actual size">
                <i class="ph ph-frame-corners" aria-hidden="true"></i>
              </button>
              <candor-toolbar-separator></candor-toolbar-separator>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Undo" title="Undo">
                <i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Redo" title="Redo">
                <i class="ph ph-arrow-clockwise" aria-hidden="true"></i>
              </button>
            </candor-toolbar>
            <div style="display: flex; align-items: center; gap: 0.375rem;">
              <candor-accessible-text role_="annotation">Zoom</candor-accessible-text>
              <candor-badge variant="default" aria-label="Zoom: 75%">75%</candor-badge>
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
              <candor-text variant="body" style="color: var(--color-text-subtle);">hero-banner.png — 1440 × 480</candor-text>
            </div>
          </div>

        </div>
      </div>
    </main>
  `,
};
