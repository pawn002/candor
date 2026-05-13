import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Form/Switch',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Enable notifications', checked: false, disabled: false },
  render: (args) => ({
    template: `<candor-switch label="${args['label']}" ${args['checked'] ? 'checked' : ''} ${args['disabled'] ? 'disabled' : ''}></candor-switch>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-switch label="Off (default)"></candor-switch>
        <candor-switch label="On" checked></candor-switch>
        <candor-switch label="Disabled off" disabled></candor-switch>
        <candor-switch label="Disabled on" checked disabled></candor-switch>
      </div>
    `,
  }),
};
