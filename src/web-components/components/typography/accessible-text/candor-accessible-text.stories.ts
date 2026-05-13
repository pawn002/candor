import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Typography/AccessibleText',
  tags: ['autodocs'],
  argTypes: {
    role_: { control: 'select', options: ['label', 'message', 'status', 'annotation'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'secondary', 'disabled', 'error'] },
    bold: { control: 'boolean' },
  },
  args: { role_: 'label', size: 'md', color: 'primary', bold: false },
  render: (args) => ({
    template: `<candor-accessible-text role_="${args['role_']}" size="${args['size']}" color="${args['color']}" ${args['bold'] ? 'bold' : ''}>National Insurance number</candor-accessible-text>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllRoles: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-accessible-text role_="label" bold>Form field label</candor-accessible-text>
        <candor-accessible-text role_="message">Informational message text</candor-accessible-text>
        <candor-accessible-text role_="status" color="error">Enter a valid email address.</candor-accessible-text>
        <candor-accessible-text role_="annotation" color="secondary">Last updated 3 hours ago</candor-accessible-text>
      </div>
    `,
  }),
};
