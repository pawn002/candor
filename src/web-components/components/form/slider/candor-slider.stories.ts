import type { Meta, StoryObj } from '@storybook/angular';

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

**\`value-text-fn\`** — supply a function \`(value: number) => string\` via the JavaScript
property to provide a meaningful \`aria-valuetext\`. Required whenever the raw number is not
self-describing:

\`\`\`javascript
const slider = document.querySelector('candor-slider');
slider.valueTextFn = (v) => \`L=\${v.toFixed(2)}\`;
// Without it: screen reader announces "0.65"
// With it: screen reader announces "L=0.65"
\`\`\`

The \`gradient\` attribute accepts a CSS \`linear-gradient()\` string rendered behind the
track — use it to show the lightness or hue spectrum the slider is traversing.

Form-associated (\`ElementInternals\`): the current value participates in form submission.
Emits a \`value-change\` CustomEvent on input.
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
  render: (args) => ({
    template: `<candor-slider label="Volume" min="${args['min']}" max="${args['max']}" value="${args['value']}" ${args['disabled'] ? 'disabled' : ''}></candor-slider>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Percentage: Story = {
  render: () => ({
    template: `<candor-slider label="Opacity" min="0" max="100" step="1" value="70"></candor-slider>`,
  }),
};

export const GradientTrack: Story = {
  name: 'Gradient track — OKLCH lightness axis',
  render: () => ({
    template: `<candor-slider label="Lightness — hold C and H" min="0" max="1" step="0.001" value="0.55" gradient="linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))"></candor-slider>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="max-width:480px;padding:1.5rem;display:flex;flex-direction:column;gap:2rem;">
        <div>
          <p style="font-family:var(--font-family-accessible);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0 0 0.75rem;">Default fill</p>
          <candor-slider label="Opacity" min="0" max="100" step="1" value="40"></candor-slider>
        </div>
        <div>
          <p style="font-family:var(--font-family-accessible);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0 0 0.75rem;">Gradient track — OKLCH sage green</p>
          <candor-slider label="Lightness — hold C and H" min="0" max="1" step="0.001" value="0.55" gradient="linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))"></candor-slider>
        </div>
        <div>
          <p style="font-family:var(--font-family-accessible);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0 0 0.75rem;">Gradient track — OKLCH pale rose</p>
          <candor-slider label="Lightness — hold C and H" min="0" max="1" step="0.001" value="0.94" gradient="linear-gradient(to right, oklch(0.05 0.054 333), oklch(0.94 0.054 333), oklch(0.97 0.054 333))"></candor-slider>
        </div>
        <div>
          <p style="font-family:var(--font-family-accessible);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0 0 0.75rem;">Disabled</p>
          <candor-slider label="Volume" min="0" max="100" step="1" value="60" disabled></candor-slider>
        </div>
      </div>
    `,
  }),
};
