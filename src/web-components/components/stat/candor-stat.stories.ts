import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Components/Stat',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-stat>\` — large numeric display for dashboard metrics and KPI panels. Renders a
prominent value, an optional unit suffix, and a descriptive label above.

Five semantic color variants signal the metric's state: \`default\`, \`success\`,
\`warning\`, \`error\`, \`info\`. The color applies to the value and unit, not the label.

Compose with \`<candor-badge>\` for trend indicators (↑ 12% vs. last month) and with
\`<candor-card>\` when the stat lives inside a surface panel.
        `.trim(),
      },
    },
  },
  argTypes: {
    value: { control: 'text', type: { name: 'string' }, description: 'Numeric or string value displayed large' },
    unit: { control: 'text', type: { name: 'string' }, description: 'Unit suffix displayed after the value (e.g. % or :1)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Descriptive label above the value' },
    color: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      type: { name: 'string' },
      description: 'Semantic color variant',
    },
  },
  args: { value: '1,284', unit: '', label: 'Monthly active users', color: 'default' },
  render: (args) => ({
    template: `<candor-stat value="${args['value']}" unit="${args['unit']}" label="${args['label']}" color="${args['color']}"></candor-stat>`,
  }),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const ContrastRatio: Story = {
  name: 'Contrast ratio — warning state',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="max-width:320px;padding:var(--spacing-sm);">
        <candor-card variant="elevated">
          <div style="padding:var(--spacing-xs) 0;">
            <candor-stat value="3.9" unit=":1" label="WCAG 2.1 contrast ratio" color="warning">
              <div style="display:flex;gap:var(--spacing-xs);flex-wrap:wrap;justify-content:center;">
                <candor-badge variant="error" size="sm">AA text ✗</candor-badge>
                <candor-badge variant="success" size="sm">Large text ✓</candor-badge>
                <candor-badge variant="success" size="sm">Non-text ✓</candor-badge>
              </div>
              <candor-accessible-text role_="annotation" color="secondary" style="text-align:center;display:block;">
                Needs 4.5:1 for AA · 7:1 for AAA
              </candor-accessible-text>
            </candor-stat>
          </div>
        </candor-card>
      </div>
    `,
  }),
};

export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:var(--spacing-lg);flex-wrap:wrap;justify-content:center;">
        <candor-stat value="98.7" unit="%" label="Uptime" color="success"></candor-stat>
        <candor-stat value="42" label="Pending" color="warning"></candor-stat>
        <candor-stat value="3" label="Failures" color="error"></candor-stat>
        <candor-stat value="1,284" label="Users" color="default"></candor-stat>
        <candor-stat value="512" label="API calls" color="info"></candor-stat>
      </div>
    `,
  }),
};
