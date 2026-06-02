import type { Meta, StoryObj } from '@storybook/angular';

const FINANCE_HEADERS = JSON.stringify(['Quarter', 'Revenue', 'Expenses', 'Net']);
const FINANCE_ROWS = JSON.stringify([
  { cells: ['Q1 2024', '£1,240,000', '£980,000', '£260,000'] },
  { cells: ['Q2 2024', '£1,380,000', '£1,050,000', '£330,000'] },
  { cells: ['Q3 2024', '£1,190,000', '£970,000', '£220,000'] },
  { cells: ['Q4 2024', '£1,560,000', '£1,120,000', '£440,000'] },
]);
const NUMERIC_COLS = JSON.stringify([1, 2, 3]);

const TEAM_HEADERS = JSON.stringify(['Name', 'Role', 'Department', 'Start date']);
const TEAM_ROWS = JSON.stringify([
  { cells: ['Alice Okonkwo', 'Senior Engineer', 'Platform', '2021-03-15'] },
  { cells: ['Ben Hargreaves', 'Product Manager', 'Growth', '2020-07-01'] },
  { cells: ['Carmen Silva', 'Designer', 'Brand', '2022-01-10'] },
  { cells: ['David Chen', 'Engineering Manager', 'Platform', '2019-11-22'] },
  { cells: ['Emeka Nwosu', 'Data Analyst', 'Analytics', '2023-05-08'] },
]);
const KV_ROWS = JSON.stringify([
  { cells: ['Package', '@candor-design/tokens'], isHeader: true },
  { cells: ['Version', '1.0.0'], isHeader: true },
  { cells: ['License', 'MIT'], isHeader: true },
  { cells: ['Dependencies', '0'], isHeader: true },
]);

const meta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-table>\` — semantic data table with consistent typography, zebra striping, and a
\`compact\` density variant.

Pass \`headers\` as \`string[]\` and \`rows\` as \`{ cells: string[], isHeader?: boolean }[]\`
via JS properties (or JSON-encoded as attributes). Set \`isHeader: true\` on a row for
key/value tables where the first cell of each row is a row-header.

Pass \`numeric-columns\` as a JSON array of column indices (zero-based) to apply
monospace typography and right-alignment to value-heavy columns.

Zebra striping uses \`--color-bg-surface\` for even rows, visible on
any light background without requiring a surface container.

At narrow viewports, text content wraps within cells. For tables where wrapping is
not appropriate (value-heavy columns, long unbreakable strings), wrap the element
in a container with \`overflow-x: auto\` to expose a horizontal scrollbar.
        `.trim(),
      },
    },
  },
  argTypes: {
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption' },
    compact: { control: 'boolean', type: { name: 'boolean' }, description: 'Tighter row padding' },
    numericColumns: { control: 'object', description: 'Zero-based column indices to render with monospace font, right-aligned' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<candor-table caption="Team roster" headers='${TEAM_HEADERS}' rows='${TEAM_ROWS}'></candor-table>`,
  }),
};

export const Compact: Story = {
  render: () => ({
    template: `<candor-table caption="Team roster (compact)" compact headers='${TEAM_HEADERS}' rows='${TEAM_ROWS}'></candor-table>`,
  }),
};

export const KeyValue: Story = {
  render: () => ({
    template: `<candor-table rows='${KV_ROWS}'></candor-table>`,
  }),
};

export const Numeric: Story = {
  render: () => ({
    template: `<candor-table caption="Quarterly financial summary" headers='${FINANCE_HEADERS}' rows='${FINANCE_ROWS}' numeric-columns='${NUMERIC_COLS}'></candor-table>`,
  }),
};
