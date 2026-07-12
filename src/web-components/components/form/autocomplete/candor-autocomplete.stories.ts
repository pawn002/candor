import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const MODELS = [
  'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1', 'o1-mini',
  'claude-opus-4', 'claude-sonnet-4', 'claude-haiku-4',
  'llama-3.3-70b', 'mistral-large', 'gemini-2.0-flash',
];

const meta: Meta = {
  title: 'Components/Form/Autocomplete',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-autocomplete>\` is a **free-text** field that offers non-binding suggestions
as the user types — the web-component analogue of a native \`<input list>\` + \`<datalist>\`.
The committed value is **always the raw text the user typed**; suggestions are hints, not
a constraint. There is deliberately no persistent dropdown caret: the control should read
as a text field that *offers help*, not a menu you must pick from.

**Which text control? — the value model is the deciding line**

| Component | Value model | Reach for it when |
|---|---|---|
| \`candor-input\` | Free text, no suggestions | Open input with no known value set — a person's name, a description, an arbitrary string. |
| \`candor-autocomplete\` | **Free text + non-binding suggestions** | Open input where a *known set is worth surfacing* but any value is valid — a model name discovered from a \`/v1\` endpoint, a tag, a city. The user may pick a suggestion or type something entirely new. |
| \`candor-combobox\` | **Constrained to an option set** | The value *must* be one of a fixed set; free text is invalid. Emits the chosen \`ComboboxOption\`, or \`null\` when cleared. |

The trap is reaching for \`candor-combobox\` when the field is really open-ended. If a user
could legitimately enter a value you didn't list, that field is an **autocomplete**, not a
combobox — a combobox would reject or silently drop their input.

**Events** follow the Candor two-event rule (see \`events.ts\` / #164): \`input\` streams the
live text on every keystroke; \`change\` fires the committed text on blur, on Enter, and when
a suggestion is chosen. Both carry a plain \`string\` — the same shape as \`candor-input\` —
because the value is always free text (unlike \`candor-combobox\`, whose \`change\` carries an option object).

**Styling hooks.** Override density without forking via custom properties —
\`--candor-autocomplete-{padding-x,padding-y,font-size,radius}\`, each defaulting to its token.
For arbitrary restyle, the internals expose \`::part(input)\`, \`::part(label)\`, \`::part(hint)\`,
and \`::part(error-message)\` — the same surface as \`candor-input\`. See the Introduction →
"Styling & overriding" section.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Field label (Atkinson, sentence case)' },
    value: { control: 'text', description: 'The free-text value — always what the user typed' },
    placeholder: { control: 'text' },
    hint: { control: 'text', description: 'Guidance shown below the label' },
    error: { control: 'text', description: 'Error message; sets aria-invalid' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxSuggestions: { control: 'number', description: 'Cap on visible suggestions (0 = no cap)' },
  },
  args: {
    label: 'Model',
    value: '',
    placeholder: 'e.g. gpt-4o',
    hint: 'Type any model your endpoint serves — suggestions are discovered names.',
    error: '',
    required: false,
    disabled: false,
    maxSuggestions: 8,
  },
  render: (args) => html`
    <div style="max-width:420px;padding:1.5rem;">
      <candor-autocomplete
        label="${args['label']}"
        value="${args['value']}"
        placeholder="${args['placeholder']}"
        hint="${args['hint']}"
        error="${args['error']}"
        ?required="${args['required']}"
        ?disabled="${args['disabled']}"
        .maxSuggestions="${args['maxSuggestions']}"
        .suggestions="${MODELS}"
      ></candor-autocomplete>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithSuggestions: Story = {
  name: 'Discovered suggestions (free text)',
  parameters: {
    docs: {
      description: {
        story: 'The canonical use case: a settings field where the user can type **any** model their `/v1` endpoint serves, with discovered names offered as non-binding suggestions. Focus the field to see all suggestions; type to filter. Nothing stops you entering a name that isn\'t listed.',
      },
    },
  },
  args: {
    value: 'gpt-4',
  },
};

export const NoMatchStillValid: Story = {
  name: 'Unlisted value is accepted',
  parameters: {
    docs: {
      description: {
        story: 'Typing a value that matches no suggestion is completely valid — the list simply hides. This is the behavioural line against `candor-combobox`, which would show "No results" and refuse the value.',
      },
    },
  },
  args: {
    value: 'my-local-finetune-v3',
    hint: 'Custom model IDs are fine — suggestions are optional.',
  },
};

export const Required: Story = {
  args: {
    required: true,
    hint: 'Required — pick a suggestion or enter your own model ID.',
  },
};

export const WithError: Story = {
  args: {
    value: 'gtp-4o',
    error: 'That model is not reachable on the configured endpoint.',
    hint: '',
  },
};

export const Disabled: Story = {
  args: {
    value: 'gpt-4o',
    disabled: true,
    hint: 'Locked to the workspace default. Change the endpoint in Settings → Providers to edit.',
  },
};

export const Overriding: Story = {
  name: 'Overriding styles (parts + custom properties)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same two opt-in hooks as `candor-input`. **Custom properties** (`--candor-autocomplete-{padding-x,padding-y,font-size,radius}`) are the blessed density/shape knobs, each defaulting to its token — here one field is made denser and squared-off. **`::part(input)`**, `::part(label)`, `::part(hint)`, and `::part(error-message)` are the escape hatch for arbitrary CSS the knobs do not cover (here the label is upper-cased and tracked).',
      },
    },
  },
  render: () => html`
    <style>
      .compact { --candor-autocomplete-padding-y: 0.25rem; --candor-autocomplete-padding-x: 0.5rem; --candor-autocomplete-radius: var(--radius-sm); }
      .tracked::part(label) { text-transform: uppercase; letter-spacing: 0.06em; }
    </style>
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:420px;padding:1.5rem;">
      <candor-autocomplete label="Default" placeholder="e.g. gpt-4o" .suggestions="${MODELS}"></candor-autocomplete>
      <candor-autocomplete class="compact" label="Denser via custom props" placeholder="Tighter padding, square corners" .suggestions="${MODELS}"></candor-autocomplete>
      <candor-autocomplete class="tracked" label="::part restyle" placeholder="Label upper-cased via ::part(label)" .suggestions="${MODELS}"></candor-autocomplete>
    </div>
  `,
};
