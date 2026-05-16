import type { Meta, StoryObj } from '@storybook/angular';

const NAV_ITEMS = JSON.stringify([
  { label: 'Tools', href: '#', active: true },
  { label: 'Blog', href: '#' },
  { label: 'About', href: '#' },
]);

// Build a row-oriented LCH gamut for the data-grid color picker.
// Shape: rowHeader = lightness; each cell = a chroma stop at that lightness/hue.
const buildGamut = (
  Lvals: number[], Cvals: number[], H: number, inGamut: number[][],
) =>
  Lvals.map((l, ri) => ({
    rowHeader: `L ${l.toFixed(2)}`,
    cells: Cvals.map((c, ci) => {
      const ig = !!inGamut[ri][ci];
      return ig
        ? { label: `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${H})`, background: `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${H})`, foreground: l > 0.5 ? '#000' : '#fff' }
        : { label: 'out of gamut', background: 'var(--color-bg-surface)', foreground: 'var(--color-text-disabled)', disabled: true };
    }),
  }));

const FG_ROWS = JSON.stringify(buildGamut(
  [0.95, 0.84, 0.73, 0.62, 0.55, 0.44, 0.33, 0.22, 0.11],
  [0.020, 0.065, 0.110, 0.155, 0.200],
  142,
  [[1,1,0,0,0],[1,1,1,0,0],[1,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,0],[1,1,1,0,0],[1,1,0,0,0],[1,0,0,0,0]],
));
const FG_HEADERS = JSON.stringify(['C 0.020', 'C 0.065', 'C 0.110', 'C 0.155', 'C 0.200']);

const BG_ROWS = JSON.stringify(buildGamut(
  [0.94, 0.83, 0.72, 0.61, 0.50, 0.39, 0.28, 0.17, 0.06],
  [0.020, 0.054, 0.090, 0.130, 0.170],
  333,
  [[1,1,1,0,0],[1,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,0],[1,1,1,0,0],[1,1,0,0,0],[1,0,0,0,0]],
));
const BG_HEADERS = JSON.stringify(['C 0.020', 'C 0.054', 'C 0.090', 'C 0.130', 'C 0.170']);

const meta: Meta = {
  title: 'Examples/Color Iterator Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Interactive color accessibility tool: pick a foreground/background pair and iterate
over OKLCH gamut space to find contrast-compliant alternatives.

Assembles \`<candor-data-grid>\` (color-grid swatches), \`<candor-slider>\` (OKLCH
lightness axis with gradient track), \`<candor-radio>\`, \`<candor-checkbox>\`,
\`<candor-accordion-item>\`, \`<candor-stat>\` (WCAG/OKCA scores), \`<candor-table>\`
(measurement readout), \`<candor-navigation>\`, \`<candor-card>\`, \`<candor-badge>\`,
and \`<candor-accessible-text>\`.

The data grid renders an OKLCH gamut as a color grid; the slider sweeps lightness
while holding chroma and hue constant.

This example is also a stress-test for the design system itself — every component
is under real conditions with live data rather than static props.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ColorPairIterator: Story = {
  render: () => ({
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page);">

        <candor-navigation
          brand="Candor"
          items='${NAV_ITEMS}'
          orientation="horizontal">
        </candor-navigation>

        <div style="max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem 4rem;">

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

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: 1.25rem; align-items: start;">

            <div style="display: flex; flex-direction: column; gap: 1rem;">

              <candor-card variant="default" style="display: block;">
                <div style="display: flex; flex-direction: column; gap: 0.875rem;">

                  <candor-accessible-text role_="label" bold>Foreground</candor-accessible-text>

                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    background: var(--color-bg-page);
                    border: 1px solid var(--color-border-default);
                    border-radius: var(--radius-sm);
                    padding: 0.375rem 0.625rem;
                  ">
                    <div aria-hidden="true" style="width: 1.5rem; height: 1.5rem; border-radius: var(--radius-sm); background: #647a61; flex-shrink: 0; border: 1px solid var(--color-border-default);"></div>
                    <input type="text" value="#647a61" aria-label="Foreground hex color"
                      style="background: transparent; border: none; outline: none; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); width: 6rem; letter-spacing: 0.02em;"
                    />
                  </div>

                  <candor-slider
                    label="Lightness — hold C and H"
                    min="0" max="1" step="0.001" value="0.555"
                    gradient="linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))">
                  </candor-slider>

                  <div style="display: flex; gap: 1rem; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">
                    <span><span style="color: var(--color-text-default);">L</span> 0.55</span>
                    <span><span style="color: var(--color-text-default);">C</span> 0.065</span>
                    <span><span style="color: var(--color-text-default);">H</span> 142°</span>
                  </div>

                  <div style="background: var(--color-bg-page); border-radius: var(--radius-md); padding: 0 0.75rem;">
                    <candor-accordion-item heading="LCH Limits">
                      <candor-data-grid id="fg-gamut" caption="Foreground tones — olive H 142"></candor-data-grid>
                    </candor-accordion-item>
                  </div>

                </div>
              </candor-card>

              <candor-card variant="default" style="display: block;">
                <div style="display: flex; flex-direction: column; gap: 0.875rem;">

                  <candor-accessible-text role_="label" bold>Background</candor-accessible-text>

                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    background: var(--color-bg-page);
                    border: 1px solid var(--color-border-default);
                    border-radius: var(--radius-sm);
                    padding: 0.375rem 0.625rem;
                  ">
                    <div aria-hidden="true" style="width: 1.5rem; height: 1.5rem; border-radius: var(--radius-sm); background: #ffe1f9; flex-shrink: 0; border: 1px solid var(--color-border-default);"></div>
                    <input type="text" value="#ffe1f9" aria-label="Background hex color"
                      style="background: transparent; border: none; outline: none; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-default); width: 6rem; letter-spacing: 0.02em;"
                    />
                  </div>

                  <candor-slider
                    label="Lightness — hold C and H"
                    min="0" max="1" step="0.001" value="0.94"
                    gradient="linear-gradient(to right, oklch(0.05 0.054 333), oklch(0.94 0.054 333), oklch(0.97 0.054 333))">
                  </candor-slider>

                  <div style="display: flex; gap: 1rem; font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">
                    <span><span style="color: var(--color-text-default);">L</span> 0.94</span>
                    <span><span style="color: var(--color-text-default);">C</span> 0.054</span>
                    <span><span style="color: var(--color-text-default);">H</span> 333°</span>
                  </div>

                  <div style="background: var(--color-bg-page); border-radius: var(--radius-md); padding: 0 0.75rem;">
                    <candor-accordion-item heading="LCH Limits">
                      <candor-data-grid id="bg-gamut" caption="Background tones — pink H 333"></candor-data-grid>
                    </candor-accordion-item>
                  </div>

                </div>
              </candor-card>

              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <candor-button variant="tertiary" size="small">⇄ Swap</candor-button>
                <candor-button variant="tertiary" size="small">≈ Harmonize</candor-button>
                <candor-button variant="ghost" size="small">↺ Reset</candor-button>
                <candor-button variant="ghost" size="small">✦ Random</candor-button>
              </div>

              <div style="background: var(--color-bg-surface); border-radius: var(--radius-md); padding: 0 1rem;">
                <candor-accordion-item heading="Contrast algorithm" open>
                  <fieldset style="border: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
                    <legend style="display: none;">Contrast algorithm</legend>
                    <candor-radio name="algorithm" label="WCAG 2.1" value="wcag21" checked></candor-radio>
                    <candor-radio name="algorithm" label="OKCA" value="okca"></candor-radio>
                    <candor-radio name="algorithm" label="Perceptual" value="perceptual"></candor-radio>
                    <candor-radio name="algorithm" label="Delta E" value="deltae"></candor-radio>
                  </fieldset>
                </candor-accordion-item>
                <candor-accordion-item heading="Display options">
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <candor-checkbox label="Hold chroma constant" checked></candor-checkbox>
                    <candor-checkbox label="Show gradient track" checked></candor-checkbox>
                  </div>
                </candor-accordion-item>
              </div>

            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">

              <candor-card variant="elevated" style="display: block;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 0.5rem 0;">

                  <candor-stat value="3.9" unit=":1" label="WCAG 2.1 contrast ratio" color="warning">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                      <candor-badge variant="error" size="sm">AA text ✗</candor-badge>
                      <candor-badge variant="success" size="sm">Large text ✓</candor-badge>
                      <candor-badge variant="success" size="sm">Non-text ✓</candor-badge>
                    </div>
                    <candor-accessible-text role_="annotation" color="secondary" style="text-align: center; display: block;">
                      Needs 4.5:1 for AA · 7:1 for AAA
                    </candor-accessible-text>
                  </candor-stat>

                </div>
              </candor-card>

              <candor-card variant="default" style="display: block;">
                <candor-accessible-text role_="label" bold style="display: block; margin-bottom: 0.75rem;">Preview</candor-accessible-text>
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
              </candor-card>

              <candor-card variant="default" style="display: block;">
                <candor-accessible-text role_="label" bold style="display: block; margin-bottom: 0.75rem;">Measurements</candor-accessible-text>
                <candor-table id="meas-table" compact></candor-table>
              </candor-card>

            </div>
          </div>
        </div>
      </div>

      <script>
        (function() {
          var fg = document.getElementById('fg-gamut');
          if (fg) { fg.rows = ${FG_ROWS}; fg.columnheaders = ${FG_HEADERS}; }
          var bg = document.getElementById('bg-gamut');
          if (bg) { bg.rows = ${BG_ROWS}; bg.columnheaders = ${BG_HEADERS}; }
          var meas = document.getElementById('meas-table');
          if (meas) {
            meas.rows = [
              { cells: ['WCAG 2.1', '3.9'], isHeader: false },
              { cells: ['OKCA', '4.0'], isHeader: false },
              { cells: ['Perceptual', '60'], isHeader: false },
              { cells: ['Delta E', '48'], isHeader: false },
              { cells: ['FG · L C H', '0.55 · 0.065 · 142°'], isHeader: false },
              { cells: ['BG · L C H', '0.94 · 0.054 · 333°'], isHeader: false },
            ];
          }
        })();
      </script>
    `,
  }),
};
