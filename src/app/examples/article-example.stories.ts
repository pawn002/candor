import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { ArticleComponent } from '../components/typography/article/article.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { ButtonComponent } from '../components/button/button.component';
import { CardComponent } from '../components/card/card.component';

const meta: Meta = {
  title: 'Examples/Article Example',
  decorators: [
    moduleMetadata({
      imports: [NavigationComponent, ArticleComponent, BadgeComponent, ButtonComponent, CardComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const BlogPost: Story = {
  render: () => ({
    props: {
      navItems: [
        { label: 'Writing', href: '#', active: true },
        { label: 'Tools', href: '#' },
        { label: 'About', href: '#' },
      ],
    },
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page);">

        <!-- Navigation -->
        <app-navigation
          brand="Candor"
          [items]="navItems"
          orientation="horizontal">
        </app-navigation>

        <!-- Page content -->
        <div style="max-width: 42rem; margin: 0 auto; padding: 3rem 1.5rem 5rem;">

          <!-- Post header -->
          <header style="margin-bottom: 2.5rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
              <app-badge variant="default">Color</app-badge>
              <app-badge variant="default">Design Systems</app-badge>
            </div>

            <h1 style="
              font-family: var(--font-family-display);
              font-size: var(--font-size-h1);
              font-weight: var(--font-weight-bold);
              font-optical-sizing: auto;
              line-height: var(--line-height-tight);
              color: var(--color-text-default);
              margin: 0 0 1rem;
            ">Why perceptual color spaces make better design tools</h1>

            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-lg);
              color: var(--color-text-subtle);
              line-height: var(--line-height-normal);
              margin: 0 0 1.5rem;
            ">Hex values are coordinates, not colors. Moving to OKLCH changes how you think about palettes, contrast, and iteration.</p>

            <div style="
              display: flex;
              align-items: center;
              gap: 1rem;
              padding-bottom: 1.5rem;
              border-bottom: 1px solid var(--color-border-default);
              font-family: var(--font-family-accessible);
              font-size: var(--font-size-sm);
              color: var(--color-text-subtle);
              letter-spacing: 0.02em;
            ">
              <span>March 2026</span>
              <span aria-hidden="true">·</span>
              <span>6 min read</span>
            </div>
          </header>

          <!-- Article body -->
          <app-article font="reading">
            <p>When you pick a color in hex, you're giving the browser a memory address. <code>#1a6fbf</code> means "blue register 26, green register 111, blue register 191" — nothing about how bright it looks, how it relates to adjacent colors, or whether it will hold up on a dark background. The machine knows exactly what to render. You have no useful intuition about it at all.</p>

            <p>OKLCH changes that. The three values — lightness, chroma, hue — map directly to things you can reason about:</p>

            <blockquote>
              <strong>L</strong> is perceptual brightness. <strong>C</strong> is how saturated the color is. <strong>H</strong> is the angle on the color wheel. Move L up and any color gets lighter, predictably, without shifting hue. That's not true in RGB.
            </blockquote>

            <h2>The contrast problem with hex</h2>

            <p>WCAG contrast ratios are computed from relative luminance, which is derived from sRGB values through a transfer function. The result is that two colors with identical computed contrast ratios can look wildly different in perceptual weight — a saturated blue pair reads as lower contrast than a neutral gray pair at the same WCAG number.</p>

            <p>OKLCH's lightness channel is calibrated to the human visual system. When you check that two colors have a lightness difference of 0.40, you're working in a space where 0.40 means roughly the same perceptual step across all hues. This doesn't replace WCAG — you still need the ratio — but it makes building accessible palettes much less trial-and-error.</p>

            <h2>Building a palette you can actually modify</h2>

            <p>The practical advantage shows up during iteration. Suppose your brand primary is <code>oklch(0.45 0.20 250)</code> — a mid-dark navy. You need a hover state. In RGB, you'd pick a color by eye or use a tool. In OKLCH, you take L from 0.45 to 0.40 and you're done. The chroma and hue are unchanged; the relationship is explicit.</p>

            <p>The same logic applies to tonal palettes. Fix C and H, step L from 0.95 down to 0.15 in equal increments, and you have a 10-step scale where every step is a consistent perceptual distance from its neighbors. No hand-tuning, no surprises in dark mode.</p>

            <h2>Dark mode is where it pays off most</h2>

            <p>Inverting a palette for dark mode is where hex-based systems most often break down. A saturated brand color that reads well on white becomes neon on dark — not because the contrast failed, but because high chroma at high lightness creates a luminous quality that the contrast ratio doesn't capture.</p>

            <p>In OKLCH, that problem has a name and a solution. You reduce C. You might also lower L slightly. Both adjustments are one-axis operations with predictable results. The color stays recognizably itself — same hue — while losing the intensity that was making it uncomfortable to look at.</p>
          </app-article>

          <!-- Post footer -->
          <footer style="
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid var(--color-border-default);
          ">
            <app-card variant="elevated" style="display: block;">
              <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;">
                <div>
                  <p style="
                    font-family: var(--font-family-accessible);
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text-subtle);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin: 0 0 0.5rem;
                  ">Try it yourself</p>
                  <p style="
                    font-family: var(--font-family-base);
                    font-size: var(--font-size-base);
                    color: var(--color-text-default);
                    margin: 0;
                    line-height: var(--line-height-normal);
                  ">The color pair iterator lets you explore OKLCH relationships visually — adjust L, C, and H while watching contrast ratios update in real time.</p>
                </div>
                <app-button variant="primary" size="medium">Open tool</app-button>
              </div>
            </app-card>
          </footer>

        </div>
      </div>
    `,
  }),
};
