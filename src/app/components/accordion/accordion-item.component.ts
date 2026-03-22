import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
})
export class AccordionItemComponent {
  @Input() title = '';
  @Input() open = false;
}
