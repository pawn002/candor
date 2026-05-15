import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Breadcrumb',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<candor-breadcrumb items='[{"label":"Home","href":"/"},{"label":"Settings","href":"/settings"},{"label":"Profile"}]'></candor-breadcrumb>`,
  }),
};

export const TwoLevels: Story = {
  render: () => ({
    template: `<candor-breadcrumb items='[{"label":"Home","href":"/"},{"label":"Dashboard"}]'></candor-breadcrumb>`,
  }),
};

export const Deep: Story = {
  render: () => ({
    template: `<candor-breadcrumb items='[{"label":"Home","href":"/"},{"label":"Products","href":"/products"},{"label":"Electronics","href":"/products/electronics"},{"label":"Laptops","href":"/products/electronics/laptops"},{"label":"ThinkPad X1 Carbon"}]'></candor-breadcrumb>`,
  }),
};

export const SingleLevel: Story = {
  render: () => ({
    template: `<candor-breadcrumb items='[{"label":"Dashboard"}]'></candor-breadcrumb>`,
  }),
};
