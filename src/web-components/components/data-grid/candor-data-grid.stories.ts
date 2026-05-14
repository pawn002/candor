import type { Meta, StoryObj } from '@storybook/angular';

const COL_HEADERS = JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
const GRID_ROWS = JSON.stringify([
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
]);

const meta: Meta = {
  title: 'Web Components/DataGrid',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<candor-data-grid caption="Heat map" columnheaders='${COL_HEADERS}' rows='${GRID_ROWS}'></candor-data-grid>`,
  }),
};

export const ShowLabels: Story = {
  render: () => ({
    template: `<candor-data-grid caption="Heat map" show-labels columnheaders='${COL_HEADERS}' rows='${GRID_ROWS}'></candor-data-grid>`,
  }),
};

export const HideHeaders: Story = {
  render: () => ({
    template: `<candor-data-grid caption="Heat map" hide-headers columnheaders='${COL_HEADERS}' rows='${GRID_ROWS}'></candor-data-grid>`,
  }),
};
