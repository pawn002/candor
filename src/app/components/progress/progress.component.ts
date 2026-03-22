import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type ProgressType = 'bar' | 'spinner';
type ProgressSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (type() === 'bar') {
      <div class="progress-bar-wrapper">
        @if (label()) {
          <div class="progress-bar__label" id="{{ barLabelId }}">{{ label() }}</div>
        }
        <div
          class="progress-bar"
          role="progressbar"
          [attr.aria-valuenow]="indeterminate() ? null : value()"
          [attr.aria-valuemin]="indeterminate() ? null : 0"
          [attr.aria-valuemax]="indeterminate() ? null : 100"
          [attr.aria-valuetext]="indeterminate() ? null : valueText()"
          [attr.aria-label]="label() || 'Loading'"
          [attr.aria-labelledby]="label() ? barLabelId : null"
        >
          <div
            class="progress-bar__fill"
            [class.progress-bar__fill--indeterminate]="indeterminate()"
            [style.width]="indeterminate() ? null : value() + '%'"
          ></div>
        </div>
      </div>
    } @else {
      <svg
        class="spinner"
        [class]="'spinner spinner--' + size()"
        role="status"
        [attr.aria-label]="label() || 'Loading'"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{{ label() || 'Loading' }}</title>
        <circle
          class="spinner__track"
          cx="22" cy="22" r="18"
          stroke-width="4"
        />
        <circle
          class="spinner__arc"
          cx="22" cy="22" r="18"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>
    }
  `,
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent {
  type = input<ProgressType>('bar');
  value = input<number>(0);
  indeterminate = input(false);
  label = input('');
  size = input<ProgressSize>('md');

  protected barLabelId = `progress-label-${Math.random().toString(36).substr(2, 9)}`;

  protected valueText = computed(() => `${Math.round(this.value())}%`);
}
