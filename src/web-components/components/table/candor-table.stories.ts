import type { Meta, StoryObj } from '@storybook/angular';

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

Cells with a \`numeric\` class (added via the consumer's CSS) use \`--font-family-mono\`
and right-align — useful for value-heavy columns.

Zebra striping uses \`oklch(0.85 0 0)\` for even rows — deltaE 11 from white, visible on
any light background without requiring a surface container.
        `.trim(),
      },
    },
  },
  argTypes: {
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption' },
    compact: { control: 'boolean', type: { name: 'boolean' }, description: 'Tighter row padding' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<candor-table headers='${TEAM_HEADERS}' rows='${TEAM_ROWS}'></candor-table>`,
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
