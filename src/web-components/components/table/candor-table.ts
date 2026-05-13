import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface TableRow {
  cells: string[];
  isHeader?: boolean;
}

@customElement('candor-table')
export class CandorTable extends LitElement {
  static styles = css`
    :host { display: block; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: var(--spacing-xs) var(--spacing-sm);
      text-align: left;
      border-bottom: var(--border-width-thin) solid var(--color-border-strong);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      color: var(--color-text-default);
      letter-spacing: 0.02em;
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
      letter-spacing: 0;
    }
    td.label {
      color: var(--color-text-subtle-on-surface);
    }
    tbody tr:nth-child(even) td,
    tbody tr:nth-child(even) th {
      background: oklch(0.85 0 0);
    }
    @media (prefers-color-scheme: dark) {
      tbody tr:nth-child(even) td,
      tbody tr:nth-child(even) th {
        background: color-mix(in oklch, white 15%, var(--color-bg-elevated));
      }
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    :host([compact]) th,
    :host([compact]) td {
      padding: 0.25rem var(--spacing-sm);
    }
    :host([compact]) tbody tr:nth-child(even) td,
    :host([compact]) tbody tr:nth-child(even) th {
      background: transparent;
    }
    :host([compact]) tbody tr:nth-child(odd) td,
    :host([compact]) tbody tr:nth-child(odd) th {
      background: oklch(0.85 0 0);
    }
    @media (prefers-color-scheme: dark) {
      :host([compact]) tbody tr:nth-child(even) td,
      :host([compact]) tbody tr:nth-child(even) th {
        background: transparent;
      }
      :host([compact]) tbody tr:nth-child(odd) td,
      :host([compact]) tbody tr:nth-child(odd) th {
        background: color-mix(in oklch, white 15%, var(--color-bg-elevated));
      }
    }
  `;

  @property() caption = '';
  @property({ type: Array }) headers: string[] = [];
  @property({ type: Array }) rows: TableRow[] = [];
  @property({ type: Boolean, reflect: true }) compact = false;

  render() {
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
                row.isHeader || i === 0 && !this.headers.length
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
