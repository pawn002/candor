import type { Meta, StoryObj } from '@storybook/angular';
import { SliderComponent } from './slider.component';

const meta: Meta<SliderComponent> = {
  title: 'Components/Form/Slider',
  component: SliderComponent,
  tags: ['autodocs'],
  argTypes: {
    min:      { control: { type: 'number' } },
    max:      { control: { type: 'number' } },
    step:     { control: { type: 'number' } },
    value:    { control: { type: 'number' } },
    label:    { control: 'text' },
    disabled: { control: 'boolean' },
    gradient: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SliderComponent>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 40,
    label: 'Opacity',
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width: 400px; padding: 1.5rem;">
      <app-slider
        [min]="min" [max]="max" [step]="step" [value]="value" [label]="label">
      </app-slider>
    </div>`,
  }),
};

export const GradientTrack: Story = {
  name: 'Gradient track — OKLCH lightness axis',
  args: {
    min: 0,
    max: 1,
    step: 0.001,
    value: 0.55,
    label: 'Lightness — hold C and H',
    // Sage green: oklch(L 0.065 142) — sweeps from near-black to near-white
    gradient: 'linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))',
  },
  render: (args) => ({
    // valueTextFn: lightness 0–1 is most meaningful as a percentage
    props: { ...args, valueTextFn: (v: number) => (v * 100).toFixed(0) + '%' },
    template: `<div style="max-width: 400px; padding: 1.5rem;">
      <app-slider
        [min]="min" [max]="max" [step]="step" [value]="value"
        [label]="label" [gradient]="gradient" [valueTextFn]="valueTextFn">
      </app-slider>
    </div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    // lightnessText: lightness 0–1 expressed as percentage for AT announcements
    props: { lightnessText: (v: number) => (v * 100).toFixed(0) + '%' },
    template: `
      <div style="max-width: 480px; padding: 1.5rem; display: flex; flex-direction: column; gap: 2rem;">

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0 0 0.75rem;">Default fill</p>
          <app-slider [min]="0" [max]="100" [step]="1" [value]="40" label="Opacity"></app-slider>
        </div>

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0 0 0.75rem;">Gradient track — OKLCH sage green</p>
          <app-slider
            [min]="0" [max]="1" [step]="0.001" [value]="0.55"
            label="Lightness — hold C and H"
            gradient="linear-gradient(to right, oklch(0.05 0.065 142), oklch(0.55 0.065 142), oklch(0.97 0.065 142))"
            [valueTextFn]="lightnessText">
          </app-slider>
        </div>

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0 0 0.75rem;">Gradient track — OKLCH pale rose</p>
          <app-slider
            [min]="0" [max]="1" [step]="0.001" [value]="0.94"
            label="Lightness — hold C and H"
            gradient="linear-gradient(to right, oklch(0.05 0.054 333), oklch(0.94 0.054 333), oklch(0.97 0.054 333))"
            [valueTextFn]="lightnessText">
          </app-slider>
        </div>

        <div>
          <p style="font-family: var(--font-family-accessible); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0 0 0.75rem;">Disabled</p>
          <app-slider [min]="0" [max]="100" [step]="1" [value]="60" label="Volume" [disabled]="true"></app-slider>
        </div>

      </div>
    `,
  }),
};
