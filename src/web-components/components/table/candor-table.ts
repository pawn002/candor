import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface TableRow {
  cells: string[];
  isHeader?: boolean;
}

@customElement('candor-table')
export class CandorTable extends LitElement {
  static override styles = css`
    :host { display: block; }
    table {
      width: 100%;
      border-collapse: collapse;
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
    td.label {
      color: var(--color-text-subtle-on-surface);
    }
    tbody tr:nth-child(even) td,
    tbody tr:nth-child(even) th {
      background: var(--color-bg-surface);
    }
    tbody tr:last-child td {
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

  override render() {
    return html`
      <table>
        ${this.caption ? html`<caption>${this.caption}</caption>` : nothing}
        ${this.headers.length ? html`
          <thead>
            <tr>${this.headers.map(h => html`<th scope="col">${h}</th>`)}</tr>
          </thead>
        ` : nothing}
        <tbody>
          ${this.rows.map(row => html`
            <tr>
              ${row.cells.map((cell, i) =>
                i === 0 && (row.isHeader || !this.headers.length)
                  ? html`<th scope="row">${cell}</th>`
                  : html`<td>${cell}</td>`
              )}
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
