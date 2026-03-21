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
      options: ['primary', 'secondary', 'tertiary', 'ghost'],
      description: 'Button visual style',
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

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary">Save changes</app-button>
        <app-button variant="secondary">Export</app-button>
        <app-button variant="tertiary">Learn more</app-button>
        <app-button variant="ghost">Cancel</app-button>
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
      </div>
    `,
  }),
};
