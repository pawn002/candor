import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface TableRow {
  cells: string[];
  isHeader?: boolean;
}

@customElement('candor-table')
export class CandorTable extends LitElement {
  static override styles = css`
    :host { display: block; overflow-x: auto; }
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
  `;

  @property() caption = '';
  @property({ type: Array }) headers: string[] = [];
  @property({ type: Array }) rows: TableRow[] = [];
  @property({ type: Boolean, reflect: true }) compact = false;
  @property({ type: Array, attribute: 'numeric-columns' }) numericColumns: number[] = [];
  @property({ type: Array, attribute: 'mono-columns' }) monoColumns: number[] = [];

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
      <table>
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
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-table': CandorTable; }
}
