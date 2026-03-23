import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-radio",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./radio.component.html",
  styleUrls: ["./radio.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  // Signal inputs — pure display config
  label = input<string>();
  value = input<any>();
  name = input<string>();
  id = input<string>();
  // For static/story use; ControlValueAccessor takes precedence when wired
  @Input() checked = false;

  // Mutable by ControlValueAccessor
  @Input() disabled = false;
  selectedValue: any;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);
  private _generatedId = `radio-${Math.random().toString(36).substr(2, 9)}`;

  writeValue(value: any): void {
    this.selectedValue = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedValue = this.value();
      this.onChange(this.selectedValue);
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  get isChecked(): boolean {
    return this.selectedValue === this.value();
  }

  get radioId(): string {
    return this.id() || this._generatedId;
  }
}
