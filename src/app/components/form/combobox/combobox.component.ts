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
import type { ListboxOption } from '../listbox/listbox.component';

let nextId = 0;

@Component({
  selector: 'app-combobox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="combobox-wrapper" [class.combobox-wrapper--disabled]="isDisabled">
      @if (label()) {
        <label [id]="labelId" [for]="inputId" class="combobox__label">
          {{ label() }}
          @if (required()) {
            <span class="combobox__required" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="combobox__control" [class.combobox__control--error]="error()">
        <input
          #inputEl
          type="text"
          class="combobox__input"
          [id]="inputId"
          role="combobox"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-controls]="listboxId"
          [attr.aria-activedescendant]="activeDescendantId() || null"
          [attr.aria-labelledby]="label() ? labelId : null"
          [attr.aria-describedby]="descriptionId"
          aria-autocomplete="list"
          [value]="inputText()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled"
          autocomplete="off"
          spellcheck="false"
          (input)="onInput($event)"
          (keydown)="onKeydown($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        >

        <!-- Clear button when text is present; caret otherwise -->
        @if (inputText() && !isDisabled) {
          <button
            type="button"
            class="combobox__clear"
            aria-label="Clear"
            tabindex="-1"
            (mousedown)="$event.preventDefault()"
            (click)="clear()"
          >
            <i class="ph ph-x" aria-hidden="true"></i>
          </button>
        } @else {
          <i
            class="ph-bold ph-caret-down combobox__caret"
            [class.combobox__caret--open]="isOpen()"
            aria-hidden="true"
          ></i>
        }
      </div>

      <!-- Dropdown -->
      @if (isOpen()) {
        <div
          class="combobox__dropdown"
          role="listbox"
          [id]="listboxId"
          [attr.aria-labelledby]="label() ? labelId : inputId"
        >
          @if (filteredOptions().length === 0) {
            <div class="combobox__no-results" role="option" aria-disabled="true">
              No options match "{{ inputText() }}"
            </div>
          } @else {
            @for (option of filteredOptions(); track option.value) {
              <div
                class="combobox__option"
                role="option"
                [id]="optionId(option.value)"
                [attr.aria-selected]="option.value === value()"
                [class.combobox__option--active]="option.value === activeValue()"
                [class.combobox__option--selected]="option.value === value()"
                (mousedown)="$event.preventDefault()"
                (click)="selectOption(option)"
                (mouseenter)="activeValue.set(option.value)"
              >
                <span class="combobox__option-label">{{ option.label }}</span>
                @if (option.value === value()) {
                  <i class="ph ph-check combobox__option-check" aria-hidden="true"></i>
                }
              </div>
            }
          }
        </div>
      }

      <!-- Error / hint — always in DOM so aria-live announces changes -->
      <div
        [id]="descriptionId"
        class="combobox__description"
        aria-live="polite"
        aria-atomic="true"
      >
        @if (error()) {
          <span class="combobox__error">{{ error() }}</span>
        } @else if (hint()) {
          <span class="combobox__hint">{{ hint() }}</span>
        }
      </div>
    </div>
  `,
  styleUrls: ['./combobox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
})
export class ComboboxComponent implements ControlValueAccessor, OnDestroy {
  options = input<ListboxOption[]>([]);
  label = input('');
  placeholder = input('Search…');
  error = input('');
  hint = input('');
  required = input(false);
  value = model('');

  /** Text currently in the input field — may differ from selected option label while typing. */
  inputText = signal('');
  isOpen = signal(false);
  activeValue = signal('');
  isDisabled = false;

  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  private readonly _id = nextId++;
  readonly labelId = `combobox-label-${this._id}`;
  readonly inputId = `combobox-input-${this._id}`;
  readonly listboxId = `combobox-listbox-${this._id}`;
  readonly descriptionId = `combobox-desc-${this._id}`;

  filteredOptions = computed(() => {
    const text = this.inputText().toLowerCase().trim();
    if (!text) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(text));
  });

  activeDescendantId = computed(() =>
    this.activeValue() ? this.optionId(this.activeValue()) : ''
  );

  optionId(value: string): string {
    return `${this.listboxId}-opt-${value}`;
  }

  // ── Input events ──────────────────────────────────────────────────────

  onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputText.set(text);
    this.activeValue.set('');
    // Clear selected value when user modifies the input
    if (this.value()) {
      this.value.set('');
      this._onChange('');
    }
    this.isOpen.set(true);
  }

  onFocus(): void {
    // Open on focus if there are options — show full list when input is empty
    if (!this.isOpen() && this.options().length > 0) {
      this.isOpen.set(true);
    }
  }

  onBlur(): void {
    // Defer slightly so option (click) can fire before we process blur.
    // The mousedown.preventDefault() on options prevents blur from firing
    // during mouse clicks on options, so this path is typically only reached
    // when the user tabs away or clicks outside the component.
    setTimeout(() => {
      if (this.elementRef.nativeElement.contains(document.activeElement)) return;
      this.closeDropdown();
      this._onTouched();
      this.cdr.markForCheck();
    }, 0);
  }

  // ── Keyboard ──────────────────────────────────────────────────────────

  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
          break;
        }
        const next = this.nextActive(1);
        if (next) this.activeValue.set(next);
        this.scrollActiveIntoView();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.isOpen()) break;
        const prev = this.nextActive(-1);
        if (prev) this.activeValue.set(prev);
        this.scrollActiveIntoView();
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (!this.isOpen()) break;
        const active = this.filteredOptions().find(o => o.value === this.activeValue());
        if (active) {
          this.selectOption(active);
        } else if (this.filteredOptions().length === 1) {
          this.selectOption(this.filteredOptions()[0]);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        if (this.isOpen()) {
          this.closeDropdown();
        } else {
          this.clear();
        }
        break;
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  // ── Selection ─────────────────────────────────────────────────────────

  selectOption(option: ListboxOption): void {
    this.value.set(option.value);
    this.inputText.set(option.label);
    this.activeValue.set('');
    this._onChange(option.value);
    this._onTouched();
    this.closeDropdown();
    // Return focus to input after selection
    this.inputRef()?.nativeElement.focus();
  }

  clear(): void {
    this.value.set('');
    this.inputText.set('');
    this.activeValue.set('');
    this._onChange('');
    this._onTouched();
    this.isOpen.set(false);
    this.inputRef()?.nativeElement.focus();
  }

  private closeDropdown(): void {
    this.isOpen.set(false);
    this.activeValue.set('');
  }

  // ── Navigation helpers ─────────────────────────────────────────────────

  private nextActive(direction: 1 | -1): string | null {
    const opts = this.filteredOptions();
    if (opts.length === 0) return null;
    const idx = opts.findIndex(o => o.value === this.activeValue());
    if (idx === -1) {
      // Nothing active yet — go to first (down) or last (up)
      return direction === 1 ? opts[0].value : opts[opts.length - 1].value;
    }
    const next = idx + direction;
    if (next < 0 || next >= opts.length) return null;
    return opts[next].value;
  }

  private scrollActiveIntoView(): void {
    requestAnimationFrame(() => {
      const id = this.optionId(this.activeValue());
      const el = this.elementRef.nativeElement.querySelector(`[id="${id}"]`) as HTMLElement | null;
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  // ── Click outside ─────────────────────────────────────────────────────

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdown();
      this._onTouched();
    }
  }

  // ── ControlValueAccessor ──────────────────────────────────────────────

  writeValue(val: string): void {
    this.value.set(val ?? '');
    // Sync the display text with the option label, if a match exists
    const match = this.options().find(o => o.value === val);
    this.inputText.set(match ? match.label : (val ?? ''));
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
    // Nothing to clean up — HostListeners are removed automatically
  }
}
