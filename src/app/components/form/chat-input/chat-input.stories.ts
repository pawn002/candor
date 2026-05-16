import type { Meta, StoryObj } from '@storybook/angular';
import { ChatInputComponent } from './chat-input.component';

const meta: Meta<ChatInputComponent> = {
  title: 'Angular Components/Form/ChatInput',
  component: ChatInputComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Expanding text input with a send button, purpose-built for AI chat interfaces. Auto-grows
vertically as the user types; submits on Enter (Shift+Enter for newline).

The optional \`disclaimer\` prop renders a small footnote below the input — use it for
AI safety/quality notices ("AI responses may be inaccurate. Verify important information.").

**Accessible label is required.** The input has no visible label by default — pass \`label\`
(visually hidden) or the consuming component must supply one. Screen reader users need to
know what the input is for before they start typing.
        `.trim(),
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    label: { control: 'text' },
    disclaimer: { control: 'text' },
    disabled: { control: 'boolean' },
    send: { action: 'send' },
  },
};

export default meta;
type Story = StoryObj<ChatInputComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Message…',
    label: 'Message',
    disabled: false,
  },
  render: (args) => ({
    props: { ...args },
    template: `<div style="max-width: 640px; padding: 1.5rem;">
      <app-chat-input
        [placeholder]="placeholder"
        [label]="label"
        [disabled]="disabled"
        (send)="send($event)">
      </app-chat-input>
    </div>`,
  }),
};

export const WithDisclaimer: Story = {
  args: {
    placeholder: 'Ask about color, type, spacing…',
    label: 'Message Candor AI',
    disclaimer: 'Candor AI can make mistakes. Review important information.',
    disabled: false,
  },
  render: (args) => ({
    props: { ...args },
    template: `<div style="max-width: 640px; padding: 1.5rem;">
      <app-chat-input
        [placeholder]="placeholder"
        [label]="label"
        [disclaimer]="disclaimer"
        [disabled]="disabled"
        (send)="send($event)">
      </app-chat-input>
    </div>`,
  }),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Message…',
    label: 'Message',
    disabled: true,
  },
  render: (args) => ({
    props: { ...args },
    template: `<div style="max-width: 640px; padding: 1.5rem;">
      <app-chat-input
        [placeholder]="placeholder"
        [label]="label"
        [disabled]="disabled"
        (send)="send($event)">
      </app-chat-input>
    </div>`,
  }),
};
