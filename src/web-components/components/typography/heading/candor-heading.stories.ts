import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Typography/Heading',
  tags: ['autodocs'],
  argTypes: {
    level: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    color: { control: 'select', options: ['primary', 'secondary', 'disabled'] },
  },
  args: { level: 'h2', color: 'primary' },
  render: (args) => ({
    template: `<candor-heading level="${args['level']}" color="${args['color']}">The quick brown fox</candor-heading>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllLevels: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <candor-heading level="h1">Heading 1 — Display</candor-heading>
        <candor-heading level="h2">Heading 2 — Section</candor-heading>
        <candor-heading level="h3">Heading 3 — Subsection</candor-heading>
        <candor-heading level="h4">Heading 4 — Group</candor-heading>
        <candor-heading level="h5">Heading 5 — Label</candor-heading>
        <candor-heading level="h6">Heading 6 — Micro</candor-heading>
      </div>
    `,
  }),
};
