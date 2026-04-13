import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  model,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ListboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

let nextId = 0;

@Component({
  selector: 'app-listbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="listbox-wrapper" [class.listbox-wrapper--disabled]="isDisabled">
      @if (label()) {
        <label [id]="labelId" class="listbox__label">
          {{ label() }}
          @if (required()) {
            <span class="listbox__required" aria-hidden="true">*</span>
          }
        </label>
      }

      <!-- Trigger button -->
      <button
        #trigger
        type="button"
        class="listbox__trigger"
        [id]="triggerId"
        [disabled]="isDisabled"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="listboxId"
        [attr.aria-labelledby]="label() ? (labelId + ' ' + triggerId) : null"
        [attr.aria-describedby]="descriptionId"
        [class.listbox__trigger--error]="error()"
        (click)="toggle()"
        (keydown)="onTriggerKeydown($event)"
      >
        <span class="listbox__trigger-text">{{ selectedLabel() }}</span>
        <i
          class="ph-bold ph-caret-down listbox__caret"
          [class.listbox__caret--open]="isOpen()"
          aria-hidden="true"
        ></i>
      </button>

      <!-- Dropdown listbox -->
      @if (isOpen()) {
        <div
          #listbox
          class="listbox__dropdown"
          role="listbox"
          [id]="listboxId"
          [attr.aria-labelledby]="label() ? labelId : triggerId"
          [attr.aria-activedescendant]="activeDescendantId() || null"
          tabindex="0"
          (keydown)="onListboxKeydown($event)"
        >
          @for (option of options(); track option.value) {
            <div
              class="listbox__option"
              role="option"
              [id]="optionId(option.value)"
              [attr.aria-selected]="option.value === value()"
              [attr.aria-disabled]="option.disabled ? 'true' : null"
              [class.listbox__option--active]="option.value === activeValue()"
              [class.listbox__option--selected]="option.value === value()"
              [class.listbox__option--disabled]="option.disabled"
              (click)="onOptionClick(option)"
              (mouseenter)="onOptionMouseenter(option)"
            >
              <span class="listbox__option-label">{{ option.label }}</span>
              @if (option.value === value()) {
                <i class="ph ph-check listbox__option-check" aria-hidden="true"></i>
              }
            </div>
          }
        </div>
      }

      <!-- Error / hint — always in DOM so aria-live announces changes -->
      <div
        [id]="descriptionId"
        class="listbox__description"
        aria-live="polite"
        aria-atomic="true"
      >
        @if (error()) {
          <span class="listbox__error">{{ error() }}</span>
        } @else if (hint()) {
          <span class="listbox__hint">{{ hint() }}</span>
        }
      </div>
    </div>
  `,
  styleUrls: ['./listbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListboxComponent),
      multi: true,
    },
  ],
})
export class ListboxComponent implements ControlValueAccessor, OnDestroy {
  options = input<ListboxOption[]>([]);
  label = input('');
  placeholder = input('Select an option');
  error = input('');
  hint = input('');
  required = input(false);
  value = model('');

  isOpen = signal(false);
  activeValue = signal('');
  isDisabled = false;

  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private listboxRef = viewChild<ElementRef<HTMLDivElement>>('listbox');

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _typeaheadBuffer = '';
  private _typeaheadTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly _id = nextId++;
  readonly labelId = `listbox-label-${this._id}`;
  readonly triggerId = `listbox-trigger-${this._id}`;
  readonly listboxId = `listbox-popup-${this._id}`;
  readonly descriptionId = `listbox-desc-${this._id}`;

  selectedLabel = computed(() => {
    const match = this.options().find(o => o.value === this.value());
    return match ? match.label : this.placeholder();
  });

  activeDescendantId = computed(() =>
    this.activeValue() ? this.optionId(this.activeValue()) : ''
  );

  optionId(value: string): string {
    return `${this.listboxId}-opt-${value}`;
  }

  // ── Open / close ───────────────────────────────────────────────────────

  openDropdown(initialActive?: string): void {
    if (this.isDisabled) return;
    this.isOpen.set(true);
    // Wait for Angular to render the listbox DOM, then focus it
    requestAnimationFrame(() => {
      const active = initialActive ?? this.value() ?? this.firstEnabled()?.value ?? '';
      this.activeValue.set(active);
      this.listboxRef()?.nativeElement.focus();
      this.scrollActiveIntoView();
      this.cdr.markForCheck();
    });
  }

  closeDropdown(returnFocus = true): void {
    this.isOpen.set(false);
    this.activeValue.set('');
    if (returnFocus) {
      this.triggerRef()?.nativeElement.focus();
    }
  }

  toggle(): void {
    this.isOpen() ? this.closeDropdown() : this.openDropdown();
  }

  // ── Selection ─────────────────────────────────────────────────────────

  selectOption(option: ListboxOption): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this._onChange(option.value);
    this._onTouched();
    this.closeDropdown();
  }

  onOptionClick(option: ListboxOption): void {
    this.selectOption(option);
  }

  onOptionMouseenter(option: ListboxOption): void {
    if (!option.disabled) this.activeValue.set(option.value);
  }

  // ── Keyboard — trigger ────────────────────────────────────────────────

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openDropdown(this.lastEnabled()?.value);
        break;
    }
  }

  // ── Keyboard — listbox ────────────────────────────────────────────────

  onListboxKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = this.nextEnabled(this.activeValue(), 1);
        if (next) {
          this.activeValue.set(next);
          this.scrollActiveIntoView();
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = this.nextEnabled(this.activeValue(), -1);
        if (prev) {
          this.activeValue.set(prev);
          this.scrollActiveIntoView();
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        const first = this.firstEnabled();
        if (first) {
          this.activeValue.set(first.value);
          this.scrollActiveIntoView();
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        const last = this.lastEnabled();
        if (last) {
          this.activeValue.set(last.value);
          this.scrollActiveIntoView();
        }
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const active = this.options().find(o => o.value === this.activeValue());
        if (active) this.selectOption(active);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown(false);
        break;
      default:
        // Typeahead: single printable character
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          this.handleTypeahead(event.key);
        }
    }
  }

  // ── Typeahead ─────────────────────────────────────────────────────────

  private handleTypeahead(char: string): void {
    this._typeaheadBuffer += char.toLowerCase();
    if (this._typeaheadTimeout) clearTimeout(this._typeaheadTimeout);
    this._typeaheadTimeout = setTimeout(() => {
      this._typeaheadBuffer = '';
    }, 500);

    const match = this.options().find(
      o => !o.disabled && o.label.toLowerCase().startsWith(this._typeaheadBuffer)
    );
    if (match) {
      this.activeValue.set(match.value);
      this.scrollActiveIntoView();
      this.cdr.markForCheck();
    }
  }

  // ── Navigation helpers ─────────────────────────────────────────────────

  private firstEnabled(): ListboxOption | undefined {
    return this.options().find(o => !o.disabled);
  }

  private lastEnabled(): ListboxOption | undefined {
    return [...this.options()].reverse().find(o => !o.disabled);
  }

  private nextEnabled(currentValue: string, direction: 1 | -1): string | null {
    const opts = this.options();
    const idx = opts.findIndex(o => o.value === currentValue);
    let i = idx + direction;
    while (i >= 0 && i < opts.length) {
      if (!opts[i].disabled) return opts[i].value;
      i += direction;
    }
    return null;
  }

  private scrollActiveIntoView(): void {
    requestAnimationFrame(() => {
      const el = this.listboxRef()?.nativeElement?.querySelector(
        `[id="${this.optionId(this.activeValue())}"]`
      ) as HTMLElement | null;
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  // ── Click outside ─────────────────────────────────────────────────────

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown(false);
      this._onTouched();
    }
  }

  // ── Focus outside — catches keyboard navigation away from component ───

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusin(event: FocusEvent): void {
    if (!this.isOpen()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown(false);
      this._onTouched();
    }
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────

  writeValue(val: string): void {
    this.value.set(val ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this._typeaheadTimeout) clearTimeout(this._typeaheadTimeout);
  }
}
