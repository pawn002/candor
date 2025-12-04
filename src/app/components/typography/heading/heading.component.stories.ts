import type { Meta, StoryObj } from '@storybook/angular';
import { HeadingComponent } from './heading.component';

const meta: Meta<HeadingComponent> = {
  title: 'Typography/Heading',
  component: HeadingComponent,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Semantic heading level',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
      description: 'Text color variant',
    },
  },
};

export default meta;
type Story = StoryObj<HeadingComponent>;

export const H1: Story = {
  args: {
    level: 'h1',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H2: Story = {
  args: {
    level: 'h2',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H3: Story = {
  args: {
    level: 'h3',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H4: Story = {
  args: {
    level: 'h4',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H5: Story = {
  args: {
    level: 'h5',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const H6: Story = {
  args: {
    level: 'h6',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<app-heading [level]="level" [color]="color">The quick brown fox jumps over the lazy dog</app-heading>`,
  }),
};

export const AllHeadings: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <app-heading level="h1">Heading 1</app-heading>
        <app-heading level="h2">Heading 2</app-heading>
        <app-heading level="h3">Heading 3</app-heading>
        <app-heading level="h4">Heading 4</app-heading>
        <app-heading level="h5">Heading 5</app-heading>
        <app-heading level="h6">Heading 6</app-heading>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <app-heading level="h2" color="primary">Primary Color</app-heading>
        <app-heading level="h2" color="secondary">Secondary Color</app-heading>
        <app-heading level="h2" color="disabled">Disabled Color</app-heading>
      </div>
    `,
  }),
};
