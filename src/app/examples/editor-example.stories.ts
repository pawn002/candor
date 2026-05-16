import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { ToolbarSeparatorComponent } from '../components/toolbar/toolbar-separator.component';
import { ButtonComponent } from '../components/button/button.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { SelectComponent } from '../components/form/select/select.component';
import { HeadingComponent } from '../components/typography/heading/heading.component';
import { TextComponent } from '../components/typography/text/text.component';
import { ToastComponent } from '../components/toast/toast.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { TabPanelComponent } from '../components/tabs/tab-panel.component';

const meta: Meta = {
  title: 'Angular Components/Examples/Editor Example',
  decorators: [
    moduleMetadata({
      imports: [
        ToolbarComponent,
        ToolbarSeparatorComponent,
        ButtonComponent,
        BadgeComponent,
        SelectComponent,
        HeadingComponent,
        TextComponent,
        ToastComponent,
        TabsComponent,
        TabPanelComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Document editor layout using Toolbar, Tabs, Badge, Select, Heading, Text, Toast, and Button.

The Toolbar implements the [ARIA Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
with roving tabindex — Tab moves focus into/out of the toolbar, arrow keys navigate between
controls inside it. Toolbar buttons use native \`<button>\` elements, not \`app-button\`, because
roving tabindex requires direct focus management on the element itself.

Separators (ToolbarSeparator) divide the toolbar into logical groups (text style vs. alignment vs. insert).
The Badge on the document title communicates draft/published status at a glance without
requiring the user to open a settings panel.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Demonstrates: app-toolbar (formatting controls with roving tabindex), app-toolbar-separator
// (logical groups), app-button (save/discard), app-badge (draft status), app-heading, app-text.
// Toolbar buttons use the global btn utility class — the toolbar APG pattern requires native
// <button> elements for roving tabindex to function correctly.
export const DocumentEditor: Story = {
  render: () => ({
    template: `
      <div style="max-width: 760px; padding: 2rem;">

        <!-- Page header -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;">
          <div>
            <app-heading [level]="1" style="margin-bottom: 0.25rem;">Q2 Design Review</app-heading>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <app-text variant="body" style="color: var(--color-text-subtle);">Last saved 2 minutes ago</app-text>
              <app-badge variant="warning">Draft</app-badge>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; padding-top: 4px;">
            <app-button variant="ghost" size="small">Discard</app-button>
            <app-button variant="primary" size="small">
              <i class="ph ph-cloud-arrow-up" aria-hidden="true" style="margin-right: 0.35em;"></i>
              Save
            </app-button>
          </div>
        </div>

        <!-- Editor chrome: toolbar above content area, share the same border -->
        <div style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); overflow: hidden;">

          <!-- Formatting toolbar -->
          <div style="border-bottom: 1px solid var(--color-border-default); padding: 0.375rem 0.5rem; background: var(--color-bg-surface);">
            <app-toolbar ariaLabel="Text formatting">

              <!-- Paragraph style -->
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

              <app-toolbar-separator></app-toolbar-separator>

              <!-- Inline formatting -->
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

              <app-toolbar-separator></app-toolbar-separator>

              <!-- Alignment -->
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

              <app-toolbar-separator></app-toolbar-separator>

              <!-- Lists -->
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Bulleted list" title="Bulleted list">
                <i class="ph ph-list-bullets" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Numbered list" title="Numbered list">
                <i class="ph ph-list-numbers" aria-hidden="true"></i>
              </button>

              <app-toolbar-separator></app-toolbar-separator>

              <!-- Insert -->
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Insert link" title="Insert link">
                <i class="ph ph-link" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Insert image" title="Insert image">
                <i class="ph ph-image" aria-hidden="true"></i>
              </button>

              <app-toolbar-separator></app-toolbar-separator>

              <!-- History -->
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Undo" title="Undo">
                <i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Redo" title="Redo" disabled>
                <i class="ph ph-arrow-clockwise" aria-hidden="true"></i>
              </button>

            </app-toolbar>
          </div>

          <!-- Mock editable content area -->
          <div style="padding: 1.75rem 2rem; min-height: 320px; background: var(--color-bg-default);"
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

            <p style="font-family: var(--font-family-base); font-size: var(--font-size-md); color: var(--color-text-subtle); margin: 0; line-height: var(--line-height-normal); border-left: 3px solid var(--color-border-default); padding-left: 1rem; font-style: italic;">
              "The bar for 'done' is: any engineer on the team could pick up a component, read the story, and use it correctly without asking anyone."
            </p>

          </div>
        </div>

        <!-- Post-save toast -->
        <app-toast
          variant="success"
          title="Draft saved"
          message="Your changes have been saved."
          style="display: block; margin-top: 1.5rem;">
        </app-toast>

      </div>
    `,
  }),
};

// Demonstrates: vertical app-toolbar (drawing tools), app-toolbar-separator (horizontal rule
// between groups), app-badge (zoom level), app-button. The vertical toolbar pattern is common
// in canvas, map, and image editing interfaces.
export const ImageEditor: Story = {
  render: () => ({
    template: `
      <div style="padding: 2rem;">

        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; max-width: 640px;">
          <div>
            <app-heading [level]="1" style="margin-bottom: 0.25rem;">hero-banner.png</app-heading>
            <app-text variant="body" style="color: var(--color-text-subtle);">1440 × 480 px · PNG</app-text>
          </div>
          <div style="display: flex; gap: 0.75rem; padding-top: 4px;">
            <app-button variant="secondary" size="small">Export</app-button>
            <app-button variant="primary" size="small">Save</app-button>
          </div>
        </div>

        <div style="display: flex; gap: 0; border: 1px solid var(--color-border-default); border-radius: var(--radius-md); overflow: hidden; max-width: 640px;">

          <!-- Vertical tools toolbar -->
          <div style="border-right: 1px solid var(--color-border-default); background: var(--color-bg-surface); padding: 0.375rem;">
            <app-toolbar ariaLabel="Drawing tools" orientation="vertical">

              <button class="btn btn-ghost btn-sm" type="button" aria-label="Select" aria-pressed="true" title="Select"
                      style="background: var(--color-bg-elevated); color: var(--color-action-primary);">
                <i class="ph ph-cursor" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Pan" aria-pressed="false" title="Pan">
                <i class="ph ph-hand" aria-hidden="true"></i>
              </button>

              <app-toolbar-separator orientation="horizontal"></app-toolbar-separator>

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

              <app-toolbar-separator orientation="horizontal"></app-toolbar-separator>

              <button class="btn btn-ghost btn-sm" type="button" aria-label="Zoom in" title="Zoom in">
                <i class="ph ph-magnifying-glass-plus" aria-hidden="true"></i>
              </button>
              <button class="btn btn-ghost btn-sm" type="button" aria-label="Zoom out" title="Zoom out">
                <i class="ph ph-magnifying-glass-minus" aria-hidden="true"></i>
              </button>

            </app-toolbar>
          </div>

          <!-- Canvas area -->
          <div style="flex: 1; display: flex; flex-direction: column;">
            <!-- Canvas toolbar: zoom indicator + view controls -->
            <div style="border-bottom: 1px solid var(--color-border-default); background: var(--color-bg-surface); padding: 0.375rem 0.625rem; display: flex; align-items: center; justify-content: space-between;">
              <app-toolbar ariaLabel="View controls">
                <button class="btn btn-ghost btn-sm" type="button" aria-label="Fit to window" title="Fit to window">
                  <i class="ph ph-arrows-out" aria-hidden="true"></i>
                </button>
                <button class="btn btn-ghost btn-sm" type="button" aria-label="Reset zoom" title="Actual size">
                  <i class="ph ph-frame-corners" aria-hidden="true"></i>
                </button>
                <app-toolbar-separator></app-toolbar-separator>
                <button class="btn btn-ghost btn-sm" type="button" aria-label="Undo" title="Undo">
                  <i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i>
                </button>
                <button class="btn btn-ghost btn-sm" type="button" aria-label="Redo" title="Redo">
                  <i class="ph ph-arrow-clockwise" aria-hidden="true"></i>
                </button>
              </app-toolbar>
              <app-badge variant="default">75%</app-badge>
            </div>

            <!-- Mock canvas -->
            <div style="flex: 1; min-height: 280px; background: var(--color-bg-subtle); display: flex; align-items: center; justify-content: center; padding: 2rem;">
              <div style="width: 100%; height: 140px; background: linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-elevated) 100%); border-radius: var(--radius-md); border: 1px dashed var(--color-border-default); display: flex; align-items: center; justify-content: center;">
                <app-text variant="body" style="color: var(--color-text-subtle);">hero-banner.png — 1440 × 480</app-text>
              </div>
            </div>

          </div>
        </div>
      </div>
    `,
  }),
};
