import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  host: {
    // Drives the CSS fill gradient via custom property — lets SCSS handle
    // the filled/unfilled split without constructing strings in TypeScript.
    '[style.--fill-percent]': 'fillPercent() + "%"',
  },
})
export class SliderComponent {
  min = input(0);
  max = input(1);
  step = input(0.001);
  // model() — two-way bindable: accepts [value] binding, emits (valueChange)
  value = model(0);
  label = input<string>();
  disabled = input(false);

  // Optional CSS gradient string for the track background.
  // When provided, overrides the default filled/unfilled treatment.
  // Primary use case: color tool lightness sliders (OKLCH gradient along L-axis).
  gradient = input<string>();

  private static _counter = 0;
  readonly sliderId = `slider-${++SliderComponent._counter}`;

  fillPercent = computed(() =>
    ((this.value() - this.min()) / (this.max() - this.min())) * 100
  );

  onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.value.set(parseFloat(el.value));
  }
}
