import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-tabs>\` — tabbed interface for switching between related panel views. Implements
the [ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with keyboard
navigation: Arrow keys move between tabs, Home/End jump to first/last.

Each panel is a \`<candor-tab-panel>\` child with a \`panel-id\` matching one of the
\`tabs\` entries. The \`tabs\` array (\`[{ id, label }, ...]\`) drives the tab row; panels
are slotted in document order.

\`\`\`html
<candor-tabs aria-label="Account settings" active-id="profile"
             tabs='[{"id":"profile","label":"Profile"},{"id":"security","label":"Security"}]'>
  <candor-tab-panel panel-id="profile" active>...</candor-tab-panel>
  <candor-tab-panel panel-id="security">...</candor-tab-panel>
</candor-tabs>
\`\`\`

Set \`aria-label\` on the host element to label the tab list for screen readers — always
required. Two themes: \`default\` and \`inverse\`. Two orientations: \`horizontal\` (tabs above
panels) and \`vertical\` (tabs left, panels right). Emits a \`tab-change\` CustomEvent.

Horizontal tabs show fade-gradient affordances on the left/right edges when the tab row
overflows horizontally.
        `.trim(),
      },
    },
  },
  argTypes: {
    activeId: { control: 'text', type: { name: 'string' }, description: 'Currently selected tab id' },
    ariaLabel_: { control: 'text', type: { name: 'string' }, description: 'aria-label for the tablist' },
    theme: {
      control: 'select',
      options: ['default', 'inverse'],
      type: { name: 'string' },
      description: 'default renders on a light surface; inverse renders on --color-bg-inverse',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      type: { name: 'string' },
      description: 'horizontal: tabs above panels (default). vertical: tabs left, panels right.',
    },
  },
  render: () => ({
    template: `<candor-tabs
      active-id="overview"
      aria-label="Product details"
      tabs='[{"id":"overview","label":"Overview"},{"id":"specs","label":"Specifications"},{"id":"reviews","label":"Reviews"}]'>
      <candor-tab-panel panel-id="overview" active>
        <p style="margin:0">Overview content — rendered when the Overview tab is selected.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="specs">
        <p style="margin:0">Specifications content.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="reviews">
        <p style="margin:0">Customer reviews.</p>
      </candor-tab-panel>
    </candor-tabs>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Inverse: Story = {
  render: () => ({
    template: `<candor-tabs
      active-id="overview"
      aria-label="Section navigation"
      theme="inverse"
      tabs='[{"id":"overview","label":"Overview"},{"id":"details","label":"Details"},{"id":"history","label":"History"}]'>
      <candor-tab-panel panel-id="overview" active>
        <p style="margin:0;padding-top:var(--spacing-sm);">Inverse tabs sit on a dark surface — common in app shells with dark headers.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="details">
        <p style="margin:0;padding-top:var(--spacing-sm);">The tab list uses --color-bg-inverse; the panels render on the page background below.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="history">
        <p style="margin:0;padding-top:var(--spacing-sm);">Active tab indicator and text use --color-text-inverse (white in light mode).</p>
      </candor-tab-panel>
    </candor-tabs>`,
  }),
};

export const Vertical: Story = {
  name: 'Vertical orientation',
  render: () => ({
    template: `<candor-tabs
      active-id="profile"
      aria-label="Account settings"
      orientation="vertical"
      tabs='[{"id":"profile","label":"Profile"},{"id":"security","label":"Security"},{"id":"notifications","label":"Notifications"},{"id":"billing","label":"Billing"}]'>
      <candor-tab-panel panel-id="profile" active>
        <p style="margin:0">Manage your profile information, including your name, email, and avatar.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="security">
        <p style="margin:0">Update your password, enable two-factor authentication, and review active sessions.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="notifications">
        <p style="margin:0">Configure email, push, and in-app notification preferences.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="billing">
        <p style="margin:0">View billing history, update payment methods, and manage subscriptions.</p>
      </candor-tab-panel>
    </candor-tabs>`,
  }),
};

export const VerticalSidebar: Story = {
  name: 'Pattern: Sidebar navigation',
  render: () => ({
    template: `
      <div style="height:320px;border:1px solid var(--color-border-subtle);border-radius:var(--radius-md);overflow:hidden;">
        <candor-tabs
          active-id="overview"
          aria-label="Project navigation"
          orientation="vertical"
          style="height:100%;"
          tabs='[{"id":"overview","label":"Overview"},{"id":"deliberations","label":"Deliberations"},{"id":"documents","label":"Documents"},{"id":"settings","label":"Settings"}]'>
          <candor-tab-panel panel-id="overview" active>
            <h3 style="margin-top:0;font-family:var(--font-family-base);font-size:var(--font-size-lg);">Project overview</h3>
            <p style="color:var(--color-text-subtle);margin:0;">Summary of goals, timeline, and key stakeholders.</p>
          </candor-tab-panel>
          <candor-tab-panel panel-id="deliberations">
            <h3 style="margin-top:0;font-family:var(--font-family-base);font-size:var(--font-size-lg);">Deliberations</h3>
            <p style="color:var(--color-text-subtle);margin:0;">Structured discussion threads and decision records.</p>
          </candor-tab-panel>
          <candor-tab-panel panel-id="documents">
            <h3 style="margin-top:0;font-family:var(--font-family-base);font-size:var(--font-size-lg);">Documents</h3>
            <p style="color:var(--color-text-subtle);margin:0;">Attached files, briefs, and reference materials.</p>
          </candor-tab-panel>
          <candor-tab-panel panel-id="settings">
            <h3 style="margin-top:0;font-family:var(--font-family-base);font-size:var(--font-size-lg);">Settings</h3>
            <p style="color:var(--color-text-subtle);margin:0;">Project name, access controls, and archive options.</p>
          </candor-tab-panel>
        </candor-tabs>
      </div>
    `,
  }),
};

export const ManyTabs: Story = {
  name: 'Pattern: Many tabs (scroll affordance)',
  render: () => ({
    template: `
      <div style="max-width:320px;">
        <candor-tabs
          active-id="overview"
          aria-label="Dashboard sections"
          tabs='[{"id":"overview","label":"Overview"},{"id":"analytics","label":"Analytics"},{"id":"reports","label":"Reports"},{"id":"notifications","label":"Notifications"},{"id":"integrations","label":"Integrations"},{"id":"settings","label":"Settings"}]'>
          <candor-tab-panel panel-id="overview" active><p style="margin:0">High-level metrics and recent activity.</p></candor-tab-panel>
          <candor-tab-panel panel-id="analytics"><p style="margin:0">Traffic, conversion, and engagement data.</p></candor-tab-panel>
          <candor-tab-panel panel-id="reports"><p style="margin:0">Scheduled and on-demand report archive.</p></candor-tab-panel>
          <candor-tab-panel panel-id="notifications"><p style="margin:0">Alerts, mentions, and system messages.</p></candor-tab-panel>
          <candor-tab-panel panel-id="integrations"><p style="margin:0">Connected apps, webhooks, and API keys.</p></candor-tab-panel>
          <candor-tab-panel panel-id="settings"><p style="margin:0">Account preferences and access controls.</p></candor-tab-panel>
        </candor-tabs>
      </div>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    template: `<candor-tabs
      active-id="settings"
      aria-label="Account settings"
      tabs='[{"id":"profile","label":"Profile"},{"id":"settings","label":"Settings"},{"id":"billing","label":"Billing"}]'>
      <candor-tab-panel panel-id="profile">
        <p style="margin:0">Manage your profile information, including your name, email, and avatar.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="settings" active>
        <p style="margin:0">Configure your account settings, notification preferences, and privacy controls.</p>
      </candor-tab-panel>
      <candor-tab-panel panel-id="billing">
        <p style="margin:0">View your billing history, update payment methods, and manage subscriptions.</p>
      </candor-tab-panel>
    </candor-tabs>`,
  }),
};
