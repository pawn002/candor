import { Component, Input } from '@angular/core';

type StatColor = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-stat',
  standalone: true,
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  host: { '[attr.data-color]': 'color' },
})
export class StatComponent {
  @Input() value: string | number = '';
  @Input() unit?: string;
  @Input() label?: string;
  @Input() color: StatColor = 'default';
}
