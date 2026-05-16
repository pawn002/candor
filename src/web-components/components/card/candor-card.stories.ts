import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-card>\` — versatile surface container. Three variants cover the standard layering
hierarchy: \`default\` (surface), \`elevated\` (floats above surface), \`outlined\` (page
background with border).

**Light-mode surface layering**

In light mode \`--color-bg-page\` and \`--color-bg-elevated\` are both near-white. Colour
alone cannot create visible depth — the \`elevated\` variant relies on \`box-shadow\` for
its lift signal. If you are building a card-on-card layout, the inner card should be
\`outlined\` or \`default\` (surface tint) rather than another \`elevated\`.

**Three named slots**

\`\`\`html
<candor-card>
  <span slot="header">Account summary</span>
  <p>Body content goes here.</p>
  <span slot="footer">Last updated 3 minutes ago</span>
</candor-card>
\`\`\`

Empty header and footer slots collapse — no leftover border or padding when unused.
        `.trim(),
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined'],
      type: { name: 'string' },
      description: 'Surface treatment',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      type: { name: 'string' },
      description: 'Interior padding (applies to all three slots)',
    },
  },
  args: { variant: 'default', padding: 'md' },
  render: (args) => ({
    template: `
      <candor-card variant="${args['variant']}" padding="${args['padding']}">
        <span slot="header">Card Header</span>
        <p style="margin:0">Card body content goes here.</p>
        <span slot="footer">Card Footer</span>
      </candor-card>
    `,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Elevated: Story = {
  args: { variant: 'elevated', padding: 'md' },
  render: () => ({
    template: `<candor-card variant="elevated" padding="md"><p style="margin:0">This is an elevated card with a shadow to create visual hierarchy.</p></candor-card>`,
  }),
};

export const Outlined: Story = {
  args: { variant: 'outlined', padding: 'md' },
  render: () => ({
    template: `<candor-card variant="outlined" padding="md"><p style="margin:0">This is an outlined card with a border for subtle separation.</p></candor-card>`,
  }),
};

export const WithHeaderAndFooter: Story = {
  render: () => ({
    template: `
      <candor-card variant="outlined" padding="md">
        <div slot="header">Card Header</div>
        <p style="margin:0">Card body content goes here. This card has both a header and footer slot populated.</p>
        <div slot="footer">Card Footer — Additional info or actions</div>
      </candor-card>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:1rem;">
        <candor-card variant="default">
          <span slot="header">Default</span>
          <p style="margin:0">Surface background with no shadow.</p>
        </candor-card>
        <candor-card variant="elevated">
          <span slot="header">Elevated</span>
          <p style="margin:0">White background with shadow elevation.</p>
        </candor-card>
        <candor-card variant="outlined">
          <span slot="header">Outlined</span>
          <p style="margin:0">Page background with explicit border.</p>
        </candor-card>
      </div>
    `,
  }),
};

export const CardGrid: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:48rem;">
        <candor-card variant="default" padding="md">
          <div slot="header">Default</div>
          <p style="margin:0">Surface background, no border, no shadow.</p>
        </candor-card>
        <candor-card variant="elevated" padding="md">
          <div slot="header">Elevated</div>
          <p style="margin:0">Lightness-elevated background with shadow.</p>
        </candor-card>
        <candor-card variant="outlined" padding="md">
          <div slot="header">Outlined</div>
          <p style="margin:0">Page background with a thin border.</p>
        </candor-card>
        <candor-card variant="elevated" padding="lg">
          <div slot="header">Elevated — Large Padding</div>
          <p style="margin:0">Same elevated style with larger internal spacing.</p>
          <div slot="footer">Footer content</div>
        </candor-card>
      </div>
    `,
  }),
};
