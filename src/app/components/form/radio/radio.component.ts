import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [NgClass],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() value: any;
  @Input() name?: string;
  @Input() disabled: boolean = false;
  @Input() id?: string;

  selectedValue: any;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onRadioChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedValue = this.value;
      this.onChange(this.selectedValue);
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  get isChecked(): boolean {
    return this.selectedValue === this.value;
  }

  get radioId(): string {
    return this.id || `radio-${Math.random().toString(36).substr(2, 9)}`;
  }
}
