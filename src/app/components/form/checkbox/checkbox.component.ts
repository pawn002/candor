import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  // Signal inputs — pure display config
  label = input<string>();
  id = input<string>();
  required = input(false);
  name = input<string>();

  // Decorator inputs — mutable by ControlValueAccessor
  @Input() checked = false;
  @Input() disabled = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);
  private _generatedId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  writeValue(value: boolean): void {
    this.checked = value || false;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChange(this.checked);
  }

  onBlur(): void {
    this.onTouched();
  }

  get checkboxId(): string {
    return this.id() || this._generatedId;
  }
}
