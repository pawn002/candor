import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Slider',
  tags: ['autodocs'],
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    value: { control: 'number' },
    disabled: { control: 'boolean' },
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
    template: `<candor-slider id="pct-slider" label="Opacity" min="0" max="1" step="0.01" value="0.7"></candor-slider>
    <script>
      const s = document.getElementById('pct-slider');
      s.valueTextFn = (v) => (v * 100).toFixed(0) + '%';
    </script>`,
  }),
};

export const GradientTrack: Story = {
  name: 'Gradient track — OKLCH lightness axis',
  render: () => ({
    template: `<candor-slider id="grad-slider" label="Lightness — hold C and H" min="0" max="1" step="0.001" value="0.55" gradient="linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))"></candor-slider>
    <script>
      document.getElementById('grad-slider').valueTextFn = (v) => (v * 100).toFixed(0) + '%';
    </script>`,
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
