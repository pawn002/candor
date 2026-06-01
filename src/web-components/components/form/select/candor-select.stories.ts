import type { Meta, StoryObj } from '@storybook/angular';

const COUNTRY_OPTIONS = JSON.stringify([
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
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
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" hint="Select your country of residence" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const WithError: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" error="Please select a country" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const Required: Story = {
  render: () => ({
    template: `<candor-select label="Country" placeholder="Select a country" required options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<candor-select label="Country" value="us" disabled options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const WithDisabledOption: Story = {
  render: () => ({
    template: `<candor-select label="Priority" placeholder="Select priority" hint="Critical is currently unavailable" options='[{"value":"low","label":"Low"},{"value":"medium","label":"Medium"},{"value":"high","label":"High"},{"value":"critical","label":"Critical","disabled":true}]'></candor-select>`,
  }),
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
  render: () => ({
    template: `<candor-select aria-label="Country" placeholder="Select an option" options='${COUNTRY_OPTIONS}'></candor-select>`,
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:420px;">
        <candor-select label="Default" placeholder="Select a country" hint="Select your country of residence" options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="With error" placeholder="Select a country" error="Please select a country" options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="Required" placeholder="Select a country" required options='${COUNTRY_OPTIONS}'></candor-select>
        <candor-select label="Disabled" value="us" disabled options='${COUNTRY_OPTIONS}'></candor-select>
      </div>
    `,
  }),
};
