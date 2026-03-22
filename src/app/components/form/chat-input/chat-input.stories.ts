import type { Meta, StoryObj } from '@storybook/angular';
import { ChatInputComponent } from './chat-input.component';

const meta: Meta<ChatInputComponent> = {
  title: 'Form/ChatInput',
  component: ChatInputComponent,
  tags: ['autodocs'],
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
