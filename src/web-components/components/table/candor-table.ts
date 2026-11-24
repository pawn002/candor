import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { customElement } from '../../utils/define';
import { scrollbarStyles } from '../../utils/scrollbar';
import { observeOverflow } from '../../utils/overflow';
import { phCaretDownBold, phCaretUpBold, phCaretUpDownBold } from '../../icons';
import type { CandorTableSortDetail } from '../../events';

export type TableSortDirection = 'ascending' | 'descending';

/** The value a cell sorts by. `null` or `undefined` is unknown, and sorts last. */
export type TableSortValue = string | number | null | undefined;

/**
 * One cell's content. A string is text. A Lit `TemplateResult` or a DOM `Node`
 * renders as markup, which is how a cell holds a link, a button or a badge
 * (#258). Only strings survive the JSON `rows` attribute; markup has to be set
 * through the `rows` property.
 */
export type TableCell = string | TemplateResult | Node;

export interface TableRow {
  cells: TableCell[];
  isHeader?: boolean;
  /**
   * What each cell sorts by, by column index, when the displayed text is not
   * it: raw bytes behind "1.5 GiB", an unrounded figure behind a rounded badge,
   * an ISO date behind "Tuesday". Without one, a string cell sorts by its text,
   * a DOM node by its text content, and a Lit template is unknown.
   */
  sortValues?: TableSortValue[];
}

/**
 * A data table to read, optionally sortable by column. Structure comes from
 * `headers` and `rows`, not from slotted markup.
 *
 * **A cell is text or markup.** Each cell is a `TableCell`: a string, a Lit
 * `TemplateResult`, or a DOM `Node`. Markup is how a cell holds an info button
 * beside a label, a link, or a status badge. Set it through the `rows`
 * property, since the JSON attribute can only carry strings. Markup renders
 * inside this element's shadow root, so the page's stylesheet does not reach it:
 * use Candor components or inline styles, and inline SVG rather than icon-font
 * classes, which do not cross a shadow boundary. Interactive content is still
 * ordinary page content: it is in the Tab order, and the table does not manage
 * focus. A table the user moves through cell by cell is `candor-data-grid`.
 *
 * **Always set `caption`.** It is the table's accessible name, and a page with
 * several tables is otherwise a list of anonymous "table" landmarks to anyone
 * navigating by structure. It is visible text, not a tooltip. Treat it as the
 * table's title rather than as an accessibility afterthought.
 *
 * `TableRow.isHeader` promotes a row's cells to `<th scope="row">`, which is
 * what makes a key/value table readable: without it, a screen reader announces
 * the value with no idea which key it belongs to.
 *
 * `numeric-columns` right-aligns and tabular-figures those column indexes;
 * `mono-columns` sets them in the mono face. Both take **zero-based indexes**,
 * and an out-of-range index is ignored silently.
 *
 * **Sorting is opt-in per column.** List the sortable column indexes in
 * `sortable-columns`; each of those headers becomes a native button, so Enter
 * and Space sort and focus stays on it while the rows reorder. The active column
 * carries `aria-sort` and nothing else does, and a polite live region announces
 * the new order. Activating a column sorts ascending; activating it again
 * reverses. There is no unsorted third state.
 *
 * Numbers compare as numbers and text with numeric collation ("item 2" before
 * "item 10"). A displayed value is often not the right one to sort by, so give
 * `TableRow.sortValues` the raw value: bytes behind "1.5 GiB", the unrounded
 * figure behind a rounded badge. Unknown values (`null`, `undefined`, empty
 * text, or a Lit template with no sort value) sort last in both directions, and
 * ties keep their original order.
 *
 * `sort-column` and `sort-direction` set the initial order and reflect the
 * current one. The `sort` event fires before the table re-sorts and is
 * cancelable: call `preventDefault()` to keep the current order, for a consumer
 * that sorts its own data (on a server, say) and then sets `rows`,
 * `sort-column` and `sort-direction` itself.
 *
 * Choose against `candor-data-grid` on interaction: this is content to read, a
 * grid is a two-dimensional widget the user navigates cell by cell. Sorting
 * does not change that: the headers are buttons, and the table stays a table.
 *
 * @fires sort - detail: CandorTableSortDetail (`{ column, direction }`, when a sortable header is activated, before the rows reorder; cancelable)
 */
@customElement('candor-table')
export class CandorTable extends LitElement {
  static override styles = [css`
    :host { display: block; }
    /* The scroller is an inner element, not the host: per-axis scrollbar rules
       (::-webkit-scrollbar-thumb:horizontal) do not apply to :host (#307). */
    .table__scroll { overflow-x: auto; }
    .table__scroll:focus { outline: none; }
    .table__scroll:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-ring-focus);
      outline-offset: calc(-1 * var(--focus-ring-offset));
    }
    table {
      min-width: 100%;
      width: max-content;
      border-collapse: collapse;
    }
    caption {
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--color-text-subtle);
      text-align: center;
      padding-bottom: var(--spacing-xs);
    }
    th, td {
      padding: var(--spacing-xs) var(--spacing-sm);
      text-align: left;
      border-bottom: var(--border-width-thin) solid var(--color-border-strong);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--color-text-default);
    }
    th {
      font-weight: var(--font-weight-bold);
    }
    /* The header row stays bold, unlike headings: at 14px semibold counts as
       regular for contrast, which would raise its floor from 4.5 to 6.5, and
       subtle-on-surface on the page is below that in dark. */
    thead th {
      color: var(--color-text-subtle-on-surface);
      font-weight: var(--font-weight-bold);
      letter-spacing: var(--letter-spacing-relaxed);
      border-bottom: var(--border-width-medium) solid var(--color-border-strong);
    }
    td {
      font-variant-numeric: tabular-nums;
    }
    th.numeric, td.numeric {
      font-family: var(--font-family-mono);
      text-align: right;
      letter-spacing: var(--letter-spacing-normal);
    }
    /* Mono, but read left-to-right as text (version strings, timestamps, IDs,
       coordinates) — character position is load-bearing, but the value is not a
       magnitude to scan by, so it keeps natural (left) alignment. */
    th.mono, td.mono {
      font-family: var(--font-family-mono);
      font-variant-numeric: tabular-nums;
      letter-spacing: var(--letter-spacing-normal);
    }
    /* A column header is a label, not a value: it stays in the base face when
       its column is mono, so the header row reads as one line. */
    thead th.numeric, thead th.mono {
      font-family: var(--font-family-base);
      letter-spacing: var(--letter-spacing-relaxed);
    }
    tbody tr:nth-child(even) td,
    tbody tr:nth-child(even) th {
      background: var(--color-bg-surface);
    }
    tbody tr:last-child td,
    tbody tr:last-child th {
      border-bottom: none;
    }
    :host([compact]) th,
    :host([compact]) td {
      padding: var(--spacing-2xs) var(--spacing-sm);
    }
    :host([compact]) tbody tr:nth-child(even) td,
    :host([compact]) tbody tr:nth-child(even) th {
      background: transparent;
    }
    :host([compact]) tbody tr:nth-child(odd) td,
    :host([compact]) tbody tr:nth-child(odd) th {
      background: var(--color-bg-surface);
    }
    /* A sortable header is a button that looks like the header it sits in. The
       24px minimum is WCAG 2.5.8's target size; the header text alone is 20px. */
    .table__sort {
      display: inline-flex; align-items: center; gap: var(--spacing-2xs);
      min-height: var(--hit-target-aa);
      margin: 0; padding: 0; border: 0; background: none;
      font: inherit; color: inherit; letter-spacing: inherit; text-align: inherit;
      cursor: pointer; border-radius: var(--radius-sm);
    }
    .table__sort:hover { color: var(--color-text-default); }
    .table__sort:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-ring-focus);
      outline-offset: var(--focus-ring-offset);
    }
    /* Right-aligned columns put the indicator before the text, so the text keeps
       the column's edge. */
    th.numeric .table__sort { flex-direction: row-reverse; }
    .table__sort svg { width: 1em; height: 1em; flex: none; }
    /* The active column's header reads as text-default: a second channel beside
       the indicator's shape. */
    thead th[aria-sort] { color: var(--color-text-default); }
    .sr-only {
      position: absolute; width: 1px; height: 1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap;
    }
  `, scrollbarStyles('.table__scroll')];

  @property() caption = '';
  @property({ type: Array }) headers: string[] = [];
  @property({ type: Array }) rows: TableRow[] = [];
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Array, attribute: 'numeric-columns' }) numericColumns: number[] = [];
  @property({ type: Array, attribute: 'mono-columns' }) monoColumns: number[] = [];
  @property({ type: Array, attribute: 'sortable-columns' }) sortableColumns: number[] = [];
  /** The column the rows are sorted by, as a zero-based index. Unset keeps them in the order given. */
  @property({ type: Number, attribute: 'sort-column', reflect: true }) sortColumn?: number;
  @property({ attribute: 'sort-direction', reflect: true }) sortDirection: TableSortDirection = 'ascending';

  @state() private _sortAnnouncement = '';
  private static _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  // A table wider than its container scrolls sideways, and keyboard users can
  // only scroll what they can focus (#334). The wrapper becomes a tab stop only
  // while it overflows, so a table that fits adds no stop. With a caption it is
  // also a region named by it; without one it stays unnamed, because several
  // regions all called "table" are landmarks nobody can tell apart.
  @state() private _scrolls = false;
  private _stopOverflow?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated) this._observeOverflow();
  }

  override firstUpdated() {
    this._observeOverflow();
  }

  override disconnectedCallback() {
    this._stopOverflow?.();
    super.disconnectedCallback();
  }

  private _observeOverflow() {
    this._stopOverflow?.();
    const scroller = this.renderRoot.querySelector('.table__scroll');
    if (scroller) this._stopOverflow = observeOverflow(scroller, (o) => { this._scrolls = o; });
  }

  // A column is at most one of numeric (mono + right-aligned, for magnitudes) or
  // mono (mono + left-aligned, for codes read as text). numeric wins if a column
  // is listed in both.
  private _cellClass(i: number): string | typeof nothing {
    if (this.numericColumns.includes(i)) return 'numeric';
    if (this.monoColumns.includes(i)) return 'mono';
    return nothing;
  }

  private _sortValue(row: TableRow, i: number): TableSortValue {
    const given = row.sortValues?.[i];
    if (given !== undefined) return given;
    const cell = row.cells[i];
    if (typeof cell === 'string') return cell.trim() === '' ? null : cell;
    if (cell instanceof Node) return cell.textContent?.trim() || null;
    return null;
  }

  // Unknowns last in both directions; numbers before text; ties keep their order.
  private _sortedRows(): TableRow[] {
    const col = this.sortColumn;
    if (col === undefined || col === null || Number.isNaN(col) || !this.sortableColumns.includes(col)) return this.rows;
    const sign = this.sortDirection === 'descending' ? -1 : 1;
    const unknown = (v: TableSortValue) => v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v));
    return this.rows
      .map((row, index) => ({ row, index, value: this._sortValue(row, col) }))
      .sort((a, b) => {
        const au = unknown(a.value);
        const bu = unknown(b.value);
        if (au || bu) return au && bu ? a.index - b.index : au ? 1 : -1;
        let c: number;
        if (typeof a.value === 'number' && typeof b.value === 'number') c = a.value - b.value;
        else if (typeof a.value === 'number') c = -1;
        else if (typeof b.value === 'number') c = 1;
        else c = CandorTable._collator.compare(String(a.value), String(b.value));
        return c !== 0 ? sign * c : a.index - b.index;
      })
      .map((x) => x.row);
  }

  private _onSort(column: number) {
    const direction: TableSortDirection =
      this.sortColumn === column && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    const proceed = this.dispatchEvent(new CustomEvent<CandorTableSortDetail>('sort', {
      detail: { column, direction },
      bubbles: true,
      composed: true,
      cancelable: true,
    }));
    if (!proceed) return;
    this.sortColumn = column;
    this.sortDirection = direction;
    this._sortAnnouncement = `Sorted by ${this.headers[column] ?? `column ${column + 1}`}, ${direction}`;
  }

  private _header(h: string, i: number) {
    if (!this.sortableColumns.includes(i)) return html`<th scope="col" class=${this._cellClass(i)}>${h}</th>`;
    const active = this.sortColumn === i;
    const icon = !active ? phCaretUpDownBold : this.sortDirection === 'ascending' ? phCaretUpBold : phCaretDownBold;
    return html`<th scope="col" class=${this._cellClass(i)} aria-sort=${active ? this.sortDirection : nothing}>
      <button type="button" class="table__sort" @click=${() => this._onSort(i)}>
        <span>${h}</span><svg aria-hidden="true" viewBox="0 0 1024 1024" fill="currentColor"><path d=${icon}></path></svg>
      </button>
    </th>`;
  }

  override render() {
    return html`
      <div
        class="table__scroll"
        tabindex=${this._scrolls ? '0' : nothing}
        role=${this._scrolls && this.caption ? 'region' : nothing}
        aria-label=${this._scrolls && this.caption ? this.caption : nothing}
      ><table>
        ${this.caption ? html`<caption>${this.caption}</caption>` : nothing}
        ${this.headers.length ? html`
          <thead>
            <tr>${this.headers.map((h, i) => this._header(h, i))}</tr>
          </thead>
        ` : nothing}
        <tbody>
          ${this._sortedRows().map(row => html`
            <tr>
              ${row.cells.map((cell, i) => {
                return i === 0 && (row.isHeader || !this.headers.length)
                  ? html`<th scope="row" class=${this._cellClass(i)}>${cell}</th>`
                  : html`<td class=${this._cellClass(i)}>${cell}</td>`;
              })}
            </tr>
          `)}
        </tbody>
      </table></div>
      ${this.sortableColumns.length
        ? html`<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">${this._sortAnnouncement}</div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-table': CandorTable; }
}
