import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
})
export class AccordionItemComponent {
  heading = input('');
  open = input(false);
  variant = input<'default' | 'subtle' | 'quiet'>('default');
}
