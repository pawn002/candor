import { Component, Input, ViewEncapsulation } from '@angular/core';

type ArticleFont = 'reading' | 'serif';

@Component({
  selector: 'app-article',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"article article--font-" + font',
  },
})
export class ArticleComponent {
  @Input() font: ArticleFont = 'reading';
}
