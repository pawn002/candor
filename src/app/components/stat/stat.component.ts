import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type StatColor = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-stat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  host: { '[attr.data-color]': 'color()' },
})
export class StatComponent {
  value = input<string | number>('');
  unit = input<string>();
  label = input<string>();
  color = input<StatColor>('default');
}
