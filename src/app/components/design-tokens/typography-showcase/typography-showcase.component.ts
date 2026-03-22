import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

interface FontFamily {
  name: string;
  variable: string;
  voice: string;
  mode: 'Execution' | 'Interpretation';
  use: string;
  specimen: string;
}

interface TypeStep {
  token: string;
  size: string;
  px: string;
  use: string;
  isFloor?: boolean;
  isDecorative?: boolean;
}

@Component({
  selector: 'app-typography-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './typography-showcase.component.html',
  styleUrl: './typography-showcase.component.scss',
})
export class TypographyShowcaseComponent {
  fontFamilies: FontFamily[] = [
    {
      name: 'Roboto Flex',
      variable: '--font-family-base',
      voice: 'Structural Sans',
      mode: 'Execution',
      use: 'Navigation, UI scaffolding, data-dense components',
      specimen: 'ABCDEFGHIJKLM\nNOPQRSTUVWXYZ\n0123456789',
    },
    {
      name: 'Roboto Mono',
      variable: '--font-family-mono',
      voice: 'Technical Mono',
      mode: 'Execution',
      use: 'Code, logs, terminal environments',
      specimen: 'oklch(0.27 0.06 245)\nconst ratio = fg / bg\n0123456789',
    },
    {
      name: 'Atkinson Hyperlegible',
      variable: '--font-family-accessible',
      voice: 'Accessibility Anchor',
      mode: 'Execution',
      use: 'Critical UI, form labels, high-contrast environments',
      specimen: 'rn il 0O 1Il —\nDisambiguation by design',
    },
    {
      name: 'Noto Serif',
      variable: '--font-family-serif',
      voice: 'Human-Centered Serif',
      mode: 'Interpretation',
      use: 'Long-form reading, articles, body prose',
      specimen: 'Good design tells the truth\nabout what actually works.',
    },
    {
      name: 'Noto Sans',
      variable: '--font-family-reading',
      voice: 'Human-Centered Sans',
      mode: 'Interpretation',
      use: 'Conversational UI, multilingual content',
      specimen: 'Accessibility is the baseline,\nnot the finish line.',
    },
  ];

  typeScale: TypeStep[] = [
    { token: '--font-size-3xl', size: '2.441rem', px: '39px', use: 'Display / h1' },
    { token: '--font-size-2xl', size: '1.953rem', px: '31px', use: 'Section heading / h2' },
    { token: '--font-size-xl',  size: '1.5625rem', px: '25px', use: 'Subsection / h3' },
    { token: '--font-size-lg',  size: '1.25rem',   px: '20px', use: 'Minor heading / h4' },
    { token: '--font-size-md',  size: '1rem',      px: '16px', use: 'Body text (base)' },
    { token: '--font-size-sm',  size: '0.875rem',  px: '14px', use: 'UI labels, captions — floor', isFloor: true },
    { token: '--font-size-xs',  size: '0.75rem',   px: '12px', use: 'Decorative / non-text only', isDecorative: true },
  ];
}
