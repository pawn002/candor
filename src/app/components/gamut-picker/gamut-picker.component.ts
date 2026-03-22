import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { GridCell, GridRow } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-gamut-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './gamut-picker.component.scss',
  host: { '(keydown)': 'onKeydown($event)' },
  template: `
    <table
      role="grid"
      [attr.aria-label]="ariaLabel() || caption() || 'Gamut picker'"
      class="gamut-grid"
    >
      <thead>
        <tr>
          <td class="corner"></td>
          @for (header of columnHeaders(); track header) {
            <th scope="col" role="columnheader" class="col-header">{{ header }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.rowHeader; let ri = $index) {
          <tr role="row">
            <th scope="row" role="rowheader" class="row-header">{{ row.rowHeader }}</th>
            @for (cell of row.cells; track $index; let ci = $index) {
              <td role="gridcell" class="cell">
                @if (!cell.disabled) {
                  <button
                    class="cell-btn"
                    [attr.data-row]="ri"
                    [attr.data-col]="ci"
                    [tabindex]="ri === focusedRow() && ci === focusedCol() ? 0 : -1"
                    [style.background]="cell.background"
                    [attr.aria-label]="cell.label"
                    [attr.aria-pressed]="ri === selectedRow() && ci === selectedCol()"
                    (click)="activate(ri, ci, cell)"
                  ></button>
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>

    <div class="preview" aria-live="polite">
      @if (selectedColor()) {
        <span
          class="preview-swatch"
          [style.background]="selectedColor()"
          aria-hidden="true"
        ></span>
        <code class="preview-code">{{ selectedColor() }}</code>
      } @else {
        <span class="preview-empty">No color selected</span>
      }
    </div>

    <p class="hint">Arrow keys navigate · Enter or Space activates · Blank cells are outside sRGB gamut</p>
  `,
})
export class GamutPickerComponent implements OnInit {
  private el = inject(ElementRef) as ElementRef<HTMLElement>;

  // Inputs
  rows = input.required<GridRow[]>();
  columnHeaders = input.required<string[]>();
  caption = input<string>('');
  ariaLabel = input<string>('');

  // Output
  colorSelect = output<string>();

  // Internal state
  focusedRow = signal(0);
  focusedCol = signal(0);
  selectedRow = signal(-1);
  selectedCol = signal(-1);
  selectedColor = signal<string | null>(null);

  ngOnInit(): void {
    const { r, c } = this.findFirstInGamut();
    this.focusedRow.set(r);
    this.focusedCol.set(c);
  }

  activate(ri: number, ci: number, cell: GridCell): void {
    this.focusedRow.set(ri);
    this.focusedCol.set(ci);
    this.selectedRow.set(ri);
    this.selectedCol.set(ci);
    const v = cell.value as { l: number; c: number; h: number };
    const oklch = `oklch(${v.l.toFixed(2)} ${v.c.toFixed(3)} ${v.h})`;
    this.selectedColor.set(oklch);
    this.colorSelect.emit(oklch);
    this.focusButton(ri, ci);
  }

  onKeydown(e: KeyboardEvent): void {
    const nav: Record<string, [number, number]> = {
      ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
    };
    if (nav[e.key]) {
      e.preventDefault();
      const [dr, dc] = nav[e.key];
      this.step(dr, dc);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.jumpRowEdge(false);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.jumpRowEdge(true);
    } else if (e.key === 'Enter' || e.key === ' ') {
      const r = this.focusedRow();
      const c = this.focusedCol();
      const cell = this.rows()[r]?.cells[c];
      if (cell && !cell.disabled) {
        e.preventDefault();
        this.activate(r, c, cell);
      }
    }
  }

  private step(dr: number, dc: number): void {
    const numRows = this.rows().length;
    const numCols = this.rows()[0].cells.length;
    let r = this.focusedRow() + dr;
    let c = this.focusedCol() + dc;
    while (r >= 0 && r < numRows && c >= 0 && c < numCols) {
      if (!this.rows()[r].cells[c].disabled) {
        this.focusedRow.set(r);
        this.focusedCol.set(c);
        this.focusButton(r, c);
        return;
      }
      r += dr;
      c += dc;
    }
  }

  private jumpRowEdge(toEnd: boolean): void {
    const r = this.focusedRow();
    const cells = this.rows()[r].cells;
    if (toEnd) {
      for (let c = cells.length - 1; c >= 0; c--) {
        if (!cells[c].disabled) { this.focusedCol.set(c); this.focusButton(r, c); return; }
      }
    } else {
      for (let c = 0; c < cells.length; c++) {
        if (!cells[c].disabled) { this.focusedCol.set(c); this.focusButton(r, c); return; }
      }
    }
  }

  private focusButton(r: number, c: number): void {
    const btn = this.el.nativeElement.querySelector<HTMLButtonElement>(
      `[data-row="${r}"][data-col="${c}"]`
    );
    btn?.focus();
  }

  private findFirstInGamut(): { r: number; c: number } {
    const rows = this.rows();
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < rows[r].cells.length; c++) {
        if (!rows[r].cells[c].disabled) return { r, c };
      }
    }
    return { r: 0, c: 0 };
  }
}
