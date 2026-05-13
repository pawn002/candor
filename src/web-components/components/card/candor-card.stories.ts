import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Card',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'elevated', 'outlined'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
  args: { variant: 'default', padding: 'md' },
  render: (args) => ({
    template: `
      <candor-card variant="${args['variant']}" padding="${args['padding']}">
        <span slot="header">Card Header</span>
        <p style="margin:0">Card body content goes here.</p>
        <span slot="footer">Card Footer</span>
      </candor-card>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:1rem;">
        <candor-card variant="default">
          <span slot="header">Default</span>
          <p style="margin:0">Surface background with no shadow.</p>
        </candor-card>
        <candor-card variant="elevated">
          <span slot="header">Elevated</span>
          <p style="margin:0">White background with shadow elevation.</p>
        </candor-card>
        <candor-card variant="outlined">
          <span slot="header">Outlined</span>
          <p style="margin:0">Page background with explicit border.</p>
        </candor-card>
      </div>
    `,
  }),
};
