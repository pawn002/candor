import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface SpacingItem {
  name: string;
  value: string;
  pixels: string;
}

@Component({
  selector: 'app-spacing-showcase',
  standalone: true,
  imports: [NgFor],
  templateUrl: './spacing-showcase.component.html',
  styleUrls: ['./spacing-showcase.component.scss']
})
export class SpacingShowcaseComponent {
  spacings: SpacingItem[] = [
    { name: 'xs', value: '0.5rem', pixels: '8px' },
    { name: 'sm', value: '1rem', pixels: '16px' },
    { name: 'md', value: '1.5rem', pixels: '24px' },
    { name: 'lg', value: '2rem', pixels: '32px' },
    { name: 'xl', value: '3rem', pixels: '48px' },
    { name: '2xl', value: '4rem', pixels: '64px' },
    { name: '3xl', value: '6rem', pixels: '96px' },
  ];
}
