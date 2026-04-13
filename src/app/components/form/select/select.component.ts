import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="select-wrapper">
      @if (label()) {
        <label [for]="selectId" class="select-label">
          {{ label() }}
          @if (required()) {
            <span class="select-required" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="select-control" [class.select-control--error]="error()" [class.select-control--disabled]="disabled">
        <select
          [id]="selectId"
          [disabled]="disabled"
          [required]="required()"
          [value]="value()"
          [class]="'select' + (error() ? ' select--error' : '') + (disabled ? ' select--disabled' : '')"
          [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-describedby]="selectId + '-description'"
          (change)="onChange($event)"
          (blur)="onTouched()"
        >
          @if (placeholder()) {
            <option value="" disabled [selected]="!value()">{{ placeholder() }}</option>
          }
          @for (option of options(); track option.value) {
            <option [value]="option.value" [disabled]="option.disabled ?? false">{{ option.label }}</option>
          }
        </select>
        <i class="ph-bold ph-caret-down select__caret" aria-hidden="true"></i>
      </div>

      <!-- Always in DOM so aria-live fires on content change -->
      <div
        [id]="selectId + '-description'"
        class="select-description"
        aria-live="polite"
        aria-atomic="true"
      >
        @if (error()) {
          <span class="select-error-message">{{ error() }}</span>
        }
        @if (!error() && hint()) {
          <span class="select-hint">{{ hint() }}</span>
        }
      </div>
    </div>
  `,
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  options = input<SelectOption[]>([]);
  label = input<string>();
  placeholder = input<string>();
  error = input<string>();
  hint = input<string>();
  required = input(false);

  value = model('');
  disabled = false;

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);
  private _generatedId = `select-${Math.random().toString(36).substr(2, 9)}`;

  get selectId(): string {
    return this._generatedId;
  }

  onChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this._onChange(val);
  }

  onTouched(): void {
    this._onTouched();
  }

  writeValue(val: string): void {
    this.value.set(val ?? '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
