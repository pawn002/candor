import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

export interface GridCell {
  /** Accessible label — used as aria-label and optionally as visible text */
  label: string;
  /** Value emitted on activation */
  value?: unknown;
  /** CSS color for cell background */
  background?: string;
  /** CSS color for cell foreground (label text) */
  foreground?: string;
  /** Whether this cell represents the current selection */
  selected?: boolean;
  /** Whether this cell is non-interactive */
  disabled?: boolean;
}

export interface GridRow {
  /** Row header label (rendered as rowheader th) */
  rowHeader?: string;
  cells: GridCell[];
}

export interface GridCellActivateEvent {
  rowIndex: number;
  colIndex: number;
  cell: GridCell;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss',
})
export class DataGridComponent {
  @Input() rows: GridRow[] = [];
  @Input() columnHeaders: string[] = [];
  /** Visible caption rendered above the grid */
  @Input() caption?: string;
  /** aria-label when no visible caption is present */
  @Input('aria-label') ariaLabel?: string;
  /** Whether to show cell labels as visible text inside each cell */
  @Input() showLabels = false;
  /**
   * Hides row and column headers visually while keeping them in the DOM
   * for assistive technology. Use when the cell content (e.g. color) communicates
   * the axis data visually and headers would be redundant for sighted users.
   */
  @Input() hideHeaders = false;

  @Output() cellActivate = new EventEmitter<GridCellActivateEvent>();

  @ViewChildren('gridcell') gridcellRefs!: QueryList<ElementRef<HTMLElement>>;

  focusedRow = 0;
  focusedCol = 0;

  isActive(row: number, col: number): boolean {
    return this.focusedRow === row && this.focusedCol === col;
  }

  onKeydown(event: KeyboardEvent, row: number, col: number): void {
    const maxRow = this.rows.length - 1;
    const maxCol = (this.rows[row]?.cells.length ?? 1) - 1;

    let nextRow = row;
    let nextCol = col;
    let handled = true;

    switch (event.key) {
      case 'ArrowRight':
        nextCol = Math.min(col + 1, maxCol);
        break;
      case 'ArrowLeft':
        nextCol = Math.max(col - 1, 0);
        break;
      case 'ArrowDown':
        nextRow = Math.min(row + 1, maxRow);
        break;
      case 'ArrowUp':
        nextRow = Math.max(row - 1, 0);
        break;
      case 'Home':
        nextCol = 0;
        if (event.ctrlKey) nextRow = 0;
        break;
      case 'End':
        nextCol = (this.rows[row]?.cells.length ?? 1) - 1;
        if (event.ctrlKey) {
          nextRow = maxRow;
          nextCol = (this.rows[maxRow]?.cells.length ?? 1) - 1;
        }
        break;
      case 'Enter':
      case ' ':
        this.activate(row, col);
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      if (nextRow !== row || nextCol !== col) {
        this.moveFocus(nextRow, nextCol);
      }
    }
  }

  onClick(row: number, col: number): void {
    this.moveFocus(row, col);
    this.activate(row, col);
  }

  onFocus(row: number, col: number): void {
    // Sync state when focus arrives via Tab (not arrow key)
    this.focusedRow = row;
    this.focusedCol = col;
  }

  private moveFocus(row: number, col: number): void {
    this.focusedRow = row;
    this.focusedCol = col;

    const target = this.gridcellRefs.find(
      (ref) =>
        ref.nativeElement.dataset['row'] === String(row) &&
        ref.nativeElement.dataset['col'] === String(col),
    );
    target?.nativeElement.focus();
  }

  private activate(row: number, col: number): void {
    const cell = this.rows[row]?.cells[col];
    if (cell && !cell.disabled) {
      this.cellActivate.emit({ rowIndex: row, colIndex: col, cell });
    }
  }
}
