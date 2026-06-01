import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../utils/host-aria';

export interface GridCell {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  background?: string;
  foreground?: string;
}

export interface GridRow {
  rowHeader?: string;
  cells: GridCell[];
}

@customElement('candor-data-grid')
export class CandorDataGrid extends LitElement {
  static override styles = css`
    :host { display: block; }
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0;
      overflow: hidden; clip: rect(0,0,0,0); clip-path: inset(50%);
      white-space: nowrap;
    }
    .data-grid {
      border-collapse: separate;
      border-spacing: 0;
      font-family: var(--font-family-accessible);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .data-grid__caption {
      caption-side: top;
      text-align: left;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-default);
      padding: var(--spacing-xs) var(--spacing-sm);
      letter-spacing: var(--letter-spacing-wide);
      border-bottom: 1px solid var(--color-border-default);
      background: var(--color-bg-surface);
    }
    .data-grid__corner,
    .data-grid__colheader,
    .data-grid__rowheader {
      background: var(--color-bg-surface);
      color: var(--color-text-subtle-on-surface);
      font-family: var(--font-family-accessible);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-regular);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      padding: var(--spacing-xs) var(--spacing-sm);
      white-space: nowrap;
    }
    .data-grid__colheader {
      text-align: center;
      border-bottom: 1px solid var(--color-border-strong);
    }
    .data-grid__rowheader {
      text-align: right;
      border-right: 1px solid var(--color-border-strong);
    }
    .data-grid__corner {
      border-bottom: 1px solid var(--color-border-strong);
      border-right: 1px solid var(--color-border-strong);
    }
    .data-grid__cell {
      position: relative;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      cursor: pointer;
      background: var(--cell-bg, var(--color-bg-page));
      color: var(--cell-fg, var(--color-text-default));
      border: none;
      box-shadow: inset -1px 0 0 var(--color-border-default), inset 0 -1px 0 var(--color-border-default);
    }
    .data-grid__cell:focus { outline: none; }
    .data-grid__cell:focus-visible {
      outline: 2px solid white;
      outline-offset: -2px;
      box-shadow:
        inset -1px 0 0 var(--color-border-default),
        inset 0 -1px 0 var(--color-border-default),
        0 0 0 3px var(--color-focus);
      z-index: 2;
    }
    .data-grid__cell.is-selected {
      box-shadow:
        inset -1px 0 0 var(--color-border-default),
        inset 0 -1px 0 var(--color-border-default),
        inset 0 0 0 2px white,
        inset 0 0 0 4px var(--color-action-primary);
      z-index: 1;
    }
    .data-grid__cell.is-selected:focus-visible {
      box-shadow:
        inset 0 0 0 2px white,
        inset 0 0 0 4px var(--color-action-primary),
        0 0 0 3px var(--color-focus);
      z-index: 2;
    }
    .data-grid__cell.is-disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .data-grid__cell-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: none;
      gap: 0.2em;
    }
    .data-grid__cell-label {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      line-height: 1;
    }
    .data-grid__check {
      font-size: var(--font-size-sm);
      line-height: 1;
    }
    :host([hide-headers]) caption,
    :host([hide-headers]) thead {
      position: absolute;
      width: 1px; height: 1px; padding: 0;
      overflow: hidden; clip: rect(0,0,0,0); clip-path: inset(50%);
      white-space: nowrap;
    }
    :host([hide-headers]) .data-grid__rowheader,
    :host([hide-headers]) .data-grid__corner {
      width: 0; min-width: 0; max-width: 0;
      padding: 0; overflow: hidden; white-space: nowrap;
      clip-path: inset(50%);
    }
  `;

  @property() caption = '';
  @property({ type: Array, attribute: 'column-headers' }) columnHeaders: string[] = [];
  @property({ type: Array }) rows: GridRow[] = [];
  @property({ type: Boolean, reflect: true, attribute: 'hide-headers' }) hideHeaders = false;
  @property({ type: Boolean, attribute: 'show-labels' }) showLabels = false;

  // aria-label observed manually so the attribute is stripped off the host
  // (avoids host/inner double-naming — see utils/host-aria.ts).
  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (v) => { this._ariaLabel = v; });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

  @state() private _activeRow = 0;
  @state() private _activeCol = 0;
  @state() private _announcement = '';

  private _hintId = `candor-dg-hint-${Math.random().toString(36).slice(2, 9)}`;

  private get _hasRowHeaders(): boolean {
    return this.rows.some(r => r.rowHeader);
  }

  private _isActive(row: number, col: number) {
    return this._activeRow === row && this._activeCol === col;
  }

  private _onClick(row: number, col: number) {
    const cell = this.rows[row]?.cells[col];
    if (!cell || cell.disabled) return;
    this._activeRow = row;
    this._activeCol = col;
    this.dispatchEvent(new CustomEvent('cell-activate', {
      detail: { row, col, cell },
      bubbles: true,
      composed: true,
    }));
    this._announcement = `${cell.label} activated`;
  }

  private _onFocus(row: number, col: number) {
    this._activeRow = row;
    this._activeCol = col;
  }

  private _onKeydown(e: KeyboardEvent, row: number, col: number) {
    const maxRow = this.rows.length - 1;
    const maxCol = (this.rows[0]?.cells.length ?? 1) - 1;
    let nr = row, nc = col;

    switch (e.key) {
      case 'ArrowRight': nc = Math.min(col + 1, maxCol); break;
      case 'ArrowLeft': nc = Math.max(col - 1, 0); break;
      case 'ArrowDown': nr = Math.min(row + 1, maxRow); break;
      case 'ArrowUp': nr = Math.max(row - 1, 0); break;
      case 'Home':
        if (e.ctrlKey) { nr = 0; nc = 0; } else nc = 0;
        break;
      case 'End':
        if (e.ctrlKey) { nr = maxRow; nc = maxCol; } else nc = maxCol;
        break;
      case 'Enter': case ' ':
        e.preventDefault();
        this._onClick(row, col);
        return;
      default: return;
    }
    e.preventDefault();
    this._activeRow = nr;
    this._activeCol = nc;
    // Focus the target cell after render
    requestAnimationFrame(() => {
      const cell = this.shadowRoot?.querySelector<HTMLElement>(
        `[data-row="${nr}"][data-col="${nc}"]`
      );
      cell?.focus();
    });
  }

  override render() {
    const hasRowHeaders = this._hasRowHeaders;
    return html`
      <p id="${this._hintId}" class="sr-only">
        Arrow keys navigate · Ctrl+Home/End jumps to first/last cell · Enter or Space activates
      </p>
      <table
        role="grid"
        class="data-grid"
        aria-label="${this._ariaLabel || (this.caption ? nothing : 'Data grid')}"
        aria-describedby="${this._hintId}"
      >
        ${this.caption ? html`<caption class="data-grid__caption">${this.caption}</caption>` : nothing}
        ${this.columnHeaders.length ? html`
          <thead>
            <tr role="row">
              ${hasRowHeaders ? html`<td class="data-grid__corner" role="none"></td>` : nothing}
              ${this.columnHeaders.map(h => html`
                <th role="columnheader" scope="col" class="data-grid__colheader">${h}</th>
              `)}
            </tr>
          </thead>
        ` : nothing}
        <tbody>
          ${this.rows.map((row, ri) => html`
            <tr role="row">
              ${row.rowHeader ? html`
                <th role="rowheader" scope="row" class="data-grid__rowheader">${row.rowHeader}</th>
              ` : nothing}
              ${row.cells.map((cell, ci) => html`
                <td
                  role="gridcell"
                  class="data-grid__cell ${cell.selected ? 'is-selected' : ''} ${cell.disabled ? 'is-disabled' : ''}"
                  tabindex="${this._isActive(ri, ci) ? '0' : '-1'}"
                  aria-selected="${cell.selected ? 'true' : nothing}"
                  aria-disabled="${cell.disabled ? 'true' : nothing}"
                  aria-label="${cell.label}"
                  data-row="${ri}"
                  data-col="${ci}"
                  style="${cell.background ? `--cell-bg:${cell.background};` : ''}${cell.foreground ? `--cell-fg:${cell.foreground};` : ''}"
                  @keydown="${(e: KeyboardEvent) => this._onKeydown(e, ri, ci)}"
                  @click="${() => this._onClick(ri, ci)}"
                  @focus="${() => this._onFocus(ri, ci)}"
                >
                  <span class="data-grid__cell-inner" aria-hidden="true">
                    ${this.showLabels ? html`<span class="data-grid__cell-label">${cell.label}</span>` : nothing}
                    ${cell.selected ? html`<span class="data-grid__check">✓</span>` : nothing}
                  </span>
                </td>
              `)}
            </tr>
          `)}
        </tbody>
      </table>
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">${this._announcement}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'candor-data-grid': CandorDataGrid; }
}
