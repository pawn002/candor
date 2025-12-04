import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Components/Form/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
  },
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    hint: 'We will never share your email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    error: 'This email is already taken',
  },
};

export const Required: Story = {
  args: {
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    type: 'text',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    hint: 'Must be at least 8 characters',
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 400px;">
        <app-input label="Default" type="text" placeholder="Enter text"></app-input>
        <app-input label="With hint" type="text" hint="This is a helpful hint"></app-input>
        <app-input label="Required field" type="text" [required]="true"></app-input>
        <app-input label="With error" type="text" error="This field is required"></app-input>
        <app-input label="Disabled" type="text" placeholder="Cannot edit" [disabled]="true"></app-input>
      </div>
    `,
  }),
};
