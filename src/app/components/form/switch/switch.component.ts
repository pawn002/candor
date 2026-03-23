import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, Input, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [class]="'switch-wrapper' + (disabled ? ' switch-wrapper--disabled' : '')" [for]="switchId">
      <input
        class="switch-input"
        type="checkbox"
        role="switch"
        [id]="switchId"
        [attr.aria-label]="ariaLabel() || null"
        [name]="name()"
        [checked]="checked"
        [disabled]="disabled"
        [required]="required()"
        (change)="onSwitchChange($event)"
        (blur)="onBlur()"
      />
      <span class="switch-track">
        <span class="switch-thumb"></span>
      </span>
      @if (label()) {
        <span class="switch-label">{{ label() }}</span>
      }
    </label>
  `,
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  label = input<string>();
  /** Accessible name when no visible label is rendered — bound directly to the <input>, not the host */
  ariaLabel = input<string>();
  id = input<string>();
  required = input(false);
  name = input<string>();

  @Input() checked = false;
  @Input() disabled = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);
  private _generatedId = `switch-${Math.random().toString(36).substr(2, 9)}`;

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

  onSwitchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChange(this.checked);
  }

  onBlur(): void {
    this.onTouched();
  }

  get switchId(): string {
    return this.id() || this._generatedId;
  }
}
