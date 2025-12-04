import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

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
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Primary Button</app-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Secondary Button</app-button>`,
  }),
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Tertiary Button</app-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Ghost Button</app-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary">Primary</app-button>
        <app-button variant="secondary">Secondary</app-button>
        <app-button variant="tertiary">Tertiary</app-button>
        <app-button variant="ghost">Ghost</app-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button size="small">Small</app-button>
        <app-button size="medium">Medium</app-button>
        <app-button size="large">Large</app-button>
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary" [disabled]="true">Primary Disabled</app-button>
        <app-button variant="secondary" [disabled]="true">Secondary Disabled</app-button>
        <app-button variant="tertiary" [disabled]="true">Tertiary Disabled</app-button>
        <app-button variant="ghost" [disabled]="true">Ghost Disabled</app-button>
      </div>
    `,
  }),
};

export const FullMatrix: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 1rem;">Primary</h3>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="primary" size="small">Small</app-button>
            <app-button variant="primary" size="medium">Medium</app-button>
            <app-button variant="primary" size="large">Large</app-button>
            <app-button variant="primary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem;">Secondary</h3>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="secondary" size="small">Small</app-button>
            <app-button variant="secondary" size="medium">Medium</app-button>
            <app-button variant="secondary" size="large">Large</app-button>
            <app-button variant="secondary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem;">Tertiary</h3>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="tertiary" size="small">Small</app-button>
            <app-button variant="tertiary" size="medium">Medium</app-button>
            <app-button variant="tertiary" size="large">Large</app-button>
            <app-button variant="tertiary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem;">Ghost</h3>
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
