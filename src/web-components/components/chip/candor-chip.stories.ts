import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Chip',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'] },
    selectable: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  args: { label: 'Tag', variant: 'default', selectable: false, dismissible: false, disabled: false, selected: false },
  render: (args) => ({
    template: `<candor-chip label="${args['label']}" variant="${args['variant']}" ${args['selectable'] ? 'selectable' : ''} ${args['dismissible'] ? 'dismissible' : ''} ${args['disabled'] ? 'disabled' : ''} ${args['selected'] ? 'selected' : ''}></candor-chip>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Selectable: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <candor-chip label="React" selectable></candor-chip>
        <candor-chip label="Angular" selectable selected></candor-chip>
        <candor-chip label="Vue" selectable></candor-chip>
      </div>
    `,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <candor-chip label="JavaScript" dismissible></candor-chip>
        <candor-chip label="TypeScript" dismissible></candor-chip>
        <candor-chip label="Python" dismissible variant="success"></candor-chip>
      </div>
    `,
  }),
};
