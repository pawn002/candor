import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Web Components/Progress',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['bar', 'spinner'] },
    value: { control: 'number' },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { type: 'bar', value: 65, indeterminate: false, label: 'Loading data', size: 'md' },
  render: (args) => ({
    template: `<candor-progress type="${args['type']}" value="${args['value']}" label="${args['label']}" size="${args['size']}" ${args['indeterminate'] ? 'indeterminate' : ''}></candor-progress>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllBarStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:500px;">
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:0.25rem;">0% · Not started</div>
          <candor-progress value="0" label="Not started"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:0.25rem;">33% · In progress</div>
          <candor-progress value="33" label="In progress"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:0.25rem;">65% · Nearly there</div>
          <candor-progress value="65" label="Nearly there"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:0.25rem;">100% · Complete</div>
          <candor-progress value="100" label="Complete"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:0.25rem;">Indeterminate · Loading</div>
          <candor-progress indeterminate label="Loading"></candor-progress>
        </div>
      </div>
    `,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `<candor-progress indeterminate label="Processing…"></candor-progress>`,
  }),
};

export const Spinners: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:1rem;align-items:center;">
        <candor-progress type="spinner" size="sm" label="Loading"></candor-progress>
        <candor-progress type="spinner" size="md" label="Loading"></candor-progress>
        <candor-progress type="spinner" size="lg" label="Loading"></candor-progress>
      </div>
    `,
  }),
};
