import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input, input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-input",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  // Signal inputs — pure display config
  label = input<string>();
  type = input<"text" | "email" | "password" | "number">("text");
  placeholder = input<string>();
  error = input<string>();
  hint = input<string>();
  required = input(false);
  id = input<string>();
  multiline = input(false);
  rows = input(3);
  resize = input<'none' | 'vertical' | 'both'>('vertical');

  // Mutable by ControlValueAccessor
  @Input() disabled = false;
  value = "";

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);
  private _generatedId = `input-${Math.random().toString(36).substr(2, 9)}`;

  writeValue(value: string): void {
    this.value = value || "";
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get inputId(): string {
    return this.id() || this._generatedId;
  }
}
