import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { TextComponent } from '../typography/text/text.component';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'destructive'],
      description: 'Button visual style. primary/secondary/tertiary/ghost follow a loudness hierarchy. destructive (crimson burgundy, H=347) signals irreversible actions — distinct from error (H=25 orange-red).',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button HTML type',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Default: Story = {
  args: { variant: 'primary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Save changes</app-button>`,
  }),
};

export const Primary: Story = {
  args: { variant: 'primary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Save changes</app-button>`,
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Export</app-button>`,
  }),
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Learn more</app-button>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Cancel</app-button>`,
  }),
};

export const Destructive: Story = {
  args: { variant: 'destructive', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Delete</app-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary">Save changes</app-button>
        <app-button variant="secondary">Export</app-button>
        <app-button variant="tertiary">Learn more</app-button>
        <app-button variant="ghost">Cancel</app-button>
        <app-button variant="destructive">Delete</app-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary" size="small">Small</app-button>
        <app-button variant="primary" size="medium">Medium</app-button>
        <app-button variant="primary" size="large">Large</app-button>
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary" [disabled]="true">Save changes</app-button>
        <app-button variant="secondary" [disabled]="true">Export</app-button>
        <app-button variant="tertiary" [disabled]="true">Learn more</app-button>
        <app-button variant="ghost" [disabled]="true">Cancel</app-button>
        <app-button variant="destructive" [disabled]="true">Delete</app-button>
      </div>
    `,
  }),
};

export const DestructiveInContext: Story = {
  decorators: [moduleMetadata({ imports: [TextComponent] })],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Paired with primary — typical confirm/cancel/delete layout</app-text>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <app-button variant="primary">Save changes</app-button>
            <app-button variant="ghost">Cancel</app-button>
            <app-button variant="destructive">Delete</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">With error state nearby — hue separation from H=25 error</app-text>
          <p style="color: var(--color-status-error-text); font-family: var(--font-family-accessible); font-size: var(--font-size-sm); margin-bottom: var(--spacing-sm);">⚠ This action cannot be undone. 3 records will be permanently deleted.</p>
          <div style="display: flex; gap: 1rem;">
            <app-button variant="ghost">Cancel</app-button>
            <app-button variant="destructive">Delete permanently</app-button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const FullMatrix: Story = {
  decorators: [moduleMetadata({ imports: [TextComponent] })],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Primary</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="primary" size="small">Small</app-button>
            <app-button variant="primary" size="medium">Medium</app-button>
            <app-button variant="primary" size="large">Large</app-button>
            <app-button variant="primary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Secondary</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="secondary" size="small">Small</app-button>
            <app-button variant="secondary" size="medium">Medium</app-button>
            <app-button variant="secondary" size="large">Large</app-button>
            <app-button variant="secondary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Tertiary</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="tertiary" size="small">Small</app-button>
            <app-button variant="tertiary" size="medium">Medium</app-button>
            <app-button variant="tertiary" size="large">Large</app-button>
            <app-button variant="tertiary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Ghost</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="ghost" size="small">Small</app-button>
            <app-button variant="ghost" size="medium">Medium</app-button>
            <app-button variant="ghost" size="large">Large</app-button>
            <app-button variant="ghost" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Destructive — not a hierarchy tier; applies to any CTA that performs an irreversible action</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="destructive" size="small">Small</app-button>
            <app-button variant="destructive" size="medium">Medium</app-button>
            <app-button variant="destructive" size="large">Large</app-button>
            <app-button variant="destructive" [disabled]="true">Disabled</app-button>
          </div>
        </div>
      </div>
    `,
  }),
};
