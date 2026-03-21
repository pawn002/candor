import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  host: {
    // Drives the CSS fill gradient via custom property — lets SCSS handle
    // the filled/unfilled split without constructing strings in TypeScript.
    '[style.--fill-percent]': 'fillPercent + "%"',
  },
})
export class SliderComponent {
  @Input() min = 0;
  @Input() max = 1;
  @Input() step = 0.001;
  @Input() value = 0;
  @Input() label?: string;
  @Input() disabled = false;

  // Optional CSS gradient string for the track background.
  // When provided, overrides the default filled/unfilled treatment.
  // Primary use case: color tool lightness sliders (OKLCH gradient along L-axis).
  @Input() gradient?: string;

  @Output() valueChange = new EventEmitter<number>();

  private static _counter = 0;
  readonly sliderId = `slider-${++SliderComponent._counter}`;

  get fillPercent(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.value = parseFloat(el.value);
    this.valueChange.emit(this.value);
  }
}
