import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type CardVariant = 'default' | 'elevated' | 'outlined';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class]="'card card--' + variant() + ' card--padding-' + padding()">
      <div class="card__header">
        <ng-content select="[slot=header]"></ng-content>
      </div>
      <div class="card__body">
        <ng-content></ng-content>
      </div>
      <div class="card__footer">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  variant = input<CardVariant>('default');
  padding = input<CardPadding>('md');
}
