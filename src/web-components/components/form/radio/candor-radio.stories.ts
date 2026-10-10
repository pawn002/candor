import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './candor-radio';
import '../../button/candor-button';

const meta: Meta = {
  title: 'Components/Form/Radio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-radio>\` — single-select option within a mutually exclusive group. Radios work in
groups — a standalone radio button is almost always a mistake; use a checkbox instead.

**Always wrap radio groups in a \`<fieldset>\` with a \`<legend>\`.** The legend is announced
before each option by screen readers, providing the question context. Without it, a user
hears "Yes" with no frame of reference for what the question was.

\`\`\`html
<fieldset>
  <legend>Preferred contact method</legend>
  <candor-radio name="contact" value="email" label="Email"></candor-radio>
  <candor-radio name="contact" value="phone" label="Phone"></candor-radio>
</fieldset>
\`\`\`

Form-associated (\`ElementInternals\`): the selected value appears in \`FormData\` keyed by
\`name\` when wrapped in a \`<form>\`.

**Secondary content goes in \`slot="end"\`, not the default slot.** The default slot renders
inside the option's \`<label>\`, so anything in it becomes part of the option's accessible
name — a help button there is announced as part of the option ("OKCA About OKCA, radio
button") and makes the label invalid HTML. \`slot="end"\` renders beside the label instead;
see *With Adjacent Help*. The same two slots exist on \`candor-checkbox\` and \`candor-switch\`.

**Events.** \`change\` fires on the newly selected radio, carrying its \`value\` as a
\`string\` in \`detail\`. There is no live \`input\` event — a radio has no mid-edit phase.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Radio button label' },
    value: { control: 'text', type: { name: 'string' }, description: 'Value submitted with the form' },
    name: { control: 'text', type: { name: 'string' }, description: 'Radio group name' },
    checked: { control: 'boolean', type: { name: 'boolean' }, description: 'Checked state (for static/story use)' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
  },
  args: { label: 'Option A', value: 'a', checked: false, disabled: false },
  render: (args) => html`<candor-radio label="${args['label']}" value="${args['value']}" ?checked=${args['checked']} ?disabled=${args['disabled']}></candor-radio>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Selected: Story = { args: { label: 'Option 1', value: 'option1', checked: true } };
export const Disabled: Story = { args: { label: 'Cannot select', value: 'disabled', disabled: true } };

export const MultipleGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;gap:var(--spacing-xl);">
      <fieldset style="border:none;padding:0;margin:0;">
        <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);color:var(--color-text-default);letter-spacing:var(--letter-spacing-relaxed);margin:0 0 var(--spacing-xs) 0;">Size</legend>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <candor-radio label="Small" value="small" name="size" checked></candor-radio>
          <candor-radio label="Medium" value="medium" name="size"></candor-radio>
          <candor-radio label="Large" value="large" name="size"></candor-radio>
        </div>
      </fieldset>
      <fieldset style="border:none;padding:0;margin:0;">
        <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);color:var(--color-text-default);letter-spacing:var(--letter-spacing-relaxed);margin:0 0 var(--spacing-xs) 0;">Color</legend>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <candor-radio label="Red" value="red" name="color"></candor-radio>
          <candor-radio label="Blue" value="blue" name="color" checked></candor-radio>
          <candor-radio label="Green" value="green" name="color"></candor-radio>
        </div>
      </fieldset>
    </div>
  `,
};

export const Group: Story = {
  render: () => html`
    <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--spacing-xs);">
      <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);letter-spacing:var(--letter-spacing-relaxed);margin-bottom:var(--spacing-xs);">Preferred contact method</legend>
      <candor-radio label="Email" value="email" name="contact" checked></candor-radio>
      <candor-radio label="Phone" value="phone" name="contact"></candor-radio>
      <candor-radio label="Post" value="post" name="contact" disabled></candor-radio>
    </fieldset>
  `,
};

/**
 * A help control beside each option (#263). The button sits in `slot="end"`,
 * outside the option's `<label>`, so each radio is named by its label alone —
 * "OKCA, radio button, 2 of 3" — and the button is a separate stop. Arrow keys
 * still move between the options; Tab moves from the group's one tab stop to
 * that option's button.
 */
export const WithAdjacentHelp: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <fieldset style="border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--spacing-xs);">
      <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);letter-spacing:var(--letter-spacing-relaxed);margin-bottom:var(--spacing-xs);">Contrast algorithm</legend>
      <candor-radio label="WCAG 2.1" value="wcag21" name="algorithm-help" checked>
        <candor-button slot="end" variant="ghost" size="small">About WCAG 2.1</candor-button>
      </candor-radio>
      <candor-radio label="OKCA" value="okca" name="algorithm-help">
        <candor-button slot="end" variant="ghost" size="small">About OKCA</candor-button>
      </candor-radio>
      <candor-radio label="Delta E" value="deltae" name="algorithm-help">
        <candor-button slot="end" variant="ghost" size="small">About Delta E</candor-button>
      </candor-radio>
    </fieldset>
  `,
};
