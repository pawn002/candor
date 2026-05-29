import React from 'react';
import { Description, Stories, Title } from '@storybook/addon-docs/blocks';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ColorShowcaseComponent, COLOR_CATEGORIES } from './color-showcase.component';
import { TableComponent } from '../../table/table.component';

const meta: Meta<ColorShowcaseComponent> = {
  title: 'Angular Components/Design Tokens/Colors',
  component: ColorShowcaseComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: {
      page: () => React.createElement(React.Fragment, null,
        React.createElement(Title, null),
        React.createElement(Description, null),
        React.createElement(Stories, { includePrimary: true })
      ),
      description: {
        component: `
Colors use **OKLCH** (Lightness, Chroma, Hue) for perceptual uniformity and predictable manipulation.

## Two-tier architecture
- **Primitives** — raw named values (color ramps, type scale, spacing, borders) in \`primitives.scss\`
- **Semantics** — role-based tokens (--color-action-primary, --color-text-default, …) in \`semantics.scss\`

Components reference semantic tokens only. CSS custom properties pierce shadow DOM, so a single \`candor-tokens.css\` load at the document level reaches into every web component's (WC) internals.

## Brand palette
- **Navy** \`#082840\` — primary action (15.2:1 with white)
- **Burgundy** \`#5F2B48\` — secondary action (10.4:1 with white)
- **Azure** \`#1493FB\` — accent / link (decorative on white; accessible step at azure-500)
- **Indigo** \`#6969F7\` — visited link color; accessible step at indigo-600, 4.6:1

## Accessibility
All action and text tokens meet WCAG 2.1 AA (4.5:1 for text, 3:1 for UI components).
Validated with \`klar contrast\`.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<ColorShowcaseComponent>;

export const LightTheme: Story = {
  name: 'Light Theme',
  globals: { theme: 'light' },
  render: () => ({ props: {} }),
  parameters: {
    docs: {
      description: {
        story: 'Complete semantic palette in light mode. Token values shown are light-mode resolved values.',
      },
    },
  },
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  globals: { theme: 'dark' },
  render: () => ({ props: {} }),
  parameters: {
    docs: {
      description: {
        story: 'Complete semantic palette in dark mode. Swatch colors reflect the active dark-mode token values.',
      },
    },
  },
};

export const TokenReference: Story = {
  name: 'Token Reference',
  decorators: [
    moduleMetadata({ imports: [TableComponent] }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Full token reference — OKLCH values for both light and dark mode. Source of truth is `src/design-tokens/semantics.scss`.',
      },
    },
  },
  render: () => ({
    props: { colorCategories: COLOR_CATEGORIES },
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-xl);">
        @for (category of colorCategories; track category.name) {
          <section>
            <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-2xs);">{{ category.name }}</p>
            <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 var(--spacing-sm);">{{ category.description }}</p>
            <app-table [compact]="true">
              <table>
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Light</th>
                    <th>Dark</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  @for (color of category.colors; track color.name) {
                    <tr>
                      <td style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">{{ color.variable }}</td>
                      <td style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">
                        @if (color.light) {
                          <span style="display:inline-flex;align-items:center;gap:0.375em;">
                            <span style="display:inline-block;width:0.875rem;height:0.875rem;border-radius:2px;border:1px solid oklch(0 0 0 / 0.12);flex-shrink:0;" [style.background]="color.light"></span>
                            {{ color.light }}
                          </span>
                        } @else { — }
                      </td>
                      <td style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);">
                        @if (color.dark) {
                          <span style="display:inline-flex;align-items:center;gap:0.375em;">
                            <span style="display:inline-block;width:0.875rem;height:0.875rem;border-radius:2px;border:1px solid oklch(0 0 0 / 0.12);flex-shrink:0;" [style.background]="color.dark"></span>
                            {{ color.dark }}
                          </span>
                        } @else { — }
                      </td>
                      <td class="label">{{ color.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </app-table>
          </section>
        }
      </div>
    `,
  }),
};
