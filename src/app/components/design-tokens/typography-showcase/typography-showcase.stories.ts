import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TypographyShowcaseComponent } from './typography-showcase.component';
import { TableComponent } from '../../table/table.component';
import { AlertComponent } from '../../alert/alert.component';

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

// ── Contrast guidance ─────────────────────────────────────────────────────────
// Two axes: font size (OKCA ramp) × use-case tier.
// Source: issue #62 / @pawn002/okca issue #11 for the size ramp.
// Tier system derived from APCA use-case sensitivity, adapted for Candor's
// component set. See docs/CONTRAST-TIERS.md for the full rationale.

export const OKCAContrastGuidance: Story = {
  name: 'Contrast Guidance',
  decorators: [
    moduleMetadata({ imports: [TableComponent, AlertComponent] }),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `
Candor's contrast requirements have **two axes**: font size and use-case tier.

**Size axis** — OKCA raises the required score as text shrinks. Contrast demand more than doubles
between 16px and 14px for regular-weight text. The ramp is anchored at the WCAG 4.5 floor at 16px
and at the maximum achievable OKCA score (20 — black on white) at 12px.

**Use-case tier axis** — the size penalty at 14px applies in full only to text that is read
sequentially. The visual system processes short labels and pattern-matched status text differently
from fluent prose. Three tiers adjust the 14px threshold accordingly.

> Sub-16px ramp values (12–15px) are editorially derived from geometric interpolation between
> known anchors, not from a named standard. OKCA is polarity-aware and chroma-compressed —
> passing OKCA also passes WCAG (zero false-pass guarantee).
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 720px; display: flex; flex-direction: column; gap: var(--spacing-xl); padding-bottom: var(--spacing-xl);">

        <!-- ── Section 1: OKCA size ramp ─────────────────────────────────────── -->
        <section>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-sm);">Size ramp — Tier 1 (reading text) baseline</p>
          <app-table [compact]="true">
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Token</th>
                  <th class="numeric">Regular</th>
                  <th class="numeric">Bold</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>≥ 24px</td>
                  <td class="label" style="font-family: var(--font-family-mono);">3xl – xl</td>
                  <td class="numeric">3.0</td>
                  <td class="numeric">3.0</td>
                  <td class="label">WCAG large text — both weights qualify</td>
                </tr>
                <tr>
                  <td>19 – 23px</td>
                  <td class="label" style="font-family: var(--font-family-mono);">—</td>
                  <td class="numeric">4.5</td>
                  <td class="numeric">3.0</td>
                  <td class="label">Bold qualifies as large from 18.67px; regular does not until 24px</td>
                </tr>
                <tr>
                  <td>16 – 18px</td>
                  <td class="label" style="font-family: var(--font-family-mono);">--font-size-md</td>
                  <td class="numeric">4.5</td>
                  <td class="numeric">4.5</td>
                  <td class="label">WCAG 4.5 floor — binds both weights</td>
                </tr>
                <tr>
                  <td>15px</td>
                  <td class="label" style="font-family: var(--font-family-mono);">—</td>
                  <td class="numeric">6.5</td>
                  <td class="numeric">4.5</td>
                  <td class="label">Sub-16px ramp (editorially derived)</td>
                </tr>
                <tr>
                  <td><strong>14px</strong></td>
                  <td style="font-family: var(--font-family-mono);"><strong>--font-size-sm</strong></td>
                  <td class="numeric"><strong>9.5</strong></td>
                  <td class="numeric"><strong>6.5</strong></td>
                  <td>Candor readable text floor — demand more than doubles vs. 16px</td>
                </tr>
                <tr style="opacity: 0.5;">
                  <td class="label">13px</td>
                  <td class="label" style="font-family: var(--font-family-mono);">—</td>
                  <td class="numeric label">13.8</td>
                  <td class="numeric label">9.5</td>
                  <td class="label">Not in Candor scale — ramp context only</td>
                </tr>
                <tr style="opacity: 0.5;">
                  <td class="label">12px</td>
                  <td class="label" style="font-family: var(--font-family-mono);">--font-size-xs</td>
                  <td class="numeric label">20</td>
                  <td class="numeric label">13.8</td>
                  <td class="label">Decorative / non-text only — 20 = black on white</td>
                </tr>
                <tr style="opacity: 0.3;">
                  <td class="label">&lt; 12px</td>
                  <td class="label">—</td>
                  <td class="numeric label">—</td>
                  <td class="numeric label">—</td>
                  <td class="label">Not supported — contrast cannot compensate for letterform resolution failure</td>
                </tr>
              </tbody>
            </table>
          </app-table>
        </section>

        <!-- ── Section 2: Use-case tiers ─────────────────────────────────────── -->
        <section>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text-subtle); text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 var(--spacing-xs);">Use-case tiers — 14px adjustments</p>
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 var(--spacing-sm);">The size ramp above assumes fluent reading. At 14px the tier system relaxes the threshold for text whose perceptual task is recognition rather than sequential decoding.</p>
          <app-table>
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Perceptual task</th>
                  <th class="numeric">14px regular</th>
                  <th class="numeric">14px bold</th>
                  <th>Candor components</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1 — Reading</strong></td>
                  <td class="label">Sequential decoding — must read to act</td>
                  <td class="numeric"><strong>9.5</strong></td>
                  <td class="numeric"><strong>6.5</strong></td>
                  <td class="label">Toast message, alert body, modal prose, form error messages, article inline text</td>
                </tr>
                <tr>
                  <td><strong>2 — Functional UI</strong></td>
                  <td class="label">Recognition — sole channel for meaning</td>
                  <td class="numeric"><strong>6.5</strong></td>
                  <td class="numeric"><strong>4.5</strong></td>
                  <td class="label">Breadcrumb links (bold), pagination numbers, table cell data, accordion quiet headings (bold), chip labels</td>
                </tr>
                <tr>
                  <td><strong>3 — Supplementary</strong></td>
                  <td class="label">Pattern match — meaning redundantly coded</td>
                  <td class="numeric"><strong>4.5</strong></td>
                  <td class="numeric"><strong>4.5</strong></td>
                  <td class="label">Badge text, hint text, breadcrumb separators, pagination ellipsis, stat labels, table metadata</td>
                </tr>
              </tbody>
            </table>
          </app-table>
        </section>

        <!-- Callouts -->
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
          <app-alert variant="warning" heading="Tier 2 authoring constraint" style="display: block;">
            <code style="font-family: var(--font-family-mono);">--color-text-subtle</code> (OKCA 4.6) fails the 6.5 regular threshold. Functional 14px text using this token must be bold — bold OKCA 4.6 passes the 4.5 bold floor.
          </app-alert>
          <app-alert variant="info" heading="Tier 3 condition" style="display: block;">
            Redundancy must be verified per component. Color-alone does not qualify — the redundant channel must be shape, icon, or spatial context so it holds under colorblindness. This tier is assigned by the system; it is not a consumer opt-in.
          </app-alert>
        </div>

      </div>
    `,
  }),
};
