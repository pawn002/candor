import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-input",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: "text" | "email" | "password" | "number" = "text";
  @Input() placeholder?: string;
  @Input() disabled: boolean = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() required: boolean = false;
  @Input() id?: string;

  value: string = "";

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private _generatedId: string;

  constructor() {
    this._generatedId = `input-${Math.random().toString(36).substr(2, 9)}`;
  }

  writeValue(value: string): void {
    this.value = value || "";
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get inputId(): string {
    return this.id || this._generatedId;
  }
}
