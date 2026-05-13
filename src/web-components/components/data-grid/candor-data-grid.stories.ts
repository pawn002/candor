import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/DataGrid',
  tags: ['autodocs'],
  argTypes: {
    hideHeaders: { control: 'boolean' },
    showLabels: { control: 'boolean' },
    caption: { control: 'text' },
  },
  args: { hideHeaders: false, showLabels: false, caption: 'Heat map' },
  render: (args) => ({
    template: `<candor-data-grid
      id="demo-grid"
      caption="${args['caption'] || ''}"
      ${args['hideHeaders'] ? 'hide-headers' : ''}
      ${args['showLabels'] ? 'show-labels' : ''}
    ></candor-data-grid>
    <script>
      (function() {
        var g = document.getElementById('demo-grid');
        g.columnHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        g.rows = [
          { rowHeader: '09:00', cells: [
            { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
            { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
            { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
            { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
            { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
          ]},
          { rowHeader: '12:00', cells: [
            { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
            { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff', selected: true },
            { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
            { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
            { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000' },
          ]},
          { rowHeader: '15:00', cells: [
            { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
            { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
            { label: 'Low',  background: 'oklch(0.93 0.05 150)', foreground: '#000', disabled: true },
            { label: 'High', background: 'oklch(0.55 0.18 150)', foreground: '#fff' },
            { label: 'Med',  background: 'oklch(0.75 0.12 150)', foreground: '#000' },
          ]},
        ];
      })();
    </script>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const ShowLabels: Story = {
  args: { showLabels: true },
};

export const HideHeaders: Story = {
  args: { hideHeaders: true },
};
