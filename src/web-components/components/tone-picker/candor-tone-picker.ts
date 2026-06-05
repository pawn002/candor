import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { observeHostAriaLabel } from '../../utils/host-aria';

export interface ToneCellValue {
  l: number;
  c: number;
  h: number;
}

export interface ToneCell {
  label: string;
  value?: ToneCellValue;
  background?: string;
  foreground?: string;
  disabled?: boolean;
}

export interface ToneRow {
  rowHeader?: string;
  cells: ToneCell[];
}

export interface ToneColorSelectDetail {
  value: string;
  row: number;
  col: number;
  l: number;
  c: number;
  h: number;
}

@customElement('candor-tone-picker')
export class CandorTonePicker extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--font-family-accessible);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .gamut-grid {
      border-collapse: collapse;
      width: auto;
    }

    .gamut-grid th,
    .gamut-grid td {
      border: 0;
      background: none;
    }

    .corner {
      padding: 0;
    }

    .col-header,
    .row-header {
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      font-weight: 400;
      color: var(--color-text-subtle);
    }

    .col-header {
      padding: var(--spacing-2xs) var(--spacing-xs);
      text-align: center;
      white-space: nowrap;
    }

    .row-header {
      padding: var(--spacing-2xs) 0.75rem var(--spacing-2xs) 0;
      text-align: right;
      white-space: nowrap;
    }

    .cell {
      padding: 3px;
      width: 3.125rem;
      height: 3.125rem;
    }

    .size-small .cell {
      width: 1.75rem;
      height: 1.75rem;
    }

    .cell-btn {
      display: block;
      width: 100%;
      height: 100%;
      border: var(--border-width-medium) solid transparent;
      border-radius: var(--radius-sm, 4px);
      cursor: pointer;
      padding: 0;
    }

    .cell-btn:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }

    .cell-btn[aria-checked='true'] {
      border-color: var(--color-focus);
      outline: var(--focus-ring-width) solid var(--color-focus);
      outline-offset: var(--focus-ring-offset);
    }

    /* Hidden-headers variant: keep semantics, remove visible chrome */
    .gamut-grid.hide-headers thead {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .gamut-grid.hide-headers .row-header,
    .gamut-grid.hide-headers .corner {
      width: 0;
      min-width: 0;
      max-width: 0;
      padding: 0;
      overflow: hidden;
      white-space: nowrap;
      clip-path: inset(50%);
    }

    .preview {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.25rem;
      min-height: var(--spacing-lg);
    }

    .preview-swatch {
      display: inline-block;
      width: var(--spacing-lg);
      height: var(--spacing-lg);
      border-radius: var(--radius-sm, 4px);
      flex-shrink: 0;
      border: var(--border-width-thin) solid var(--color-border-default);
    }

    .preview-code {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-sm);
      color: var(--color-text-default);
      background: var(--color-bg-surface);
      padding: 0.2em 0.5em;
      border-radius: var(--radius-sm);
      letter-spacing: 0.02em;
    }

    .preview-empty {
      font-size: var(--font-size-sm);
      color: var(--color-text-subtle);
      letter-spacing: 0.02em;
    }

    .hint {
      margin-top: 0.75rem;
      font-size: var(--font-size-sm);
      color: var(--color-text-subtle);
      letter-spacing: 0.02em;
    }

    /* Developer aid: show aria-label text beneath each swatch */
    .cell-inner {
      display: contents;
    }

    .cell-label {
      display: none;
    }

    :host([show-labels]) .cell {
      width: auto;
      height: auto;
      vertical-align: top;
    }

    :host([show-labels]) .cell-inner {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xs);
    }

    :host([show-labels]) .cell-btn {
      width: 3.125rem;
      height: 3.125rem;
      flex-shrink: 0;
    }

    :host([show-labels]) .size-small .cell-btn {
      width: 1.75rem;
      height: 1.75rem;
    }

    :host([show-labels]) .cell-label {
      display: block;
      width: 9rem;
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      color: var(--color-text-subtle);
      word-break: break-word;
    }
  `;

  @property({ type: Array }) rows: ToneRow[] = [];
  @property({ type: Array, attribute: 'column-headers' }) columnHeaders: string[] = [];
  @property() caption = '';
  @property({ type: Boolean, reflect: true, attribute: 'hide-headers' }) hideHeaders = false;
  @property({ type: Boolean, reflect: true, attribute: 'hide-ui' }) hideUi = false;
  @property({ type: Boolean, reflect: true, attribute: 'show-labels' }) showLabels = false;
  @property({ reflect: true }) size: 'small' | 'normal' = 'normal';
  @property({ attribute: 'selected-value' }) selectedValue: string | null = null;

  // aria-label is observed via the shared host-aria helper, which mirrors the
  // value into _ariaLabel and strips the attribute off the host so the inner
  // grid is the only element to announce the name (avoids host/inner double-
  // naming — see src/web-components/utils/host-aria.ts).
  @state() private _ariaLabel = '';
  private _stopObservingAriaLabel?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._stopObservingAriaLabel = observeHostAriaLabel(this, (value) => {
      this._ariaLabel = value;
    });
  }

  override disconnectedCallback(): void {
    this._stopObservingAriaLabel?.();
    super.disconnectedCallback();
  }

  @state() private _focusedRow = 0;
  @state() private _focusedCol = 0;
  @state() private _selectedRow = -1;
  @state() private _selectedCol = -1;
  @state() private _selectedColor: string | null = null;
  @state() private _announcement = '';

  private _edgeToggle = false;
  private _initialized = false;
  private readonly _hintId = `gamut-hint-${Math.random().toString(36).slice(2, 9)}`;

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('rows') && !this._initialized && this.rows.length) {
      const first = this._findFirstInGamut();
      this._focusedRow = first.r;
      this._focusedCol = first.c;
      this._initialized = true;
    }

    if (changed.has('selectedValue') && this.selectedValue) {
      const parsed = this._parseOklch(this.selectedValue);
      if (parsed) {
        const match = this._findCellByLC(parsed.l, parsed.c);
        if (match) {
          this._selectedRow = match.r;
          this._selectedCol = match.c;
          this._selectedColor = this.selectedValue;
          this._announcement = `Selected: ${this.selectedValue}`;
        }
      }
    }

  }

  private _inGamutMap(): { setsize: number; map: Map<string, number> } {
    const map = new Map<string, number>();
    let pos = 0;
    for (const [ri, row] of this.rows.entries()) {
      for (const [ci, cell] of row.cells.entries()) {
        if (!cell.disabled) map.set(`${ri}-${ci}`, ++pos);
      }
    }
    return { setsize: pos, map };
  }

  private _activate(ri: number, ci: number, cell: ToneCell): void {
    if (cell.disabled || !cell.value) return;
    this._focusedRow = ri;
    this._focusedCol = ci;
    this._selectedRow = ri;
    this._selectedCol = ci;
    const { l, c, h } = cell.value;
    const oklch = `oklch(${l.toFixed(2)} ${c.toFixed(3)} ${h})`;
    this._selectedColor = oklch;
    this._announcement = `Selected: ${oklch}`;
    this.dispatchEvent(new CustomEvent<ToneColorSelectDetail>('color-select', {
      detail: { value: oklch, row: ri, col: ci, l, c, h },
      bubbles: true,
      composed: true,
    }));
    this._focusButton(ri, ci);
  }

  private _onKeydown(e: KeyboardEvent): void {
    const nav: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    if (nav[e.key]) {
      e.preventDefault();
      const [dr, dc] = nav[e.key];
      const moved = this._step(dr, dc);
      if (!moved) {
        this._edgeToggle = !this._edgeToggle;
        this._announcement = 'Edge of gamut' + (this._edgeToggle ? '​' : '');
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      this._jumpRowEdge(false);
    } else if (e.key === 'End') {
      e.preventDefault();
      this._jumpRowEdge(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      const r = this._focusedRow;
      const c = this._focusedCol;
      const cell = this.rows[r]?.cells[c];
      if (cell && !cell.disabled) {
        e.preventDefault();
        this._activate(r, c, cell);
      }
    }
  }

  private _step(dr: number, dc: number): boolean {
    const numRows = this.rows.length;
    const numCols = this.rows[0]?.cells.length ?? 0;
    let r = this._focusedRow + dr;
    let c = this._focusedCol + dc;
    while (r >= 0 && r < numRows && c >= 0 && c < numCols) {
      if (!this.rows[r].cells[c].disabled) {
        this._focusedRow = r;
        this._focusedCol = c;
        this._focusButton(r, c);
        return true;
      }
      r += dr;
      c += dc;
    }
    return false;
  }

  private _jumpRowEdge(toEnd: boolean): void {
    const r = this._focusedRow;
    const cells = this.rows[r]?.cells ?? [];
    if (toEnd) {
      for (let c = cells.length - 1; c >= 0; c--) {
        if (!cells[c].disabled) {
          this._focusedCol = c;
          this._focusButton(r, c);
          return;
        }
      }
    } else {
      for (let c = 0; c < cells.length; c++) {
        if (!cells[c].disabled) {
          this._focusedCol = c;
          this._focusButton(r, c);
          return;
        }
      }
    }
  }

  private _focusButton(r: number, c: number): void {
    requestAnimationFrame(() => {
      const btn = this.shadowRoot?.querySelector<HTMLButtonElement>(
        `[data-row="${r}"][data-col="${c}"]`,
      );
      btn?.focus();
    });
  }

  private _findFirstInGamut(): { r: number; c: number } {
    for (let r = 0; r < this.rows.length; r++) {
      const cells = this.rows[r].cells;
      for (let c = 0; c < cells.length; c++) {
        if (!cells[c].disabled) return { r, c };
      }
    }
    return { r: 0, c: 0 };
  }

  private _parseOklch(value: string): { l: number; c: number; h: number } | null {
    const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (!m) return null;
    return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
  }

  private _findCellByLC(l: number, c: number): { r: number; c: number } | null {
    for (let r = 0; r < this.rows.length; r++) {
      const cells = this.rows[r].cells;
      for (let col = 0; col < cells.length; col++) {
        const cell = cells[col];
        if (cell.disabled || !cell.value) continue;
        if (
          Math.abs(cell.value.l - l) < 0.001 &&
          Math.abs(cell.value.c - c) < 0.001
        ) {
          return { r, c: col };
        }
      }
    }
    return null;
  }

  override render() {
    const { setsize, map } = this._inGamutMap();
    const labelText = this._ariaLabel || this.caption || 'Tone picker';

    return html`
      <p id="${this._hintId}" class="sr-only">
        Arrow keys navigate · Enter or Space activates · Blank cells are outside sRGB gamut
      </p>

      <div role="group" @keydown="${this._onKeydown}">
        <table
          role="grid"
          class="gamut-grid ${this.hideHeaders ? 'hide-headers' : ''} ${this.size === 'small' ? 'size-small' : ''}"
          aria-label="${labelText}"
          aria-describedby="${this._hintId}"
        >
          <thead>
            <tr role="row">
              <td class="corner" role="none"></td>
              ${this.columnHeaders.map(
                (header) => html`
                  <th scope="col" role="columnheader" class="col-header">${header}</th>
                `,
              )}
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(
              (row, ri) => html`
                <tr role="row">
                  <th scope="row" role="rowheader" class="row-header">${row.rowHeader ?? ''}</th>
                  ${row.cells.map((cell, ci) =>
                    !cell.disabled
                      ? html`
                          <td role="gridcell" class="cell">
                            <div class="cell-inner">
                              <button
                                type="button"
                                role="radio"
                                class="cell-btn"
                                data-row="${ri}"
                                data-col="${ci}"
                                tabindex="${ri === this._focusedRow && ci === this._focusedCol ? '0' : '-1'}"
                                style="${cell.background ? `background:${cell.background};` : ''}"
                                aria-label="${cell.label}"
                                aria-checked="${ri === this._selectedRow && ci === this._selectedCol ? 'true' : 'false'}"
                                aria-setsize="${setsize}"
                                aria-posinset="${map.get(`${ri}-${ci}`) ?? 0}"
                                @click="${() => this._activate(ri, ci, cell)}"
                              ></button>
                              <span class="cell-label" aria-hidden="true">${cell.label}</span>
                            </div>
                          </td>
                        `
                      : html`<td role="gridcell" class="cell" aria-label="Out of gamut"></td>`,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">${this._announcement}</div>

      <div class="ui ${this.hideUi ? 'sr-only' : ''}">
        <div class="preview">
          ${this._selectedColor
            ? html`
                <span class="preview-swatch" style="background:${this._selectedColor};" aria-hidden="true"></span>
                <span class="preview-code">${this._selectedColor}</span>
              `
            : html`<span class="preview-empty">No color selected</span>`}
        </div>
        <p class="hint">Arrow keys navigate · Enter or Space activates · Blank cells are outside sRGB gamut</p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'candor-tone-picker': CandorTonePicker;
  }
}
