import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { TextComponent } from '../typography/text/text.component';

const meta: Meta<ButtonComponent> = {
  title: 'Angular Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The primary interactive element. Five visual variants cover the full hierarchy of actions on a page.

| Variant | Use case |
|---|---|
| \`primary\` | The single most important action — one per view |
| \`secondary\` | Supporting action of similar weight to primary |
| \`tertiary\` | Low-emphasis action; neutral fill, no border |
| \`ghost\` | Lowest-emphasis; text-only, no fill or border |
| \`destructive\` | Irreversible actions — delete, revoke, purge |

**One primary per view.** Multiple primary buttons compete for attention and dilute the affordance.
If a form has two equally important actions, one should be \`secondary\`.

**Destructive is outlined, not filled.** The crimson color (hue=347) signals caution without the
aggression of a filled red button, and is visually distinct from error orange-red (hue=25).
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'destructive'],
      description: 'Button visual style. primary/secondary/tertiary/ghost follow a loudness hierarchy. destructive (crimson burgundy, hue=347) signals irreversible actions — distinct from error (hue=25 orange-red).',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button HTML type',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Default: Story = {
  args: { variant: 'primary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Save changes</app-button>`,
  }),
};

export const Primary: Story = {
  args: { variant: 'primary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Save changes</app-button>`,
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Export</app-button>`,
  }),
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Learn more</app-button>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Cancel</app-button>`,
  }),
};

export const Destructive: Story = {
  args: { variant: 'destructive', size: 'medium', disabled: false },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [disabled]="disabled">Delete</app-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary">Save changes</app-button>
        <app-button variant="secondary">Export</app-button>
        <app-button variant="tertiary">Learn more</app-button>
        <app-button variant="ghost">Cancel</app-button>
        <app-button variant="destructive">Delete</app-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary" size="small">Small</app-button>
        <app-button variant="primary" size="medium">Medium</app-button>
        <app-button variant="primary" size="large">Large</app-button>
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <app-button variant="primary" [disabled]="true">Save changes</app-button>
        <app-button variant="secondary" [disabled]="true">Export</app-button>
        <app-button variant="tertiary" [disabled]="true">Learn more</app-button>
        <app-button variant="ghost" [disabled]="true">Cancel</app-button>
        <app-button variant="destructive" [disabled]="true">Delete</app-button>
      </div>
    `,
  }),
};

export const DestructiveInContext: Story = {
  decorators: [moduleMetadata({ imports: [TextComponent] })],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Paired with primary — typical confirm/cancel/delete layout</app-text>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <app-button variant="primary">Save changes</app-button>
            <app-button variant="ghost">Cancel</app-button>
            <app-button variant="destructive">Delete</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">With error state nearby — hue separation from hue=25 error</app-text>
          <p style="color: var(--color-status-error-text); font-family: var(--font-family-accessible); font-size: var(--font-size-sm); margin-bottom: var(--spacing-sm);">⚠ This action cannot be undone. 3 records will be permanently deleted.</p>
          <div style="display: flex; gap: 1rem;">
            <app-button variant="ghost">Cancel</app-button>
            <app-button variant="destructive">Delete permanently</app-button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const UtilityClasses: Story = {
  name: 'Utility Classes (.btn)',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle);">
          Plain CSS classes for native &lt;button&gt; and &lt;a&gt; elements. Combine a variant class with an optional size modifier.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-tertiary">Tertiary</button>
          <button class="btn btn-ghost">Ghost</button>
          <button class="btn btn-destructive">Destructive</button>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <button class="btn btn-primary btn-sm">Small primary</button>
          <button class="btn btn-primary">Medium primary</button>
          <button class="btn btn-primary btn-lg">Large primary</button>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <button class="btn btn-secondary btn-sm">Small secondary</button>
          <button class="btn btn-secondary">Medium secondary</button>
          <button class="btn btn-secondary btn-lg">Large secondary</button>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <button class="btn btn-primary btn-sm" disabled>Disabled</button>
          <a href="#" class="btn btn-secondary">Link button</a>
        </div>
      </div>
    `,
  }),
};

export const FullMatrix: Story = {
  decorators: [moduleMetadata({ imports: [TextComponent] })],
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Primary</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="primary" size="small">Small</app-button>
            <app-button variant="primary" size="medium">Medium</app-button>
            <app-button variant="primary" size="large">Large</app-button>
            <app-button variant="primary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Secondary</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="secondary" size="small">Small</app-button>
            <app-button variant="secondary" size="medium">Medium</app-button>
            <app-button variant="secondary" size="large">Large</app-button>
            <app-button variant="secondary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Tertiary</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="tertiary" size="small">Small</app-button>
            <app-button variant="tertiary" size="medium">Medium</app-button>
            <app-button variant="tertiary" size="large">Large</app-button>
            <app-button variant="tertiary" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Ghost</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="ghost" size="small">Small</app-button>
            <app-button variant="ghost" size="medium">Medium</app-button>
            <app-button variant="ghost" size="large">Large</app-button>
            <app-button variant="ghost" [disabled]="true">Disabled</app-button>
          </div>
        </div>
        <div>
          <app-text variant="label" size="sm" color="secondary" style="display: block; margin-bottom: var(--spacing-sm);">Destructive — not a hierarchy tier; applies to any CTA that performs an irreversible action</app-text>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <app-button variant="destructive" size="small">Small</app-button>
            <app-button variant="destructive" size="medium">Medium</app-button>
            <app-button variant="destructive" size="large">Large</app-button>
            <app-button variant="destructive" [disabled]="true">Disabled</app-button>
          </div>
        </div>
      </div>
    `,
  }),
};
