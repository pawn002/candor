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

// The fieldset is a two-column grid and each radio a subgrid row spanning it,
// so every label shares the first column and every info button the second —
// the buttons line up however long the labels are. This reaches inside the
// radio from outside: its `<label>` and `end` slot are its direct children in
// the flattened tree, so they become the subgrid's two cells.
const HELP_GROUP_STYLE = [
  'border:none', 'padding:0', 'margin:0',
  'display:grid', 'grid-template-columns:max-content max-content',
  'column-gap:var(--spacing-sm)', 'row-gap:var(--spacing-xs)', 'align-items:center',
].join(';');
const HELP_ROW_STYLE = 'grid-column:1 / -1;display:grid;grid-template-columns:subgrid;';

// The icon-only button pattern from Design Tokens/Icons (Pattern B): the name
// is `aria-label` on the host, so a screen reader hears the full "About OKCA" —
// a name that has to stand alone, since it is a separate stop — and the glyph
// is aria-hidden. Fill weight, because the icon is the button's only content
// and the button is an action (#296 questions whether fill is too heavy here).
// 1.5rem rather than the pattern's 1.25rem: Phosphor's info disc fills only
// about 80% of its em box, and the "i" inside it needs the extra size to read.
// Padding-x is pulled to the small size's padding-y so the button is square.
const infoButton = (topic: string) => html`
  <candor-button slot="end" variant="ghost" size="small" aria-label="About ${topic}"
    style="--candor-button-padding-x:var(--spacing-button-padding-y-sm);">
    <i class="ph-fill ph-info" style="font-size:1.5rem;line-height:1;" aria-hidden="true"></i>
  </candor-button>
`;

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
    <fieldset style="${HELP_GROUP_STYLE}">
      <legend style="font-family:var(--font-family-accessible);font-weight:var(--font-weight-bold);font-size:var(--font-size-sm);letter-spacing:var(--letter-spacing-relaxed);margin-bottom:var(--spacing-xs);">Contrast algorithm</legend>
      <candor-radio label="WCAG 2.1" value="wcag21" name="algorithm-help" checked style="${HELP_ROW_STYLE}">
        ${infoButton('WCAG 2.1')}
      </candor-radio>
      <candor-radio label="OKCA" value="okca" name="algorithm-help" style="${HELP_ROW_STYLE}">
        ${infoButton('OKCA')}
      </candor-radio>
      <candor-radio label="Delta E" value="deltae" name="algorithm-help" style="${HELP_ROW_STYLE}">
        ${infoButton('Delta E')}
      </candor-radio>
    </fieldset>
  `,
};
