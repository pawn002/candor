import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Alert',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    heading: { control: 'text' },
    message: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: { variant: 'info', heading: '', message: 'This is an informational message.', dismissible: false },
  render: (args) => ({
    template: `<candor-alert variant="${args['variant']}" heading="${args['heading']}" message="${args['message']}" ${args['dismissible'] ? 'dismissible' : ''}></candor-alert>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <candor-alert variant="info" message="Your session will expire in 5 minutes."></candor-alert>
        <candor-alert variant="success" heading="Saved" message="Your changes have been saved."></candor-alert>
        <candor-alert variant="warning" heading="Warning" message="This action may affect other users."></candor-alert>
        <candor-alert variant="error" heading="Error" message="Failed to save changes. Please try again." dismissible></candor-alert>
      </div>
    `,
  }),
};
