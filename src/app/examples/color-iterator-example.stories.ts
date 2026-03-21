import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { CardComponent } from '../components/card/card.component';
import { ButtonComponent } from '../components/button/button.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { AccessibleTextComponent } from '../components/typography/accessible-text/accessible-text.component';
import { RadioComponent } from '../components/form/radio/radio.component';
import { CheckboxComponent } from '../components/form/checkbox/checkbox.component';

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
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Working pair: fg #647a61 = oklch(0.55 0.065 142), bg #ffe1f9 = oklch(0.94 0.054 333)
// WCAG 2.1 ratio: 3.9:1 — fails AA normal text, passes large text & non-text

export const ColorPairIterator: Story = {
  render: () => ({
    props: {
      navItems: [
        { label: 'Tools', href: '#', active: true },
        { label: 'Blog', href: '#' },
        { label: 'About', href: '#' },
      ],
    },
    template: `
      <!-- Slider thumb styling — gap: no Slider component in system -->
      <style>
        .cpqi-slider {
          -webkit-appearance: none;
          appearance: none;
          display: block;
          width: 100%;
          height: 100%;
          background: transparent;
          cursor: pointer;
          padding: 0;
          margin: 0;
        }
        .cpqi-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: white;
          border: 2px solid rgba(0,0,0,0.35);
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
          margin-top: -0.375rem;
        }
        .cpqi-slider::-webkit-slider-runnable-track {
          height: 0.5rem;
          border-radius: 99px;
          background: transparent;
        }
        .cpqi-slider:focus-visible {
          outline: none;
        }
        .cpqi-slider:focus-visible::-webkit-slider-thumb {
          outline: var(--focus-ring-width) solid var(--color-focus);
          outline-offset: var(--focus-ring-offset);
        }
        .cpqi-hex-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-family-mono);
          font-size: var(--font-size-sm);
          color: var(--color-text-default);
          width: 6rem;
          letter-spacing: 0.02em;
        }
      </style>

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
                      class="cpqi-hex-input"
                    />
                  </div>

                  <!-- Gradient L-axis slider -->
                  <!-- gap: no Slider component — raw range input -->
                  <div>
                    <app-accessible-text role="annotation" color="secondary" style="display: block; margin-bottom: 0.375rem;">
                      Lightness — hold C and H
                    </app-accessible-text>
                    <div style="
                      height: 2rem;
                      border-radius: var(--radius-sm);
                      background: linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142));
                      display: flex;
                      align-items: center;
                      padding: 0 0.25rem;
                      border: 1px solid var(--color-border-default);
                    ">
                      <input
                        type="range"
                        class="cpqi-slider"
                        min="0" max="1" step="0.001" value="0.555"
                        aria-label="Foreground lightness"
                      />
                    </div>
                  </div>

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
                      class="cpqi-hex-input"
                    />
                  </div>

                  <div>
                    <app-accessible-text role="annotation" color="secondary" style="display: block; margin-bottom: 0.375rem;">
                      Lightness — hold C and H
                    </app-accessible-text>
                    <div style="
                      height: 2rem;
                      border-radius: var(--radius-sm);
                      background: linear-gradient(to right, oklch(0.05 0.054 333), oklch(0.94 0.054 333), oklch(0.97 0.054 333));
                      display: flex;
                      align-items: center;
                      padding: 0 0.25rem;
                      border: 1px solid var(--color-border-default);
                    ">
                      <input
                        type="range"
                        class="cpqi-slider"
                        min="0" max="1" step="0.001" value="0.94"
                        aria-label="Background lightness"
                      />
                    </div>
                  </div>

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

                </div>
              </app-card>

              <!-- Action buttons -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <app-button variant="tertiary" size="small">⇄ Swap</app-button>
                <app-button variant="tertiary" size="small">≈ Harmonize</app-button>
                <app-button variant="ghost" size="small">↺ Reset</app-button>
                <app-button variant="ghost" size="small">✦ Random</app-button>
              </div>

              <!-- Algorithm selector -->
              <!-- gap: no Accordion component — inline expanded -->
              <app-card variant="default" style="display: block;">
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">

                  <app-accessible-text role="label" [bold]="true">Contrast algorithm</app-accessible-text>

                  <fieldset style="border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                    <legend style="display: none;">Contrast algorithm</legend>
                    <app-radio name="algorithm" [label]="'WCAG 2.1'" value="wcag21" [checked]="true"></app-radio>
                    <app-radio name="algorithm" [label]="'OKCA'" value="okca"></app-radio>
                    <app-radio name="algorithm" [label]="'Perceptual'" value="perceptual"></app-radio>
                    <app-radio name="algorithm" [label]="'Delta E'" value="deltae"></app-radio>
                  </fieldset>

                  <div style="border-top: 1px solid var(--color-border-default); padding-top: 0.625rem; display: flex; flex-direction: column; gap: 0.5rem;">
                    <app-checkbox [label]="'Hold chroma constant'" [checked]="true"></app-checkbox>
                    <app-checkbox [label]="'Show gradient track'" [checked]="true"></app-checkbox>
                  </div>

                </div>
              </app-card>

            </div>

            <!-- ── Right column: score + preview + metadata ── -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">

              <!-- Score card -->
              <app-card variant="elevated" style="display: block;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">

                  <app-accessible-text role="annotation" color="secondary">WCAG 2.1 contrast ratio</app-accessible-text>

                  <!-- gap: no Stat/Metric component — large number via raw tokens -->
                  <div style="
                    font-family: var(--font-family-display);
                    font-size: var(--font-size-3xl);
                    font-weight: var(--font-weight-bold);
                    font-optical-sizing: auto;
                    line-height: 1;
                    color: var(--color-status-warning);
                    letter-spacing: -0.02em;
                  " aria-label="Contrast ratio 3.9 to 1">3.9<span style="font-size: var(--font-size-lg); font-weight: var(--font-weight-regular); color: var(--color-text-subtle); letter-spacing: 0;">:1</span></div>

                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                    <app-badge variant="error" size="sm">AA text ✗</app-badge>
                    <app-badge variant="success" size="sm">Large text ✓</app-badge>
                    <app-badge variant="success" size="sm">Non-text ✓</app-badge>
                  </div>

                  <app-accessible-text role="annotation" color="secondary" style="text-align: center; display: block;">
                    Needs 4.5:1 for AA · 7:1 for AAA
                  </app-accessible-text>

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
              <!-- gap: no Table component — raw dl styled with tokens -->
              <app-card variant="default" style="display: block;">
                <app-accessible-text role="label" [bold]="true" style="display: block; margin-bottom: 0.75rem;">Measurements</app-accessible-text>
                <dl style="margin: 0; display: grid; grid-template-columns: 1fr auto; gap: 0.25rem 1rem;">

                  <dt style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; align-self: center;">WCAG 2.1</dt>
                  <dd style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0; text-align: right;">3.9</dd>

                  <dt style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; align-self: center;">OKCA</dt>
                  <dd style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0; text-align: right;">4.0</dd>

                  <dt style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; align-self: center;">Perceptual</dt>
                  <dd style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0; text-align: right;">60</dd>

                  <dt style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em; align-self: center;">Delta E</dt>
                  <dd style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0; text-align: right;">48</dd>

                  <div style="grid-column: 1 / -1; height: 1px; background: var(--color-border-default); margin: 0.375rem 0;"></div>

                  <dt style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">FG · L C H</dt>
                  <dd style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0; text-align: right;">0.55 · 0.065 · 142°</dd>

                  <dt style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">BG · L C H</dt>
                  <dd style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); margin: 0; text-align: right;">0.94 · 0.054 · 333°</dd>

                </dl>
              </app-card>

            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
