import type { Meta, StoryObj } from '@storybook/angular';
import { ProgressComponent } from './progress.component';

const meta: Meta<ProgressComponent> = {
  title: 'Components/Progress',
  component: ProgressComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['bar', 'spinner'],
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<ProgressComponent>;

export const BarDeterminate: Story = {
  args: { type: 'bar', value: 65, label: 'Upload progress', indeterminate: false },
};

export const BarIndeterminate: Story = {
  args: { type: 'bar', indeterminate: true, label: 'Loading' },
};

export const BarEmpty: Story = {
  args: { type: 'bar', value: 0, label: 'Starting upload' },
};

export const BarComplete: Story = {
  args: { type: 'bar', value: 100, label: 'Upload complete' },
};

export const SpinnerMd: Story = {
  args: { type: 'spinner', size: 'md', label: 'Loading content' },
};

export const SpinnerSm: Story = {
  args: { type: 'spinner', size: 'sm', label: 'Loading' },
};

export const SpinnerLg: Story = {
  args: { type: 'spinner', size: 'lg', label: 'Processing your request' },
};

export const AllBarStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 480px;">
        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 0.5rem; letter-spacing: 0.02em;">0%</p>
          <app-progress type="bar" [value]="0" label="Not started"></app-progress>
        </div>
        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 0.5rem; letter-spacing: 0.02em;">33%</p>
          <app-progress type="bar" [value]="33" label="In progress"></app-progress>
        </div>
        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 0.5rem; letter-spacing: 0.02em;">65%</p>
          <app-progress type="bar" [value]="65" label="Nearly there"></app-progress>
        </div>
        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 0.5rem; letter-spacing: 0.02em;">100%</p>
          <app-progress type="bar" [value]="100" label="Complete"></app-progress>
        </div>
        <div>
          <p style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin: 0 0 0.5rem; letter-spacing: 0.02em;">Indeterminate</p>
          <app-progress type="bar" [indeterminate]="true" label="Loading"></app-progress>
        </div>
      </div>
    `,
  }),
};

export const AllSpinnerSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 2.5rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
          <app-progress type="spinner" size="sm" label="Loading"></app-progress>
          <span style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">Small</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
          <app-progress type="spinner" size="md" label="Loading"></app-progress>
          <span style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">Medium</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
          <app-progress type="spinner" size="lg" label="Loading"></app-progress>
          <span style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); color: var(--color-text-subtle); letter-spacing: 0.02em;">Large</span>
        </div>
      </div>
    `,
  }),
};
