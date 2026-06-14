import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

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
  render: (args) => html`<candor-progress type="${args['type']}" value="${args['value']}" label="${args['label']}" size="${args['size']}" ?indeterminate=${args['indeterminate']}></candor-progress>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const AllBarStates: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);max-width:500px;">
      <candor-card><span slot="header">0% · Not started</span><candor-progress value="0" label="Not started"></candor-progress></candor-card>
      <candor-card><span slot="header">33% · In progress</span><candor-progress value="33" label="In progress"></candor-progress></candor-card>
      <candor-card><span slot="header">65% · Nearly there</span><candor-progress value="65" label="Nearly there"></candor-progress></candor-card>
      <candor-card><span slot="header">100% · Complete</span><candor-progress value="100" label="Complete"></candor-progress></candor-card>
      <candor-card><span slot="header">Indeterminate · Loading</span><candor-progress indeterminate label="Loading"></candor-progress></candor-card>
    </div>
  `,
};

export const AllSpinnerSizes: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--spacing-sm);">
      <candor-card style="flex:1;text-align:center;">
        <span slot="header">Small</span>
        <candor-progress type="spinner" size="sm" label="Loading"></candor-progress>
      </candor-card>
      <candor-card style="flex:1;text-align:center;">
        <span slot="header">Medium</span>
        <candor-progress type="spinner" size="md" label="Loading"></candor-progress>
      </candor-card>
      <candor-card style="flex:1;text-align:center;">
        <span slot="header">Large</span>
        <candor-progress type="spinner" size="lg" label="Loading"></candor-progress>
      </candor-card>
    </div>
  `,
};
