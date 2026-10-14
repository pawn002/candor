import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './candor-table';
import '../button/candor-button';
import '../badge/candor-badge';
import { allModes } from '../../../../.storybook/modes';

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
const RELEASE_HEADERS = JSON.stringify(['Package', 'Version', 'Released', 'Size (kB)']);
const RELEASE_ROWS = JSON.stringify([
  { cells: ['@candor-design/tokens', '1.0.0', '2026-04-15', '16.9'] },
  { cells: ['@candor-design/web-components', '4.1.0', '2026-06-16', '124.3'] },
  { cells: ['@candor-design/tokens', '4.1.0', '2026-06-16', '17.1'] },
]);
// Version + Released read left-to-right as codes (mono, left) — Size is a magnitude (mono, right).
const RELEASE_MONO_COLS = JSON.stringify([1, 2]);
const RELEASE_NUMERIC_COLS = JSON.stringify([3]);

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
    chromatic: { modes: { light: allModes.light, dark: allModes.dark } },
    docs: {
      description: {
        component: `
\`<candor-table>\`: a semantic data table with consistent typography, zebra striping, and a
\`compact\` density variant. In compact mode, row padding tightens and the zebra pattern
inverts (odd rows receive the surface background) so the first row is highlighted rather
than the second.

Set \`caption\` to render a visible \`<caption>\` element above the table. This is the
primary accessible name for the table and should always be provided. Screen readers
announce it when the user enters the table.

Pass \`headers\` as \`string[]\` and \`rows\` as \`{ cells: TableCell[], isHeader?: boolean }[]\`
via JS properties (or JSON-encoded as attributes). A cell is a string, or markup (a Lit
template or a DOM node) set through the \`rows\` property; see *Interactive cells*. Set \`isHeader: true\` on a row for
key/value tables where the first cell of each row is a row-header.

**Monospace columns.** Two column-index props (zero-based JSON arrays) apply Candor's
mono face where *character position is load-bearing*, never for flavour or to signal
"technical content" generically (see VISUAL-DESIGN.md §2):

- \`numeric-columns\`: mono + \`tabular-nums\` + **right-aligned**, for magnitudes you scan
  and compare down the column: revenue, scores, counts, measurements.
- \`mono-columns\`: mono + \`tabular-nums\` + **left-aligned**, for codes you read
  left-to-right as text: version strings, timestamps/dates, IDs, commit hashes, coordinates.
  These are position-sensitive but aren't quantities, so right-aligning them would be wrong.

A column listed in both resolves to \`numeric\` (right-aligned wins).

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
    caption: { control: 'text', type: { name: 'string' }, description: 'Accessible table caption, rendered as a visible <caption> element and announced by screen readers on entry' },
    headers: { control: 'object', description: 'Column header labels rendered in <thead>' },
    rows: { control: 'object', description: 'Array of { cells: string[], isHeader?: boolean }. Set isHeader: true for key/value rows where the first cell is a row-header.' },
    compact: { control: 'boolean', type: { name: 'boolean' }, description: 'Tighter row padding; inverts zebra pattern so odd rows receive the surface background' },
    numericColumns: { control: 'object', description: 'Zero-based column indices for magnitudes: monospace, tabular-nums, right-aligned' },
    monoColumns: { control: 'object', description: 'Zero-based column indices for codes read as text (versions, dates, IDs): monospace, tabular-nums, left-aligned' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<candor-table caption="Team roster" headers='${TEAM_HEADERS}' rows='${TEAM_ROWS}'></candor-table>`,
};

export const Compact: Story = {
  render: () => html`<candor-table caption="Team roster (compact)" compact headers='${TEAM_HEADERS}' rows='${TEAM_ROWS}'></candor-table>`,
};

export const KeyValue: Story = {
  render: () => html`<candor-table caption="Package details" rows='${KV_ROWS}'></candor-table>`,
};

export const Numeric: Story = {
  render: () => html`<candor-table caption="Quarterly financial summary" headers='${FINANCE_HEADERS}' rows='${FINANCE_ROWS}' numeric-columns='${NUMERIC_COLS}'></candor-table>`,
};

export const MonoColumns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Both mono props on one table. **Version** and **Released** use `mono-columns`: ' +
          'codes read left-to-right, so they stay left-aligned; `tabular-nums` still lines the ' +
          'digits up column-to-column. **Size (kB)** uses `numeric-columns`: a magnitude, so it ' +
          'is right-aligned for down-column comparison. The **Package** column is prose, left in ' +
          "the base sans face. This is the distinction to copy: mono marks character-position, " +
          'alignment marks whether the value is a code or a quantity.',
      },
    },
  },
  render: () => html`<candor-table caption="Recent releases" headers='${RELEASE_HEADERS}' rows='${RELEASE_ROWS}' mono-columns='${RELEASE_MONO_COLS}' numeric-columns='${RELEASE_NUMERIC_COLS}'></candor-table>`,
};

// The info button beside a metric label, which is what kept a consumer on its
// own table implementation (#258). The cells are Lit templates, so this story
// sets `rows` as a property rather than an attribute. The icon is inline SVG:
// the cell renders inside the table's shadow root, where icon-font classes do
// not reach. Consumers take the path data from @phosphor-icons/core; the story
// borrows Candor's own copy of the same glyph.
// Phosphor info, fill weight. An icon-only action is filled (#296), so this is
// not the bold status glyph from icons.ts. Inline SVG rather than a font class
// because the cell renders in the table's shadow root (#171).
const PH_INFO_FILL = 'M512 96c-229.75 0-416 186.25-416 416s186.25 416 416 416c229.75 0 416-186.25 416-416v0c-0.25-229.65-186.35-415.75-415.976-416l-0.024-0zM496 288c26.51 0 48 21.49 48 48s-21.49 48-48 48c-26.51 0-48-21.49-48-48v0c0-26.51 21.49-48 48-48v0zM544 736c-35.346 0-64-28.654-64-64v0-160c-17.673 0-32-14.327-32-32s14.327-32 32-32v0c35.346 0 64 28.654 64 64v0 160c17.673 0 32 14.327 32 32s-14.327 32-32 32v0z';

const aboutButton = (topic: string) => html`
  <candor-button variant="ghost" size="small" aria-label="About ${topic}"
    style="--candor-button-padding-x:0.125rem;--candor-button-padding-y:0.125rem;vertical-align:middle;margin-inline-start:var(--spacing-2xs);">
    <svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor" style="width:1.75rem;height:1.75rem;display:block;"><path d="${PH_INFO_FILL}"/></svg>
  </candor-button>
`;

export const InteractiveCells: Story = {
  name: 'Interactive cells',
  parameters: {
    docs: {
      description: {
        story:
          'Cells can hold markup as well as text: a Lit template or a DOM node, set through the ' +
          '`rows` property. Here each metric label carries an info button and each result a ' +
          'badge. The buttons are ordinary Tab stops, since this is a table to read, not a grid ' +
          'to navigate. Markup renders in the table’s shadow root, so style it with Candor ' +
          'components or inline styles, and use inline SVG for icons.',
      },
    },
  },
  render: () => html`
    <candor-table
      caption="Contrast metrics"
      .headers=${['Metric', 'Value', 'Result']}
      .rows=${[
        { cells: [html`OKCA${aboutButton('OKCA')}`, '11.5', html`<candor-badge variant="success">Passes</candor-badge>`] },
        { cells: [html`WCAG 2.1${aboutButton('WCAG 2.1')}`, '12.6', html`<candor-badge variant="success">Passes</candor-badge>`] },
        { cells: [html`Delta E${aboutButton('Delta E')}`, '4.1', html`<candor-badge variant="warning">Barely distinct</candor-badge>`] },
      ]}
      numeric-columns="[1]"
    ></candor-table>
  `,
};
