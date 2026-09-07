import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../card/candor-card';
import './candor-select';

const FREQUENCY_OPTIONS = JSON.stringify([
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]);

const meta: Meta = {
  title: 'Components/Form/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-select>\` — dropdown built on a native \`<select>\` element. The open-picker UI is
intentionally OS-controlled: on mobile, that means the platform's drum picker (iOS) or
bottom-sheet (Android), which are optimised for touch and deeply familiar to users. On
desktop, the browser's built-in picker handles keyboard navigation, type-ahead, and
accessibility tree integration automatically. Browser autofill also works because engines
recognise \`<select name="…">\` semantically.

The deliberate trade-off: Candor styles the *closed* state fully; the *open* state belongs
to the OS. Reach for \`candor-listbox\` when you need a fully Candor-styled open picker —
checkmark indicator, custom option layout, consistent visual language throughout. The cost
is a hand-rolled keyboard handler and no OS picker on mobile.

**Which picker to use**

| Component | When |
|---|---|
| \`candor-select\` | Short, stable option lists (≤ 15 items); mobile contexts where the OS picker is preferable; plain-text options with no custom rendering needed |
| \`candor-listbox\` | Same length lists needing full visual coherence — Candor-styled open state, checkmark indicator, or non-text option content |
| \`candor-combobox\` | Long or dynamic lists (16+ options) where users must search rather than scan |

Accepts an array of \`{ value, label }\` option objects via the \`options\` JS property (or
JSON-encoded as an attribute in static markup). Pass a \`placeholder\` string to show a
"choose one" prompt as the first option (not pre-selected).

Form-associated (\`ElementInternals\`): the selected value participates in form submission.
Emits a \`change\` CustomEvent.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Field label' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Placeholder shown when no value is selected' },
    hint: { control: 'text', type: { name: 'string' }, description: 'Helper text above the field (below the label); remains visible alongside error' },
    error: { control: 'text', type: { name: 'string' }, description: 'Validation error message shown below the field; displayed alongside hint when both are set' },
    required: { control: 'boolean', type: { name: 'boolean' }, description: 'Required field' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<candor-select label="Email digest" placeholder="Choose frequency" hint="Sent to the address on your account." options='${FREQUENCY_OPTIONS}'></candor-select>`,
};

export const WithError: Story = {
  render: () => html`<candor-select label="Email digest" placeholder="Choose frequency" hint="Sent to the address on your account." error="Please choose a frequency." options='${FREQUENCY_OPTIONS}'></candor-select>`,
};

export const Required: Story = {
  render: () => html`<candor-select label="Email digest" placeholder="Choose frequency" hint="Sent to the address on your account." required options='${FREQUENCY_OPTIONS}'></candor-select>`,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: '**Candor pattern: disabled fields must have a hint.** A disabled control with no ' +
          'explanation reads as broken. The hint is the only channel for telling the user ' +
          'whether the lock is a permission boundary, a system constraint, or a state they ' +
          'can change elsewhere. The one exception: when the reason is unambiguously obvious ' +
          'from immediate visual context (e.g. a field grayed out beneath an off toggle it ' +
          'directly depends on).',
      },
    },
  },
  render: () => html`<candor-select label="Email digest" value="weekly" hint="Managed by your organisation. Contact your administrator to change." disabled options='${FREQUENCY_OPTIONS}'></candor-select>`,
};

export const WithDisabledOption: Story = {
  render: () => html`<candor-select label="Priority" placeholder="Select priority" hint="Critical is currently unavailable" options='[{"value":"low","label":"Low"},{"value":"medium","label":"Medium"},{"value":"high","label":"High"},{"value":"critical","label":"Critical","disabled":true}]'></candor-select>`,
};

export const NoLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When no visible label is present, set `aria-label` on the host element. ' +
          'The component strips it from the host and forwards it to the inner `<select>`, ' +
          'preventing the host from being named twice in the accessibility tree.',
      },
    },
  },
  render: () => html`<candor-select aria-label="Email digest" placeholder="Choose frequency" options='${FREQUENCY_OPTIONS}'></candor-select>`,
};

export const AllStates: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:420px;">
      <candor-card>
        <span slot="header">Default</span>
        <candor-select label="Email digest" placeholder="Choose frequency" hint="Sent to the address on your account." options='${FREQUENCY_OPTIONS}'></candor-select>
      </candor-card>
      <candor-card>
        <span slot="header">With error</span>
        <candor-select label="Email digest" placeholder="Choose frequency" hint="Sent to the address on your account." error="Please choose a frequency." options='${FREQUENCY_OPTIONS}'></candor-select>
      </candor-card>
      <candor-card>
        <span slot="header">Required</span>
        <candor-select label="Email digest" placeholder="Choose frequency" hint="Sent to the address on your account." required options='${FREQUENCY_OPTIONS}'></candor-select>
      </candor-card>
      <candor-card>
        <span slot="header">Disabled</span>
        <candor-select label="Email digest" value="weekly" hint="Managed by your organisation. Contact your administrator to change." disabled options='${FREQUENCY_OPTIONS}'></candor-select>
      </candor-card>
    </div>
  `,
};
