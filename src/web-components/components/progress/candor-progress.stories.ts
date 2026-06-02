import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Progress',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-progress>\` — progress indicator in two forms: a horizontal bar or a circular
spinner.

- **Bar** (\`type="bar"\`) — for determinate progress with a known percentage (file upload, multi-step form)
- **Spinner** (\`type="spinner"\`) — for indeterminate loading (waiting on a response, background task)

Set \`indeterminate\` when the duration is unknown — this renders an animated loop rather
than a static bar at 0%. Always provide a \`label\` for screen readers; the visual bar
conveys no information to assistive technology without it.
        `.trim(),
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['bar', 'spinner'],
      type: { name: 'string' },
      description: 'Visual form',
    },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Percentage 0–100 (bar only)' },
    indeterminate: { control: 'boolean', type: { name: 'boolean' }, description: 'Animated loop instead of a value-based fill' },
    label: { control: 'text', type: { name: 'string' }, description: 'Accessible name announced by screen readers' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      type: { name: 'string' },
      description: 'Size (spinner only)',
    },
  },
  args: { type: 'bar', value: 65, indeterminate: false, label: 'Loading data', size: 'md' },
  render: (args) => ({
    template: `<candor-progress type="${args['type']}" value="${args['value']}" label="${args['label']}" size="${args['size']}" ${args['indeterminate'] ? 'indeterminate' : ''}></candor-progress>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const BarIndeterminate: Story = { args: { type: 'bar', indeterminate: true, label: 'Loading' }, render: () => ({ template: `<candor-progress type="bar" indeterminate label="Loading"></candor-progress>` }) };
export const BarEmpty: Story = { args: { type: 'bar', value: 0, label: 'Starting upload' } };
export const BarComplete: Story = { args: { type: 'bar', value: 100, label: 'Upload complete' } };
export const SpinnerSm: Story = { args: { type: 'spinner', size: 'sm', label: 'Loading' }, render: () => ({ template: `<candor-progress type="spinner" size="sm" label="Loading"></candor-progress>` }) };
export const SpinnerMd: Story = { args: { type: 'spinner', size: 'md', label: 'Loading content' }, render: () => ({ template: `<candor-progress type="spinner" size="md" label="Loading content"></candor-progress>` }) };
export const SpinnerLg: Story = { args: { type: 'spinner', size: 'lg', label: 'Processing' }, render: () => ({ template: `<candor-progress type="spinner" size="lg" label="Processing"></candor-progress>` }) };

export const AllBarStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:500px;">
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-2xs);">0% · Not started</div>
          <candor-progress value="0" label="Not started"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-2xs);">33% · In progress</div>
          <candor-progress value="33" label="In progress"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-2xs);">65% · Nearly there</div>
          <candor-progress value="65" label="Nearly there"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-2xs);">100% · Complete</div>
          <candor-progress value="100" label="Complete"></candor-progress>
        </div>
        <div>
          <div style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-2xs);">Indeterminate · Loading</div>
          <candor-progress indeterminate label="Loading"></candor-progress>
        </div>
      </div>
    `,
  }),
};

export const AllSpinnerSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:var(--spacing-xl);">
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--spacing-xs);">
          <candor-progress type="spinner" size="sm" label="Loading"></candor-progress>
          <span style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);letter-spacing:var(--letter-spacing-italic);">Small</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--spacing-xs);">
          <candor-progress type="spinner" size="md" label="Loading"></candor-progress>
          <span style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);letter-spacing:var(--letter-spacing-italic);">Medium</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--spacing-xs);">
          <candor-progress type="spinner" size="lg" label="Loading"></candor-progress>
          <span style="font-family:var(--font-family-accessible);font-size:var(--font-size-sm);color:var(--color-text-subtle);letter-spacing:var(--letter-spacing-italic);">Large</span>
        </div>
      </div>
    `,
  }),
};
