import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type TextVariant = 'body' | 'caption' | 'label';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextColor = 'primary' | 'secondary' | 'disabled';

@Component({
  selector: 'app-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent {
  variant = input<TextVariant>('body');
  size = input<TextSize>('md');
  color = input<TextColor>('primary');
  bold = input(false);
}
