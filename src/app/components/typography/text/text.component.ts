import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type TextVariant = 'body' | 'caption' | 'label';
type TextSize = 'sm' | 'md' | 'lg';
type TextColor = 'primary' | 'secondary' | 'disabled';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [NgClass],
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  @Input() variant: TextVariant = 'body';
  @Input() size: TextSize = 'md';
  @Input() color: TextColor = 'primary';
  @Input() bold: boolean = false;
}
