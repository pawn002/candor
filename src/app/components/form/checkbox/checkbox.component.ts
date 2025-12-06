import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-checkbox",
  standalone: true,
  imports: [NgClass],
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
  @Input() label?: string;
  @Input() disabled: boolean = false;
  @Input() id?: string;
  @Input() required: boolean = false;
  @Input() name?: string;
  @Input() checked: boolean = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};
  private _generatedId: string;

  constructor() {
    this._generatedId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  }

  writeValue(value: boolean): void {
    this.checked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
    return this.id || this._generatedId;
  }
}
