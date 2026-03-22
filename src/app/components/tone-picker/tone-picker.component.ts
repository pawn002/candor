import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { GridCell, GridRow } from '../data-grid/data-grid.component';

@Component({
  selector: 'app-tone-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './tone-picker.component.scss',
  host: { '(keydown)': 'onKeydown($event)' },
  template: `
    <table
      role="grid"
      [attr.aria-label]="ariaLabel() || caption() || 'Tone picker'"
      [attr.aria-describedby]="hintId"
      class="gamut-grid"
      [class.hide-headers]="hideHeaders()"
      [class.size-small]="size() === 'small'"
    >
      <thead>
        <tr role="row">
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
              @if (!cell.disabled) {
                <td role="gridcell" class="cell">
                  <button
                    role="radio"
                    class="cell-btn"
                    [attr.data-row]="ri"
                    [attr.data-col]="ci"
                    [tabindex]="ri === focusedRow() && ci === focusedCol() ? 0 : -1"
                    [style.background]="cell.background"
                    [attr.aria-label]="cell.label"
                    [attr.aria-checked]="ri === selectedRow() && ci === selectedCol()"
                    [attr.aria-setsize]="setsize()"
                    [attr.aria-posinset]="posinset(ri, ci)"
                    (click)="activate(ri, ci, cell)"
                  ></button>
                </td>
              } @else {
                <td role="gridcell" class="cell" aria-label="Out of gamut"></td>
              }
            }
          </tr>
        }
      </tbody>
    </table>

    <!-- Announces pre-selected value on mount and selection changes to AT -->
    <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">{{ announcement() }}</div>

    <div class="ui" [class.sr-only]="hideUi()">
      <div class="preview" aria-live="polite">
        @if (selectedColor()) {
          <span
            class="preview-swatch"
            [style.background]="selectedColor()"
            aria-hidden="true"
          ></span>
          <span class="preview-code">{{ selectedColor() }}</span>
        } @else {
          <span class="preview-empty">No color selected</span>
        }
      </div>

      <p class="hint" [id]="hintId">Arrow keys navigate · Enter or Space activates · Blank cells are outside sRGB gamut</p>
    </div>
  `,
})
export class TonePickerComponent implements OnInit {
  private el = inject(ElementRef) as ElementRef<HTMLElement>;

  readonly hintId = `gamut-hint-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    effect(() => {
      const val = this.selectedValue();
      if (!val) return;
      const parsed = this.parseOklch(val);
      if (!parsed) return;
      const match = this.findCellByLC(parsed.l, parsed.c);
      if (match) {
        this.selectedRow.set(match.r);
        this.selectedCol.set(match.col);
        this.selectedColor.set(val);
        this.announcement.set(`Selected: ${val}`);
      }
    });
  }

  // Inputs
  rows = input.required<GridRow[]>();
  columnHeaders = input.required<string[]>();
  caption = input<string>('');
  ariaLabel = input<string>('');
  hideHeaders = input<boolean>(false);
  hideUi = input<boolean>(false);
  size = input<'small' | 'normal'>('normal');
  selectedValue = input<string | null>(null);

  // Output
  colorSelect = output<string>();

  // In-gamut position map — drives aria-setsize / aria-posinset on each radio button
  private inGamutPositions = computed(() => {
    const map = new Map<string, number>();
    let pos = 0;
    for (const [ri, row] of this.rows().entries()) {
      for (const [ci, cell] of row.cells.entries()) {
        if (!cell.disabled) map.set(`${ri}-${ci}`, ++pos);
      }
    }
    return { setsize: pos, map };
  });

  protected setsize = computed(() => this.inGamutPositions().setsize);

  posinset(ri: number, ci: number): number {
    return this.inGamutPositions().map.get(`${ri}-${ci}`) ?? 0;
  }

  // Internal state
  focusedRow = signal(0);
  focusedCol = signal(0);
  selectedRow = signal(-1);
  selectedCol = signal(-1);
  selectedColor = signal<string | null>(null);
  announcement = signal('');
  private edgeToggle = false;

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
    this.announcement.set(`Selected: ${oklch}`);
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
      const moved = this.step(dr, dc);
      if (!moved) {
        this.edgeToggle = !this.edgeToggle;
        this.announcement.set('Edge of gamut' + (this.edgeToggle ? '\u200B' : ''));
      }
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

  private step(dr: number, dc: number): boolean {
    const numRows = this.rows().length;
    const numCols = this.rows()[0].cells.length;
    let r = this.focusedRow() + dr;
    let c = this.focusedCol() + dc;
    while (r >= 0 && r < numRows && c >= 0 && c < numCols) {
      if (!this.rows()[r].cells[c].disabled) {
        this.focusedRow.set(r);
        this.focusedCol.set(c);
        this.focusButton(r, c);
        return true;
      }
      r += dr;
      c += dc;
    }
    return false;
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

  private parseOklch(value: string): { l: number; c: number; h: number } | null {
    const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (!m) return null;
    return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
  }

  private findCellByLC(l: number, c: number): { r: number; col: number } | null {
    const rows = this.rows();
    for (let r = 0; r < rows.length; r++) {
      for (let col = 0; col < rows[r].cells.length; col++) {
        const cell = rows[r].cells[col];
        if (cell.disabled || !cell.value) continue;
        const v = cell.value as { l: number; c: number; h: number };
        if (Math.abs(v.l - l) < 0.001 && Math.abs(v.c - c) < 0.001) {
          return { r, col };
        }
      }
    }
    return null;
  }
}
