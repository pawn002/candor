import { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { InputComponent } from "../components/form/input/input.component";
import { CheckboxComponent } from "../components/form/checkbox/checkbox.component";
import { ButtonComponent } from "../components/button/button.component";
import { HeadingComponent } from "../components/typography/heading/heading.component";
import { TextComponent } from "../components/typography/text/text.component";

const meta: Meta = {
  title: "Examples/Form Example",
  decorators: [
    moduleMetadata({
      imports: [
        InputComponent,
        CheckboxComponent,
        ButtonComponent,
        HeadingComponent,
        TextComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const ContactForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 500px; margin: 0 auto; padding: 2rem;">
        <app-heading [level]="2">Contact Us</app-heading>
        <app-text [variant]="'body'" style="display: block; margin-bottom: 1.5rem;">
          Fill out the form below and we'll get back to you soon.
        </app-text>

        <form style="display: flex; flex-direction: column; gap: 1.5rem;">
          <app-input
            [label]="'Full Name'"
            [placeholder]="'Enter your full name'"
            [required]="true">
          </app-input>

          <app-input
            [label]="'Email Address'"
            [type]="'email'"
            [placeholder]="'you@example.com'"
            [required]="true">
          </app-input>

          <app-input
            [label]="'Phone Number'"
            [type]="'tel'"
            [placeholder]="'(555) 123-4567'">
          </app-input>

          <app-input
            [label]="'Subject'"
            [placeholder]="'How can we help?'"
            [required]="true">
          </app-input>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Tell us more about your inquiry..."
              style="width: 100%; padding: 0.75rem; border: 2px solid var(--color-border, #ddd); border-radius: 4px; font-family: inherit;">
            </textarea>
          </div>

          <app-checkbox
            [label]="'I agree to the terms and conditions'"
            [required]="true">
          </app-checkbox>

          <app-checkbox
            [label]="'Send me updates and newsletters'">
          </app-checkbox>

          <div style="display: flex; gap: 1rem;">
            <app-button [variant]="'primary'" [size]="'medium'">
              Submit
            </app-button>
            <app-button [variant]="'ghost'" [size]="'medium'">
              Cancel
            </app-button>
          </div>
        </form>
      </div>
    `,
  }),
};

export const LoginForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px; margin: 0 auto; padding: 2rem; border: 1px solid var(--color-border, #ddd); border-radius: 8px;">
        <app-heading [level]="2" style="text-align: center; margin-bottom: 0.5rem;">
          Sign In
        </app-heading>
        <app-text [variant]="'body'" style="display: block; text-align: center; margin-bottom: 2rem; color: var(--color-text-secondary, #666);">
          Enter your credentials to access your account
        </app-text>

        <form style="display: flex; flex-direction: column; gap: 1.5rem;">
          <app-input
            [label]="'Email'"
            [type]="'email'"
            [placeholder]="'you@example.com'"
            [required]="true">
          </app-input>

          <app-input
            [label]="'Password'"
            [type]="'password'"
            [placeholder]="'Enter your password'"
            [required]="true">
          </app-input>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <app-checkbox [label]="'Remember me'"></app-checkbox>
            <a href="#" style="color: var(--color-primary); text-decoration: none; font-size: 0.875rem;">
              Forgot password?
            </a>
          </div>

          <app-button [variant]="'primary'" [size]="'medium'" style="width: 100%;">
            Sign In
          </app-button>

          <app-text [variant]="'body'" style="text-align: center;">
            Don't have an account?
            <a href="#" style="color: var(--color-primary); text-decoration: none;">
              Sign up
            </a>
          </app-text>
        </form>
      </div>
    `,
  }),
};

export const RegistrationForm: Story = {
  render: () => ({
    template: `
      <div style="max-width: 600px; margin: 0 auto; padding: 2rem;">
        <app-heading [level]="1" style="margin-bottom: 0.5rem;">
          Create Account
        </app-heading>
        <app-text [variant]="'body'" style="display: block; margin-bottom: 2rem; color: var(--color-text-secondary, #666);">
          Join us today and start exploring
        </app-text>

        <form style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <app-input
              [label]="'First Name'"
              [placeholder]="'John'"
              [required]="true">
            </app-input>

            <app-input
              [label]="'Last Name'"
              [placeholder]="'Doe'"
              [required]="true">
            </app-input>
          </div>

          <app-input
            [label]="'Email Address'"
            [type]="'email'"
            [placeholder]="'john.doe@example.com'"
            [required]="true">
          </app-input>

          <app-input
            [label]="'Username'"
            [placeholder]="'Choose a username'"
            [required]="true">
          </app-input>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <app-input
              [label]="'Password'"
              [type]="'password'"
              [placeholder]="'At least 8 characters'"
              [required]="true">
            </app-input>

            <app-input
              [label]="'Confirm Password'"
              [type]="'password'"
              [placeholder]="'Re-enter password'"
              [required]="true">
            </app-input>
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.75rem; font-weight: 500;">
              Account Type
            </label>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <app-checkbox
                [label]="'Personal Account'"
                [name]="'accountType'"
                [checked]="true">
              </app-checkbox>
              <app-checkbox
                [label]="'Business Account'"
                [name]="'accountType'">
              </app-checkbox>
            </div>
          </div>

          <app-checkbox
            [label]="'I agree to the Terms of Service and Privacy Policy'"
            [required]="true">
          </app-checkbox>

          <div style="display: flex; gap: 1rem;">
            <app-button [variant]="'primary'" [size]="'medium'">
              Create Account
            </app-button>
            <app-button [variant]="'secondary'" [size]="'medium'">
              Back
            </app-button>
          </div>

          <app-text [variant]="'body'" style="text-align: center;">
            Already have an account?
            <a href="#" style="color: var(--color-primary); text-decoration: none;">
              Sign in
            </a>
          </app-text>
        </form>
      </div>
    `,
  }),
};
