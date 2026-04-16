import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

// Selector for interactive controls that participate in roving tabindex.
// role="separator" elements are non-interactive and skipped automatically
// because they carry no native focusable behaviour.
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="checkbox"]:not([aria-disabled="true"])',
  '[role="radio"]:not([aria-disabled="true"])',
].join(', ');

let nextId = 0;

@Component({
  selector: 'app-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="toolbar"
      [id]="toolbarId"
      [class]="'toolbar' + (orientation() === 'vertical' ? ' toolbar--vertical' : '')"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
      [attr.aria-orientation]="orientation()"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  ariaLabel = input('');
  ariaLabelledBy = input('');
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly toolbarId = `toolbar-${nextId++}`;

  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    // Set up roving tabindex after content is projected and rendered.
    afterNextRender(() => this.initTabindexes());
  }

  // ── Roving tabindex ──────────────────────────────────────────────────────

  private getItems(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll(FOCUSABLE_SELECTOR)
    ) as HTMLElement[];
  }

  private initTabindexes(): void {
    const items = this.getItems();
    // First item enters the tab sequence; all others are skipped.
    items.forEach((item, i) => item.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  }

  // ── Keyboard navigation ──────────────────────────────────────────────────

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const isHorizontal = this.orientation() === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    if (![prevKey, nextKey, 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();

    const items = this.getItems();
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement as HTMLElement);
    if (current === -1) return;

    let target = current;
    if (event.key === nextKey) target = Math.min(current + 1, items.length - 1);
    if (event.key === prevKey) target = Math.max(current - 1, 0);
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = items.length - 1;

    if (target !== current) {
      items[current].setAttribute('tabindex', '-1');
      items[target].setAttribute('tabindex', '0');
      items[target].focus();
    }
  }

  // ── Focus tracking ───────────────────────────────────────────────────────
  // Keeps the roving tabindex in sync when a user clicks directly on an item
  // that currently has tabindex="-1".

  @HostListener('focusin', ['$event'])
  onFocusin(event: FocusEvent): void {
    const items = this.getItems();
    const focused = event.target as HTMLElement;
    if (!items.includes(focused)) return;
    items.forEach(item => item.setAttribute('tabindex', item === focused ? '0' : '-1'));
  }
}
