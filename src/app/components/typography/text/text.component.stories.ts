import type { Meta, StoryObj } from '@storybook/angular';
import { TextComponent } from './text.component';

const meta: Meta<TextComponent> = {
  title: 'Typography/Text',
  component: TextComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'caption', 'label'],
      description: 'Text style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
      description: 'Text color',
    },
    bold: {
      control: 'boolean',
      description: 'Bold text',
    },
  },
};

export default meta;
type Story = StoryObj<TextComponent>;

export const Body: Story = {
  args: {
    variant: 'body',
    size: 'md',
    color: 'primary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">
      The quick brown fox jumps over the lazy dog. This is body text that should be easy to read and comfortable for extended reading sessions.
    </app-text>`,
  }),
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    size: 'md',
    color: 'secondary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">
      This is caption text, typically used for image captions or supplementary information.
    </app-text>`,
  }),
};

export const Label: Story = {
  args: {
    variant: 'label',
    size: 'md',
    color: 'primary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-text [variant]="variant" [size]="size" [color]="color" [bold]="bold">
      Form Label
    </app-text>`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-text variant="body" size="sm">Small text size</app-text>
        <app-text variant="body" size="md">Medium text size (default)</app-text>
        <app-text variant="body" size="lg">Large text size</app-text>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-text variant="body" color="primary">Primary color text</app-text>
        <app-text variant="body" color="secondary">Secondary color text</app-text>
        <app-text variant="body" color="disabled">Disabled color text</app-text>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <app-text variant="label" size="sm" [bold]="true">Body Text</app-text>
          <br>
          <app-text variant="body">
            The quick brown fox jumps over the lazy dog. This is body text that should be easy to read.
          </app-text>
        </div>
        <div>
          <app-text variant="label" size="sm" [bold]="true">Caption Text</app-text>
          <br>
          <app-text variant="caption" color="secondary">
            This is caption text, typically used for supplementary information.
          </app-text>
        </div>
        <div>
          <app-text variant="label" size="sm" [bold]="true">Label Text</app-text>
          <br>
          <app-text variant="label">FORM LABEL</app-text>
        </div>
      </div>
    `,
  }),
};
