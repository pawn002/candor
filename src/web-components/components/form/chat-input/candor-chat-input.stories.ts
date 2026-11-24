import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../../typography/accessible-text/candor-accessible-text';
import './candor-chat-input';

const meta: Meta = {
  title: 'Components/Form/ChatInput',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-chat-input>\`: an expanding text input with a send button, purpose-built for AI chat
interfaces. Auto-grows vertically as the user types; submits on Enter (Shift+Enter for
newline).

The optional \`disclaimer\` attribute renders a small footnote below the input. Use it for
AI safety/quality notices ("AI responses may be inaccurate. Verify important information.").

**Name the composer.** It is named by \`label\`, which defaults to "Message" and is visually
hidden. Set it to something specific, or set \`aria-label\` on the host, which is forwarded to the
textarea. Screen reader users need to know
what the input is for before they start typing.

Emits a \`send\` CustomEvent with \`{ detail: { value } }\` on submission.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: { control: 'text', type: { name: 'string' }, description: 'Accessible label (visually hidden by default)' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Placeholder text' },
    disclaimer: { control: 'text', type: { name: 'string' }, description: 'Footnote text below the input' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Disabled state' },
  },
  args: {
    label: 'Message',
    placeholder: 'Type a message…',
    disclaimer: '',
    disabled: false,
  },
  render: (args) => html`<candor-chat-input
    label="${args['label']}"
    placeholder="${args['placeholder']}"
    disclaimer="${args['disclaimer'] || ''}"
    ?disabled=${args['disabled']}
  ></candor-chat-input>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithDisclaimer: Story = {
  args: { disclaimer: 'Responses are AI-generated and may be inaccurate.' },
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'A disabled composer needs a readable reason beside it. `disclaimer` is standing small print, not a status channel.',
      },
    },
  },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
      <candor-chat-input disabled></candor-chat-input>
      <candor-accessible-text role_="annotation" style="display:block;">Sending is paused while the previous response is generated.</candor-accessible-text>
    </div>
  `,
};
