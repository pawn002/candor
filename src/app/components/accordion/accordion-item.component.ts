import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

let _counter = 0;

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
})
export class AccordionItemComponent implements OnInit {
  @Input() title = '';
  @Input() initiallyExpanded = false;

  @Output() expandedChange = new EventEmitter<boolean>();

  expanded = false;

  readonly headerId = `accordion-trigger-${++_counter}`;
  readonly panelId  = `accordion-panel-${_counter}`;

  ngOnInit(): void {
    this.expanded = this.initiallyExpanded;
  }

  toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}
