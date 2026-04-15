import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { CardComponent } from '../components/card/card.component';
import { ButtonComponent } from '../components/button/button.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { AccessibleTextComponent } from '../components/typography/accessible-text/accessible-text.component';
import { RadioComponent } from '../components/form/radio/radio.component';
import { CheckboxComponent } from '../components/form/checkbox/checkbox.component';
import { SliderComponent } from '../components/form/slider/slider.component';
import { AccordionItemComponent } from '../components/accordion/accordion-item.component';
import { StatComponent } from '../components/stat/stat.component';
import { TableComponent } from '../components/table/table.component';
import { TonePickerComponent } from '../components/tone-picker/tone-picker.component';
import { buildGamutRows } from '../components/tone-picker/gamut-data';

const meta: Meta = {
  title: 'Examples/Color Iterator Example',
  decorators: [
    moduleMetadata({
      imports: [
        NavigationComponent,
        CardComponent,
        ButtonComponent,
        BadgeComponent,
        AccessibleTextComponent,
        RadioComponent,
        CheckboxComponent,
        SliderComponent,
        AccordionItemComponent,
        StatComponent,
        TableComponent,
        TonePickerComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Interactive color accessibility tool: pick a foreground/background pair and iterate
over OKLCH gamut space to find contrast-compliant alternatives.

Assembles TonePicker, Slider (OKLCH lightness axis with gradient track), Radio, Checkbox,
Accordion, Stat (WCAG/OKCA scores), Table (gamut grid), Navigation, Card, Badge,
and AccessibleText.

The TonePicker renders an OKLCH gamut as a color grid; the Slider sweeps lightness
while holding chroma and hue constant. Stat components surface WCAG 2.1 and APCA
contrast ratios in real time as the user drags the slider.

This example is also a stress-test for the design system itself — every component
is under real conditions with live data rather than static props.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Working pair: fg #647a61 = oklch(0.55 0.065 142), bg #ffe1f9 = oklch(0.94 0.054 333)
// WCAG 2.1 ratio: 3.9:1 — fails AA normal text, passes large text & non-text

// H=142 olive-green gamut — anchor: L=0.55 C=0.065 (#647a61, the FG in this story)
const FG_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.95, 0.84, 0.73, 0.62, 0.55, 0.44, 0.33, 0.22, 0.11];
    const C = [0.020, 0.065, 0.110, 0.155, 0.200];
    const IG = [
      [1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 142, ig: !!IG[ri][ci] })));
  })(),
  0.55, 0.065,
);
const FG_GAMUT_HEADERS = ['C 0.020', 'C 0.065', 'C 0.110', 'C 0.155', 'C 0.200'];

// H=333 pink-mauve gamut — anchor: L=0.94 C=0.054 (#ffe1f9, the BG in this story)
const BG_GAMUT_ROWS = buildGamutRows(
  (() => {
    const L = [0.94, 0.83, 0.72, 0.61, 0.50, 0.39, 0.28, 0.17, 0.06];
    const C = [0.020, 0.054, 0.090, 0.130, 0.170];
    const IG = [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ];
    return L.map((l, ri) => C.map((c, ci) => ({ l, c, h: 333, ig: !!IG[ri][ci] })));
  })(),
  0.94, 0.054,
);
const BG_GAMUT_HEADERS = ['C 0.020', 'C 0.054', 'C 0.090', 'C 0.130', 'C 0.170'];

export const ColorPairIterator: Story = {
  render: () => ({
    props: {
      navItems: [
        { label: 'Tools', href: '#', active: true },
        { label: 'Blog', href: '#' },
        { label: 'About', href: '#' },
      ],
      fgGamutRows: FG_GAMUT_ROWS,
      fgGamutHeaders: FG_GAMUT_HEADERS,
      bgGamutRows: BG_GAMUT_ROWS,
      bgGamutHeaders: BG_GAMUT_HEADERS,
    },
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page);">

        <!-- Navigation -->
        <app-navigation
          brand="Candor"
          [items]="navItems"
          orientation="horizontal">
        </app-navigation>

        <!-- Page content -->
        <div style="max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem 4rem;">

          <!-- Header -->
          <header style="margin-bottom: 2rem;">
            <h1 style="
              font-family: var(--font-family-display);
              font-size: var(--font-size-h2);
              font-weight: var(--font-weight-bold);
              font-optical-sizing: auto;
              color: var(--color-text-default);
              line-height: var(--line-height-tight);
              margin: 0 0 0.5rem;
            ">Color Pair Iterator</h1>
            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-md);
              color: var(--color-text-subtle);
              margin: 0;
              line-height: var(--line-height-normal);
            ">Adjust lightness along an OKLCH axis while contrast ratios update in real time.</p>
          </header>

          <!-- Two-column layout -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; align-items: start;">

            <!-- ── Left column: controls ── -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">

              <!-- Foreground card -->
              <app-card variant="default" style="display: block;">
                <div style="display: flex; flex-direction: column; gap: 0.875rem;">

                  <app-accessible-text role="label" [bold]="true">Foreground</app-accessible-text>

                  <!-- Swatch + hex input -->
                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    background: var(--color-bg-page);
                    border: 1px solid var(--color-border-default);
                    border-radius: var(--radius-sm);
                    padding: 0.375rem 0.625rem;
                  ">
                    <div
                      aria-hidden="true"
                      style="
                        width: 1.5rem;
                        height: 1.5rem;
                        border-radius: var(--radius-sm);
                        background: #647a61;
                        flex-shrink: 0;
                        border: 1px solid var(--color-border-default);
                      ">
                    </div>
                    <!-- gap: no ColorInput component — raw input styled with tokens -->
                    <input
                      type="text"
                      value="#647a61"
                      aria-label="Foreground hex color"
                      style="background: transparent; border: none; outline: none; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); width: 6rem; letter-spacing: 0.02em;"
                    />
                  </div>

                  <!-- Gradient L-axis slider -->
                  <app-slider
                    label="Lightness — hold C and H"
                    [min]="0" [max]="1" [step]="0.001" [value]="0.555"
                    gradient="linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))">
                  </app-slider>

                  <!-- OKLCH readout -->
                  <div style="
                    display: flex;
                    gap: 1rem;
                    font-family: var(--font-family-mono);
                    font-size: var(--font-size-sm);
                    color: var(--color-text-subtle);
                    letter-spacing: 0.02em;
                  ">
                    <span><span style="color: var(--color-text-default);">L</span> 0.55</span>
                    <span><span style="color: var(--color-text-default);">C</span> 0.065</span>
                    <span><span style="color: var(--color-text-default);">H</span> 142°</span>
                  </div>

                  <!-- LCH Limits tone picker — mirrors CPQI "Foreground LCH Limits" -->
                  <div style="background: var(--color-bg-page); border-radius: var(--radius-md); padding: 0 0.75rem;">
                    <app-accordion-item heading="LCH Limits">
                      <app-tone-picker
                        [rows]="fgGamutRows"
                        [columnHeaders]="fgGamutHeaders"
                        ariaLabel="Foreground tones — olive H 142"
                        [size]="'small'"
                        [selectedValue]="'oklch(0.55 0.065 142)'">
                      </app-tone-picker>
                    </app-accordion-item>
                  </div>

                </div>
              </app-card>

              <!-- Background card -->
              <app-card variant="default" style="display: block;">
                <div style="display: flex; flex-direction: column; gap: 0.875rem;">

                  <app-accessible-text role="label" [bold]="true">Background</app-accessible-text>

                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    background: var(--color-bg-page);
                    border: 1px solid var(--color-border-default);
                    border-radius: var(--radius-sm);
                    padding: 0.375rem 0.625rem;
                  ">
                    <div
                      aria-hidden="true"
                      style="
                        width: 1.5rem;
                        height: 1.5rem;
                        border-radius: var(--radius-sm);
                        background: #ffe1f9;
                        flex-shrink: 0;
                        border: 1px solid var(--color-border-default);
                      ">
                    </div>
                    <input
                      type="text"
                      value="#ffe1f9"
                      aria-label="Background hex color"
                      style="background: transparent; border: none; outline: none; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); width: 6rem; letter-spacing: 0.02em;"
                    />
                  </div>

                  <!-- Gradient L-axis slider -->
                  <app-slider
                    label="Lightness — hold C and H"
                    [min]="0" [max]="1" [step]="0.001" [value]="0.94"
                    gradient="linear-gradient(to right, oklch(0.05 0.054 333), oklch(0.94 0.054 333), oklch(0.97 0.054 333))">
                  </app-slider>

                  <div style="
                    display: flex;
                    gap: 1rem;
                    font-family: var(--font-family-mono);
                    font-size: var(--font-size-sm);
                    color: var(--color-text-subtle);
                    letter-spacing: 0.02em;
                  ">
                    <span><span style="color: var(--color-text-default);">L</span> 0.94</span>
                    <span><span style="color: var(--color-text-default);">C</span> 0.054</span>
                    <span><span style="color: var(--color-text-default);">H</span> 333°</span>
                  </div>

                  <!-- LCH Limits tone picker — mirrors CPQI "Background LCH Limits" -->
                  <div style="background: var(--color-bg-page); border-radius: var(--radius-md); padding: 0 0.75rem;">
                    <app-accordion-item heading="LCH Limits">
                      <app-tone-picker
                        [rows]="bgGamutRows"
                        [columnHeaders]="bgGamutHeaders"
                        ariaLabel="Background tones — pink H 333"
                        [size]="'small'"
                        [selectedValue]="'oklch(0.94 0.054 333)'">
                      </app-tone-picker>
                    </app-accordion-item>
                  </div>

                </div>
              </app-card>

              <!-- Action buttons -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <app-button variant="tertiary" size="small">⇄ Swap</app-button>
                <app-button variant="tertiary" size="small">≈ Harmonize</app-button>
                <app-button variant="ghost" size="small">↺ Reset</app-button>
                <app-button variant="ghost" size="small">✦ Random</app-button>
              </div>

              <!-- Algorithm selector & display options -->
              <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: 0 1rem;">
                <app-accordion-item heading="Contrast algorithm" [open]="true">
                  <fieldset style="border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                    <legend style="display: none;">Contrast algorithm</legend>
                    <app-radio name="algorithm" [label]="'WCAG 2.1'" value="wcag21" [checked]="true"></app-radio>
                    <app-radio name="algorithm" [label]="'OKCA'" value="okca"></app-radio>
                    <app-radio name="algorithm" [label]="'Perceptual'" value="perceptual"></app-radio>
                    <app-radio name="algorithm" [label]="'Delta E'" value="deltae"></app-radio>
                  </fieldset>
                </app-accordion-item>
                <app-accordion-item heading="Display options">
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <app-checkbox [label]="'Hold chroma constant'" [checked]="true"></app-checkbox>
                    <app-checkbox [label]="'Show gradient track'" [checked]="true"></app-checkbox>
                  </div>
                </app-accordion-item>
              </div>

            </div>

            <!-- ── Right column: score + preview + metadata ── -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">

              <!-- Score card -->
              <app-card variant="elevated" style="display: block;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">

                  <app-stat value="3.9" unit=":1" label="WCAG 2.1 contrast ratio" color="warning">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                      <app-badge variant="error" size="sm">AA text ✗</app-badge>
                      <app-badge variant="success" size="sm">Large text ✓</app-badge>
                      <app-badge variant="success" size="sm">Non-text ✓</app-badge>
                    </div>
                    <app-accessible-text role="annotation" color="secondary" style="text-align: center; display: block;">
                      Needs 4.5:1 for AA · 7:1 for AAA
                    </app-accessible-text>
                  </app-stat>

                </div>
              </app-card>

              <!-- Preview card -->
              <app-card variant="default" style="display: block;">
                <app-accessible-text role="label" [bold]="true" style="display: block; margin-bottom: 0.75rem;">Preview</app-accessible-text>
                <div style="
                  background: #ffe1f9;
                  border-radius: var(--radius-sm);
                  padding: 1.25rem;
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                ">
                  <p style="
                    color: #647a61;
                    font-family: var(--font-family-display);
                    font-size: 1.375rem;
                    font-weight: 700;
                    margin: 0;
                    line-height: var(--line-height-tight);
                  ">Heading text</p>
                  <p style="
                    color: #647a61;
                    font-family: var(--font-family-serif);
                    font-size: 1rem;
                    margin: 0;
                    line-height: var(--line-height-relaxed);
                  ">Body copy — the quick brown fox jumps over the lazy dog. Color, readability, and rhythm.</p>
                  <p style="
                    color: #647a61;
                    font-family: var(--font-family-accessible);
                    font-size: 0.875rem;
                    margin: 0;
                    letter-spacing: 0.02em;
                  ">Label · Caption · Status text</p>
                </div>
              </app-card>

              <!-- Metadata card -->
              <app-card variant="default" style="display: block;">
                <app-accessible-text role="label" [bold]="true" style="display: block; margin-bottom: 0.75rem;">Measurements</app-accessible-text>
                <app-table [compact]="true">
                  <table>
                    <tbody>
                      <tr><td class="label">WCAG 2.1</td><td class="numeric">3.9</td></tr>
                      <tr><td class="label">OKCA</td><td class="numeric">4.0</td></tr>
                      <tr><td class="label">Perceptual</td><td class="numeric">60</td></tr>
                      <tr><td class="label">Delta E</td><td class="numeric">48</td></tr>
                      <tr><td class="label">FG · L C H</td><td class="numeric">0.55 · 0.065 · 142°</td></tr>
                      <tr><td class="label">BG · L C H</td><td class="numeric">0.94 · 0.054 · 333°</td></tr>
                    </tbody>
                  </table>
                </app-table>
              </app-card>

            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
