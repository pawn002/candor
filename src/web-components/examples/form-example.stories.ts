import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import '../components/alert/candor-alert';
import '../components/button/candor-button';
import '../components/form/checkbox/candor-checkbox';
import '../components/form/input/candor-input';
import '../components/form/radio/candor-radio';
import '../components/form/select/candor-select';
import '../components/form/switch/candor-switch';
import '../components/progress/candor-progress';
import '../components/typography/heading/candor-heading';
import '../components/typography/text/candor-text';

const DEPT_OPTIONS = JSON.stringify([
  { value: 'support', label: 'Customer support' },
  { value: 'sales', label: 'Sales' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical help' },
  { value: 'other', label: 'Other' },
]);

const COUNTRY_OPTIONS = JSON.stringify([
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'other', label: 'Other' },
]);

const meta: Meta = {
  title: 'Examples/Form Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Form composition examples using \`<candor-input>\`, \`<candor-checkbox>\`,
\`<candor-radio>\`, \`<candor-select>\`, \`<candor-switch>\`, \`<candor-alert>\`,
\`<candor-progress>\`, \`<candor-heading>\`, \`<candor-text>\`, and \`<candor-button>\`.

Demonstrates the canonical patterns for accessible forms in Candor:
- Every field must have a visible **label** — never rely on placeholder text alone
- **Radio groups** must be wrapped in \`<fieldset>\`/\`<legend>\` so screen readers
  announce the group question before each option
- **Switch** is for settings that take immediate effect; **Checkbox** is for values
  submitted with the form
- **Alert** (not Toast) communicates persistent form-level errors — it stays visible
  until the user corrects the problem
- **Progress** tracks multi-step form completion when steps cannot fit on one screen

All form-control web components are form-associated (\`ElementInternals\`), so wrapping
them in a \`<form>\` makes their values appear in \`FormData\` natively.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ContactForm: Story = {
  render: () => html`
    <main style="max-width: 500px; margin: 0 auto; padding: var(--spacing-lg);">
      <candor-heading level="h2">Contact Us</candor-heading>
      <candor-text variant="body" style="display: block; margin-bottom: var(--spacing-md);">
        Fill out the form below and we'll get back to you soon.
      </candor-text>

      <form style="display: flex; flex-direction: column; gap: var(--spacing-md);">
        <candor-input label="Full Name" placeholder="Enter your full name" required></candor-input>
        <candor-input label="Email Address" type="email" placeholder="you@example.com" required></candor-input>
        <candor-input label="Phone Number" type="tel" placeholder="(555) 123-4567"></candor-input>

        <candor-select label="Department" placeholder="Select a department" required options='${DEPT_OPTIONS}'></candor-select>

        <candor-input label="Subject" placeholder="How can we help?" required></candor-input>

        <candor-input label="Message" multiline rows="5" placeholder="Tell us more about your inquiry..."></candor-input>

        <candor-checkbox label="I agree to the terms and conditions" required></candor-checkbox>
        <candor-checkbox label="Send me updates and newsletters"></candor-checkbox>

        <div style="display: flex; gap: var(--spacing-sm);">
          <candor-button variant="primary" size="medium">Submit</candor-button>
          <candor-button variant="ghost" size="medium">Cancel</candor-button>
        </div>
      </form>
    </main>
  `,
};

export const LoginForm: Story = {
  render: () => html`
    <main style="padding: clamp(0.5rem, 4vw, 2rem);">
      <div style="max-width: 400px; margin: 0 auto; padding: var(--spacing-lg); border: 1px solid var(--color-border-default); border-radius: var(--radius-md);">
        <candor-heading level="h2" style="text-align: center; margin-bottom: var(--spacing-xs);">
          Sign In
        </candor-heading>
        <candor-text variant="body" style="display: block; text-align: center; margin-bottom: var(--spacing-lg); color: var(--color-text-subtle);">
          Enter your credentials to access your account
        </candor-text>

        <form style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <candor-input label="Email" type="email" placeholder="you@example.com" required></candor-input>
          <candor-input label="Password" type="password" placeholder="Enter your password" required></candor-input>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-xs);">
            <candor-checkbox label="Remember me"></candor-checkbox>
            <a href="#" style="color: var(--color-action-primary); text-decoration: none; font-size: var(--font-size-sm); white-space: nowrap;">
              Forgot password?
            </a>
          </div>

          <candor-button variant="primary" size="medium" style="width: 100%;">Sign In</candor-button>

          <candor-text variant="body" style="text-align: center;">
            Don't have an account?
            <a href="#" style="color: var(--color-link);">Sign up</a>
          </candor-text>
        </form>
      </div>
    </main>
  `,
};

export const RegistrationForm: Story = {
  render: () => html`
      <style>
        .reg-actions { flex-direction: row; }
        @media (max-width: 480px) {
          .reg-actions { flex-direction: column; }
        }
      </style>
      <main style="max-width: 600px; margin: 0 auto; padding: clamp(0.5rem, 4vw, 2rem);">
        <candor-heading level="h1" style="margin-bottom: var(--spacing-xs);">
          Create Account
        </candor-heading>
        <candor-text variant="body" style="display: block; margin-bottom: var(--spacing-lg); color: var(--color-text-subtle);">
          Join us today and start exploring
        </candor-text>

        <form style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: var(--spacing-sm);">
            <candor-input label="First Name" placeholder="John" required></candor-input>
            <candor-input label="Last Name" placeholder="Doe" required></candor-input>
          </div>

          <candor-input label="Email Address" type="email" placeholder="john.doe@example.com" required></candor-input>
          <candor-input label="Username" placeholder="Choose a username" required></candor-input>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: var(--spacing-sm);">
            <candor-input label="Password" type="password" placeholder="At least 8 characters" required></candor-input>
            <candor-input label="Confirm Password" type="password" placeholder="Re-enter password" required></candor-input>
          </div>

          <candor-select label="Country" placeholder="Select your country" required options='${COUNTRY_OPTIONS}'></candor-select>

          <fieldset style="border: none; padding: 0; margin: 0;">
            <legend style="font-family: var(--font-family-accessible); font-weight: var(--font-weight-bold); letter-spacing: 0.02em; color: var(--color-text-default); margin-bottom: 0.75rem;">Account Type</legend>
            <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
              <candor-radio label="Personal Account" name="accountType" value="personal" checked></candor-radio>
              <candor-radio label="Business Account" name="accountType" value="business"></candor-radio>
            </div>
          </fieldset>

          <candor-checkbox label="I agree to the Terms of Service and Privacy Policy" required></candor-checkbox>

          <div class="reg-actions" style="display: flex; gap: var(--spacing-sm);">
            <candor-button variant="primary" size="medium">Create Account</candor-button>
            <candor-button variant="secondary" size="medium">Back</candor-button>
          </div>

          <candor-text variant="body" style="text-align: center;">
            Already have an account?
            <a href="#" style="color: var(--color-link);">Sign in</a>
          </candor-text>
        </form>
      </main>
  `,
};

export const FormWithValidationAlert: Story = {
  render: () => html`
      <style>
        .alert-actions { flex-direction: row; }
        @media (max-width: 480px) {
          .alert-actions { flex-direction: column; }
        }
      </style>
      <main style="max-width: 500px; padding: clamp(0.5rem, 4vw, 2rem);">
        <candor-heading level="h2" style="margin-bottom: var(--spacing-md);">Reset Password</candor-heading>

        <form style="display: flex; flex-direction: column; gap: 1.25rem;" novalidate>
          <candor-alert
            variant="error"
            heading="Passwords do not match"
            message="Please ensure both password fields contain the same value."
          ></candor-alert>

          <candor-input
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            required
            error="Password must be at least 8 characters">
          </candor-input>

          <candor-input
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your password"
            required>
          </candor-input>

          <div class="alert-actions" style="display: flex; gap: var(--spacing-sm);">
            <candor-button variant="primary" size="medium">Update password</candor-button>
            <candor-button variant="ghost" size="medium">Cancel</candor-button>
          </div>
        </form>
      </main>
  `,
};

export const NotificationPreferences: Story = {
  render: () => html`
    <main style="max-width: 480px; padding: var(--spacing-lg);">
      <candor-heading level="h2" style="margin-bottom: var(--spacing-xs);">Notification preferences</candor-heading>
      <candor-text variant="body" style="display: block; margin-bottom: var(--spacing-lg); color: var(--color-text-subtle);">
        Choose how and when we contact you.
      </candor-text>

      <candor-alert
        variant="success"
        message="Your preferences have been saved."
        style="display: block; margin-bottom: var(--spacing-md);">
      </candor-alert>

      <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md); margin-bottom: var(--spacing-md);">
        <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Email</legend>
        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
          <candor-switch label="Security alerts" checked></candor-switch>
          <candor-switch label="Account activity" checked></candor-switch>
          <candor-switch label="Product updates"></candor-switch>
          <candor-switch label="Marketing and promotions"></candor-switch>
        </div>
      </fieldset>

      <fieldset style="border: 1px solid var(--color-border-default); border-radius: var(--radius-md); padding: var(--spacing-md); margin-bottom: var(--spacing-md);">
        <legend style="font-family: var(--font-family-accessible); font-size: var(--font-size-sm); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; color: var(--color-text-subtle); padding: 0 0.5rem;">Push notifications</legend>
        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: var(--spacing-xs);">
          <candor-switch label="New messages" checked></candor-switch>
          <candor-switch label="Mentions" checked></candor-switch>
          <candor-switch label="Reminders" disabled hint="Requires push to be enabled on your device"></candor-switch>
        </div>
      </fieldset>

      <candor-button variant="primary" size="medium">Save preferences</candor-button>
    </main>
  `,
};

export const FileUpload: Story = {
  render: () => html`
    <main style="max-width: 500px; padding: var(--spacing-lg);">
      <candor-heading level="h2" style="margin-bottom: var(--spacing-xs);">Upload files</candor-heading>
      <candor-text variant="body" style="display: block; margin-bottom: var(--spacing-lg); color: var(--color-text-subtle);">
        3 files queued — uploading 1 of 3.
      </candor-text>

      <div style="display: flex; flex-direction: column; gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">

        <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <candor-text variant="caption">quarterly-report.pdf</candor-text>
            <candor-text variant="caption" style="color: var(--color-status-success-text); font-weight: var(--font-weight-semibold);">Done</candor-text>
          </div>
          <candor-progress type="bar" value="100" aria-label="quarterly-report.pdf"></candor-progress>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <candor-text variant="caption">presentation-slides.pptx</candor-text>
            <candor-text variant="caption" style="color: var(--color-text-subtle);">65%</candor-text>
          </div>
          <candor-progress type="bar" value="65" aria-label="presentation-slides.pptx"></candor-progress>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <candor-text variant="caption">data-export.csv</candor-text>
            <candor-text variant="caption" style="color: var(--color-text-subtle);">Waiting...</candor-text>
          </div>
          <candor-progress type="bar" value="0" aria-label="data-export.csv"></candor-progress>
        </div>

      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <candor-progress type="spinner" size="sm" label="Uploading"></candor-progress>
        <candor-text variant="body" style="color: var(--color-text-subtle);">Uploading presentation-slides.pptx...</candor-text>
        <candor-button variant="ghost" size="small" aria-label="Cancel upload">Cancel</candor-button>
      </div>
    </main>
  `,
};
