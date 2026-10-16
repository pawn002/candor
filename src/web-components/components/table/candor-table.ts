import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { customElement } from '../../utils/define';
import { scrollbarStyles } from '../../utils/scrollbar';
import { observeOverflow } from '../../utils/overflow';

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
}

/**
 * A static data table. Structure comes from `headers` and `rows`, not from
 * slotted markup.
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
 * Choose against `candor-data-grid` on interaction: this is content to read, a
 * grid is a two-dimensional widget the user navigates cell by cell.
 *
 * Emits no custom events.
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
      outline: var(--focus-ring-width) solid var(--color-focus);
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
    thead th {
      color: var(--color-text-subtle-on-surface);
      font-weight: var(--font-weight-bold);
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
  `, scrollbarStyles('.table__scroll')];

  @property() caption = '';
  @property({ type: Array }) headers: string[] = [];
  @property({ type: Array }) rows: TableRow[] = [];
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Array, attribute: 'numeric-columns' }) numericColumns: number[] = [];
  @property({ type: Array, attribute: 'mono-columns' }) monoColumns: number[] = [];

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
            <tr>${this.headers.map((h, i) => html`<th scope="col" class=${this._cellClass(i)}>${h}</th>`)}</tr>
          </thead>
        ` : nothing}
        <tbody>
          ${this.rows.map(row => html`
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-table': CandorTable; }
}
