import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccessibleTextComponent } from './accessible-text.component';
import { TextComponent } from '../text/text.component';

const meta: Meta<AccessibleTextComponent> = {
  title: 'Typography/AccessibleText',
  component: AccessibleTextComponent,
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['label', 'message', 'status', 'annotation'],
      description: 'Functional role in the UI',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size override (applied after role defaults)',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled', 'error'],
      description: 'Text color (warning/success are non-text tokens — use *-bg panels instead)',
    },
    bold: {
      control: 'boolean',
      description: 'Bold weight override',
    },
  },
};

export default meta;
type Story = StoryObj<AccessibleTextComponent>;

export const Default: Story = {
  args: {
    role: 'label',
    size: 'md',
    color: 'primary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-accessible-text [role]="role" [size]="size" [color]="color" [bold]="bold">
      Accessible Text Playground
    </app-accessible-text>`,
  }),
};

export const StatusMessages: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Error: colored text OK (OKCA 4.8) -->
        <app-accessible-text role="status" color="error">✕ Error: This field is required.</app-accessible-text>

        <!-- Warning: use bg tint + dark text, not colored text -->
        <div style="background: var(--color-status-warning-bg); padding: 0.5rem 0.75rem; border-left: 3px solid var(--color-status-warning); border-radius: var(--radius-sm);">
          <app-accessible-text role="message">⚠ Warning: This action cannot be undone.</app-accessible-text>
        </div>

        <!-- Success: use bg tint + dark text, not colored text -->
        <div style="background: var(--color-status-success-bg); padding: 0.5rem 0.75rem; border-left: 3px solid var(--color-status-success); border-radius: var(--radius-sm);">
          <app-accessible-text role="message">✓ Success: Your changes have been saved.</app-accessible-text>
        </div>

        <app-accessible-text role="message" color="secondary">ℹ Your session will expire in 5 minutes.</app-accessible-text>
      </div>
    `,
  }),
};

export const FontComparison: Story = {
  decorators: [
    moduleMetadata({
      imports: [TextComponent],
    }),
  ],
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0;">Roboto Flex</p>
          <app-text variant="label" size="sm" [bold]="true">FORM LABEL</app-text>
          <app-text variant="body" size="md">The quick brown fox jumps over the lazy dog.</app-text>
          <app-text variant="caption" size="sm" color="secondary">Supplementary annotation for context.</app-text>
          <app-text variant="body" size="sm" color="secondary">Error: This field is required.</app-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0;">Atkinson Hyperlegible</p>
          <app-accessible-text role="label">FORM LABEL</app-accessible-text>
          <app-accessible-text role="message">The quick brown fox jumps over the lazy dog.</app-accessible-text>
          <app-accessible-text role="annotation" color="secondary">Supplementary annotation for context.</app-accessible-text>
          <app-accessible-text role="status" color="error">Error: This field is required.</app-accessible-text>
        </div>
      </div>
    `,
  }),
};

export const CriticalFormContext: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
          <app-accessible-text role="label" [bold]="true" id="ni-label">National Insurance number</app-accessible-text>
          <app-accessible-text role="annotation" color="secondary">It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'.</app-accessible-text>
          <input
            type="text"
            style="
              border: 2px solid var(--color-status-error);
              border-radius: var(--radius-sm);
              padding: 0.5rem 0.75rem;
              font-family: var(--font-family-base);
              font-size: var(--font-size-md);
              width: 100%;
              box-sizing: border-box;
            "
            value="QQ 00 00 00"
            aria-labelledby="ni-label"
            aria-describedby="ni-error"
          />
          <app-accessible-text role="status" color="error" id="ni-error">Enter a National Insurance number in the correct format.</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
          <app-accessible-text role="label" [bold]="true" id="email-label">Email address</app-accessible-text>
          <input
            type="email"
            style="
              border: 2px solid var(--color-border-strong);
              border-radius: var(--radius-sm);
              padding: 0.5rem 0.75rem;
              font-family: var(--font-family-base);
              font-size: var(--font-size-md);
              width: 100%;
              box-sizing: border-box;
            "
            value="user@example.com"
            aria-labelledby="email-label"
          />
          <div style="background: var(--color-status-success-bg); padding: 0.375rem 0.625rem; border-left: 3px solid var(--color-status-success); border-radius: var(--radius-sm); display: inline-block; margin-top: 0.25rem;">
            <app-accessible-text role="status">✓ Email verified</app-accessible-text>
          </div>
        </div>
      </div>
    `,
  }),
};

export const AllRoles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="label"</p>
          <app-accessible-text role="label">Section Title / Form Field Label</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="message"</p>
          <app-accessible-text role="message">System message: Your request has been received and is being processed. You will receive a confirmation email shortly.</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="status"</p>
          <app-accessible-text role="status" color="error">✕ Validation failed — 3 fields require attention</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="annotation"</p>
          <app-accessible-text role="annotation" color="secondary">This information is collected under the Data Protection Act 2018. Your data will not be shared with third parties without your consent.</app-accessible-text>
        </div>
      </div>
    `,
  }),
};
