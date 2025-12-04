import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `
    <div style="padding: 2rem;">
      <h1>Design System Playground</h1>
      <p>Your design sandbox is ready! Run Storybook to start exploring components.</p>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'design-system-playground';
}
