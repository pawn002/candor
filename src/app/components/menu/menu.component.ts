import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';

export interface MenuItem {
  label: string;
  disabled?: boolean;
}

export type MenuEntry = MenuItem | 'separator';

@Component({
  selector: 'app-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="menu-wrapper">
      <button
        #trigger
        class="menu-trigger"
        [attr.aria-haspopup]="'menu'"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="menuId"
        (click)="toggle()"
        (keydown)="onTriggerKeydown($event)"
      >
        {{ label() }}
        <svg class="menu-trigger__chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      @if (isOpen()) {
        <ul
          [id]="menuId"
          role="menu"
          class="menu-panel"
          (keydown)="onMenuKeydown($event)"
        >
          @for (entry of entries(); track $index) {
            @if (entry === 'separator') {
              <li role="separator" class="menu-separator"></li>
            } @else {
              <li role="none">
                <button
                  #menuItem
                  role="menuitem"
                  class="menu-item"
                  [class.menu-item--disabled]="entry.disabled"
                  [attr.aria-disabled]="entry.disabled || null"
                  [tabindex]="focusedIndex() === getItemIndex($index) ? 0 : -1"
                  (click)="selectEntry(entry)"
                  (mouseenter)="onItemMouseenter($index)"
                >{{ entry.label }}</button>
              </li>
            }
          }
        </ul>
      }
    </div>
  `,
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  label = input('Options');
  entries = input<MenuEntry[]>([]);

  selected = output<MenuItem>();

  protected isOpen = signal(false);
  protected focusedIndex = signal(0);
  protected menuId = `menu-${Math.random().toString(36).substr(2, 9)}`;

  @ViewChild('trigger') triggerRef!: ElementRef<HTMLButtonElement>;
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef<HTMLButtonElement>>;

  // Maps DOM @index to item-only index (skipping separators)
  protected getItemIndex(domIndex: number): number {
    let count = 0;
    for (let i = 0; i < domIndex; i++) {
      if (this.entries()[i] !== 'separator') count++;
    }
    return count;
  }

  private get itemEntries(): MenuItem[] {
    return this.entries().filter((e): e is MenuItem => e !== 'separator');
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.focusedIndex.set(0);
    // Focus first item after render
    setTimeout(() => this.focusItem(0));
  }

  close(): void {
    this.isOpen.set(false);
    this.triggerRef.nativeElement.focus();
  }

  selectEntry(entry: MenuItem): void {
    if (entry.disabled) return;
    this.selected.emit(entry);
    this.close();
  }

  onItemMouseenter(domIndex: number): void {
    this.focusedIndex.set(this.getItemIndex(domIndex));
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.isOpen.set(true);
      this.focusedIndex.set(this.itemEntries.length - 1);
      setTimeout(() => this.focusItem(this.itemEntries.length - 1));
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    const items = this.itemEntries;
    const current = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(Math.min(current + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(Math.max(current - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        this.focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusItem(items.length - 1);
        break;
      case 'Escape':
      case 'Tab':
        this.close();
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const entry = items[current];
        if (entry) this.selectEntry(entry);
        break;
      }
    }
  }

  private focusItem(index: number): void {
    this.focusedIndex.set(index);
    const buttons = this.menuItems?.toArray();
    if (buttons?.[index]) {
      buttons[index].nativeElement.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.triggerRef.nativeElement.closest('.menu-wrapper')?.contains(event.target as Node)) {
      this.close();
    }
  }
}
