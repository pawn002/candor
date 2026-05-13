import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Typography/Text',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['body', 'caption', 'label'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
    color: { control: 'select', options: ['primary', 'secondary', 'disabled'] },
    bold: { control: 'boolean' },
  },
  args: { variant: 'body', size: 'md', color: 'primary', bold: false },
  render: (args) => ({
    template: `<candor-text variant="${args['variant']}" size="${args['size']}" color="${args['color']}" ${args['bold'] ? 'bold' : ''}>The quick brown fox jumps over the lazy dog.</candor-text>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-text variant="body">Body — Noto Serif, editorial voice. The quick brown fox jumps over the lazy dog.</candor-text>
        <candor-text variant="caption">Caption — italic serif, supplementary metadata.</candor-text>
        <candor-text variant="label">Label — uppercase Roboto Flex</candor-text>
      </div>
    `,
  }),
};
