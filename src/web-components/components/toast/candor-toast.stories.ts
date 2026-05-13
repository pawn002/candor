import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Toast',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    heading: { control: 'text' },
    message: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: { variant: 'info', heading: '', message: 'Your changes have been saved.', dismissible: true },
  render: (args) => ({
    template: `<candor-toast variant="${args['variant']}" heading="${args['heading']}" message="${args['message']}" ${args['dismissible'] ? 'dismissible' : ''}></candor-toast>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <candor-toast variant="info" message="Your session expires in 10 minutes."></candor-toast>
        <candor-toast variant="success" heading="Saved" message="Your profile has been updated." dismissible></candor-toast>
        <candor-toast variant="warning" heading="Low storage" message="You are using 95% of your quota." dismissible></candor-toast>
        <candor-toast variant="error" heading="Upload failed" message="The file exceeds the 10 MB limit." dismissible></candor-toast>
      </div>
    `,
  }),
};
