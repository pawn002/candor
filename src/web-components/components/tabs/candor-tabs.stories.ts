import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './candor-tabs';

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
panels) and \`vertical\` (tabs left, panels right). Emits a \`change\` CustomEvent.

When the horizontal tab row overflows, chevron scroll buttons appear at the edges —
clicking scrolls the list by 200px. A fade gradient behind each button reinforces
the direction. The buttons are intentionally excluded from Tab order (mouse/touch
only); keyboard users arrow through tabs and the list scrolls to keep the focused
tab in view automatically.
        `.trim(),
      },
    },
  },
  argTypes: {
    'aria-label': { control: 'text', description: 'Required. Labels the tab list for screen readers. Set on the host — forwarded to [role="tablist"] internally.' },
    tabs: { control: 'object', description: 'Array of { id: string, label: string } — drives the tab row. Panels are matched by panel-id.' },
    activeId: { control: 'text', type: { name: 'string' }, description: 'Id of the initially selected tab. Defaults to the first tab.' },
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
    'change': { control: false, description: 'CustomEvent fired on tab selection. event.detail is the id of the newly active tab.' },
  },
  render: () => html`<candor-tabs
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
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Inverse: Story = {
  render: () => html`<candor-tabs
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
};

export const Vertical: Story = {
  name: 'Vertical orientation',
  render: () => html`<candor-tabs
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
};

export const VerticalSidebar: Story = {
  name: 'Pattern: Sidebar navigation',
  render: () => html`
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
};

export const ManyTabs: Story = {
  name: 'Pattern: Many tabs (scroll affordance)',
  render: () => html`
    <candor-tabs
      active-id="overview"
      aria-label="Dashboard sections"
      tabs='[{"id":"overview","label":"Overview"},{"id":"analytics","label":"Analytics"},{"id":"reports","label":"Reports"},{"id":"notifications","label":"Notifications"},{"id":"integrations","label":"Integrations"},{"id":"settings","label":"Settings"},{"id":"audit","label":"Audit log"},{"id":"billing","label":"Billing &amp; subscriptions"}]'>
      <candor-tab-panel panel-id="overview" active><p style="margin:0">High-level metrics and recent activity.</p></candor-tab-panel>
      <candor-tab-panel panel-id="analytics"><p style="margin:0">Traffic, conversion, and engagement data.</p></candor-tab-panel>
      <candor-tab-panel panel-id="reports"><p style="margin:0">Scheduled and on-demand report archive.</p></candor-tab-panel>
      <candor-tab-panel panel-id="notifications"><p style="margin:0">Alerts, mentions, and system messages.</p></candor-tab-panel>
      <candor-tab-panel panel-id="integrations"><p style="margin:0">Connected apps, webhooks, and API keys.</p></candor-tab-panel>
      <candor-tab-panel panel-id="settings"><p style="margin:0">Account preferences and access controls.</p></candor-tab-panel>
      <candor-tab-panel panel-id="audit"><p style="margin:0">User activity and access history.</p></candor-tab-panel>
      <candor-tab-panel panel-id="billing"><p style="margin:0">Invoices, payment methods, and plan details.</p></candor-tab-panel>
    </candor-tabs>
  `,
};

export const PreSelected: Story = {
  name: 'Pre-selected tab',
  render: () => html`<candor-tabs
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
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Select a tab — a `change` CustomEvent fires with the new tab id as `event.detail`. ' +
          'Wire it to your data layer or router:\n\n' +
          '```js\n' +
          "const tabs = document.querySelector('candor-tabs');\n" +
          "tabs.addEventListener('change', (e) => {\n" +
          '  router.navigate(e.detail);   // e.g. update URL\n' +
          '  tabs.activeId = e.detail;    // sync back if managing state externally\n' +
          '});\n' +
          '```\n\n' +
          'The component manages its own visual state internally, so navigation works in the canvas without an external handler.',
      },
    },
  },
  render: () => html`<candor-tabs
    active-id="overview"
    aria-label="Product details"
    tabs='[{"id":"overview","label":"Overview"},{"id":"specs","label":"Specifications"},{"id":"reviews","label":"Reviews"}]'>
    <candor-tab-panel panel-id="overview" active>
      <p style="margin:0">Overview content. Open the browser console and select a tab to see the <code>change</code> event fire.</p>
    </candor-tab-panel>
    <candor-tab-panel panel-id="specs">
      <p style="margin:0">Specifications content.</p>
    </candor-tab-panel>
    <candor-tab-panel panel-id="reviews">
      <p style="margin:0">Customer reviews.</p>
    </candor-tab-panel>
  </candor-tabs>`,
};
