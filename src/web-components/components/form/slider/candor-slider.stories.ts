import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { setElementProps } from '../../../story-utils';

import '../../card/candor-card';
import '../../typography/accessible-text/candor-accessible-text';
import './candor-slider';

const meta: Meta = {
  title: 'Components/Form/Slider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-slider>\` — range input with optional gradient track visualization. Designed for
continuous numeric values where the position on a spectrum matters — lightness, opacity,
threshold, volume.

**\`valueTextFn\` — JavaScript property only.** Functions cannot travel through HTML
attributes, so this cannot be set via markup. Set it on the element reference instead:

\`\`\`js
// Lit template (inside another web component)
html\`<candor-slider .valueTextFn=\${(v) => \`\${v}%\`}></candor-slider>\`

// Plain JS
document.querySelector('candor-slider').valueTextFn = (v) => \`\${v}%\`;
\`\`\`

Without \`valueTextFn\`, the screen reader announces the raw number ("0.65"). With it, you
control the announcement ("L=0.65", "70%", "−12 dB"). Required whenever the raw number is
not self-describing.

The \`gradient\` attribute accepts a CSS \`linear-gradient()\` string rendered behind the
track — use it to show the lightness or hue spectrum the slider is traversing:

\`\`\`html
<candor-slider
  label="Lightness"
  min="0.36" max="0.94" step="0.001" value="0.65"
  gradient="linear-gradient(to right,
    oklch(0.36 0.12 142),
    oklch(0.65 0.12 142),
    oklch(0.94 0.11 142))"
></candor-slider>
\`\`\`

Set \`min\` and \`max\` to the actual sRGB gamut limits for the chosen hue and chroma — these
differ per colour (use \`klar lightness\` to find them). Staying within gamut means the thumb
never reaches an out-of-gamut value that the browser would silently clamp.

Keep C and H constant across the stops so only lightness varies — the thumb position then
directly encodes the L value. The numeric display is hidden in gradient mode; set
\`valueTextFn\` via JS to give the screen reader a meaningful announcement (e.g. \`"L=0.55"\`).

Form-associated (\`ElementInternals\`): the current value participates in form submission.

**Events** follow the Candor two-event rule (see \`events.ts\` / #164): \`input\` streams the
live value on every drag tick and arrow-key step; \`change\` fires once on pointer release or
keyboard commit. Both carry the value as a \`number\` in \`detail\`. The legacy \`value-change\`
was removed in 5.0.0 (#201) — use \`input\`, which has the same live semantics and the same
payload.

**Sizing:** Override track and thumb geometry per-instance via CSS custom properties.
The thumb centering calc updates automatically when either var changes.

| Property | Default | Controls |
|---|---|---|
| \`--candor-slider-track-height\` | \`4px\` | Slim track height |
| \`--candor-slider-thumb-size\` | \`1.375rem\` | Thumb diameter |
| \`--candor-slider-gradient-height\` | \`2.75rem\` | Gradient variant container height |

\`\`\`css
candor-slider#volume { --candor-slider-thumb-size: 1.75rem; }
\`\`\`
        `.trim(),
      },
    },
  },
  argTypes: {
    min:      { control: { type: 'number' }, description: 'Minimum value' },
    max:      { control: { type: 'number' }, description: 'Maximum value' },
    step:     { control: { type: 'number' }, description: 'Step increment' },
    value:    { control: { type: 'number' }, description: 'Current value' },
    label:    { control: 'text', type: { name: 'string' }, description: 'Field label' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
    gradient: { control: 'text', type: { name: 'string' }, description: 'CSS linear-gradient() string for the track background' },
  },
  args: { min: 0, max: 100, value: 40, disabled: false },
  render: (args) => html`<candor-slider label="Volume" min="${args['min']}" max="${args['max']}" value="${args['value']}" ?disabled=${args['disabled']}></candor-slider>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Percentage: Story = {
  render: () => html`<candor-slider label="Opacity" min="0" max="100" step="1" value="70"></candor-slider>`,
  // valueTextFn is a function — it cannot pass through the template attribute, so
  // set it after render. Without it the screen reader announces "70" not "70%".
  play: setElementProps('candor-slider', { valueTextFn: (v: number) => `${v}%` }),
};

export const GradientTrack: Story = {
  name: 'Gradient track — OKLCH lightness axis',
  parameters: {
    docs: {
      description: {
        story: '**`valueTextFn` is required for this variant.** Without it, the screen reader ' +
          'announces the raw decimal ("0.65") with no indication it is an L value. Set it via ' +
          'the JavaScript property: `slider.valueTextFn = (v) => \`L=${v.toFixed(2)}\``.\n\n' +
          'Set `min` and `max` to the sRGB gamut limits for the chosen hue and chroma — ' +
          'use `klar lightness "oklch(L C H)"` to find them. Different chromas produce ' +
          'different gamut limits: C=0.12 (vivid green) cannot go below L=0.36, while ' +
          'C=0.054 (muted rose) reaches as low as L=0.12. Staying within gamut prevents ' +
          'the browser from silently clamping out-of-gamut values.',
      },
    },
  },
  render: () => html`<candor-slider label="Lightness — hold C and H" min="0.36" max="0.94" step="0.001" value="0.65" gradient="linear-gradient(to right, oklch(0.36 0.12 142), oklch(0.65 0.12 142), oklch(0.94 0.11 142))"></candor-slider>`,
  // Gradient mode hides the numeric display; valueTextFn gives the screen reader the
  // L value it otherwise couldn't infer from the raw decimal. Function → set in play.
  play: setElementProps('candor-slider', { valueTextFn: (v: number) => `L=${v.toFixed(2)}` }),
};

export const AllVariants: Story = {
  render: () => html`
    <div style="max-width:480px;display:flex;flex-direction:column;gap:var(--spacing-md);">
      <candor-card>
        <span slot="header">Default fill</span>
        <candor-slider label="Opacity" min="0" max="100" step="1" value="40"></candor-slider>
      </candor-card>
      <candor-card>
        <span slot="header">Vivid green — C 0.12, gamut L 0.36–0.94</span>
        <candor-slider label="Lightness — hold C and H" min="0.36" max="0.94" step="0.001" value="0.65" gradient="linear-gradient(to right, oklch(0.36 0.12 142), oklch(0.65 0.12 142), oklch(0.94 0.11 142))"></candor-slider>
      </candor-card>
      <candor-card>
        <span slot="header">Muted rose — C 0.054, gamut L 0.12–0.93</span>
        <candor-slider label="Lightness — hold C and H" min="0.12" max="0.93" step="0.001" value="0.53" gradient="linear-gradient(to right, oklch(0.12 0.054 333), oklch(0.53 0.054 333), oklch(0.93 0.054 333))"></candor-slider>
      </candor-card>
      <candor-card>
        <span slot="header">Disabled</span>
        <candor-slider label="Volume" min="0" max="100" step="1" value="60" disabled></candor-slider>
        <candor-accessible-text role_="annotation" style="display:block;margin-top:var(--spacing-xs);">Volume is locked while recording is active.</candor-accessible-text>
      </candor-card>
    </div>
  `,
  // Only the gradient (lightness) sliders need the L= announcement; the Opacity and
  // Volume sliders are self-describing on their 0–100 scale.
  play: setElementProps('candor-slider[gradient]', { valueTextFn: (v: number) => `L=${v.toFixed(2)}` }),
};
