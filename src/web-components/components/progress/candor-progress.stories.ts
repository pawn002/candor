import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../card/candor-card';
import './candor-progress';

const meta: Meta = {
  title: 'Components/Progress',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-progress>\`: a progress indicator with two forms, a horizontal bar or a circular
spinner.

- **Bar** (\`type="bar"\`): for determinate progress with a known percentage (file upload, multi-step form)
- **Spinner** (\`type="spinner"\`): for indeterminate loading (waiting on a response, background task)

Set \`indeterminate\` when the duration is unknown. This renders an animated loop rather
than a static bar at 0%. Always provide a \`label\` that says what is in progress ("Uploading report").
Without it the accessible name falls back to "Loading", which tells a screen-reader user
nothing about what they are waiting for.
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
    label: { control: 'text', type: { name: 'string' }, description: 'What is in progress. Visible above the bar, and the accessible name of both types' },
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
      <candor-card><span slot="header">Not started</span><candor-progress value="0" label="Uploading report"></candor-progress></candor-card>
      <candor-card><span slot="header">In progress</span><candor-progress value="33" label="Uploading report"></candor-progress></candor-card>
      <candor-card><span slot="header">Nearly there</span><candor-progress value="65" label="Uploading report"></candor-progress></candor-card>
      <candor-card><span slot="header">Complete</span><candor-progress value="100" label="Uploading report"></candor-progress></candor-card>
      <candor-card><span slot="header">Indeterminate</span><candor-progress indeterminate label="Loading results"></candor-progress></candor-card>
    </div>
  `,
};

export const AllSpinnerSizes: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 120px), 1fr));gap:var(--spacing-sm);">
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
