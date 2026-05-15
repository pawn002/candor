import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Typography/Heading',
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
  args: { level: 'h1', color: 'primary' },
  render: (args) => ({
    template: `<candor-heading level="${args['level']}" color="${args['color']}">The quick brown fox jumps over the lazy dog</candor-heading>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const H1: Story = { args: { level: 'h1' } };
export const H2: Story = { args: { level: 'h2' } };
export const H3: Story = { args: { level: 'h3' } };
export const H4: Story = { args: { level: 'h4' } };
export const H5: Story = { args: { level: 'h5' } };
export const H6: Story = { args: { level: 'h6' } };

export const AllHeadings: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <candor-heading level="h1">The Case for Slower Reading</candor-heading>
        <candor-heading level="h2">What Slow Reading Actually Means</candor-heading>
        <candor-heading level="h3">The Neuroscience of Attention</candor-heading>
        <candor-heading level="h4">A Note on Environment</candor-heading>
        <candor-heading level="h5">Recommended conditions</candor-heading>
        <candor-heading level="h6">On annotation tools</candor-heading>
      </div>
    `,
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-heading level="h2" color="primary">Primary Color</candor-heading>
        <candor-heading level="h2" color="secondary">Secondary Color</candor-heading>
        <candor-heading level="h2" color="disabled">Disabled Color</candor-heading>
      </div>
    `,
  }),
};
