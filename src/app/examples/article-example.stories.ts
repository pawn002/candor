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
        <div style="max-width: 42rem; margin: 0 auto; padding: clamp(1.5rem, 5vw, 3rem) 1.5rem clamp(3rem, 8vw, 5rem);">

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

export const PostListing: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
Post listing page pattern — blog index, tag archive, or "more posts" section.

Styles live in \`tokens/candor-blog.css\` (compiled from \`src/design-tokens/blog.scss\`).
Works in any framework; no Angular dependency. Load order:

\`\`\`html
<link rel="stylesheet" href="candor-tokens.min.css">
<link rel="stylesheet" href="candor-blog.min.css">
\`\`\`

**Variants:**
- \`.post-list--grid\` — two-column responsive grid (auto-collapses to one column)
- \`.post-card--featured\` — larger title and taller image; for the lead post
- \`.post-card--compact\` — no image, tighter padding, 2-line excerpt; for sidebars / archives

**Accessibility notes:**
- Cover image link: set \`tabindex="-1"\` and \`aria-hidden="true"\` — the title \`<a>\` is the canonical keyboard target
- Use \`<ul role="list">\` with \`<li>\` + \`<article>\` for correct list semantics
- Each \`<article>\` is self-contained — screen readers can navigate by landmark
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page);">
        <app-navigation
          brand="Candor"
          [items]="[{label:'Writing',href:'#',active:true},{label:'Tools',href:'#'},{label:'About',href:'#'}]"
          orientation="horizontal">
        </app-navigation>

        <div style="max-width: 48rem; margin: 0 auto; padding: clamp(1.5rem, 5vw, 3rem) 1.5rem clamp(3rem, 8vw, 5rem);">

          <header style="margin-bottom: var(--spacing-xl);">
            <h1 style="
              font-family: var(--font-family-display);
              font-size: var(--font-size-h2);
              font-weight: var(--font-weight-bold);
              font-optical-sizing: auto;
              line-height: var(--line-height-tight);
              color: var(--color-text-default);
              margin: 0 0 var(--spacing-xs);
            ">Writing</h1>
            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-base);
              color: var(--color-text-subtle);
              margin: 0;
            ">Notes on design, cartography, accessibility, and AI.</p>
          </header>

          <!-- Post listing — uses candor-blog.css classes -->
          <ul class="post-list" role="list" style="list-style:none;padding:0;margin:0;">

            <!-- Featured post -->
            <li>
              <article class="post-card post-card--featured">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/featured/800/350" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Color</span>
                    <span class="post-card__tag">Design Systems</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Why perceptual color spaces make better design tools</a>
                  </h2>
                  <p class="post-card__excerpt">
                    Hex values are coordinates, not colors. Moving to OKLCH changes how you think about
                    palettes, contrast, and iteration — and makes programmatic accessibility validation
                    reliable in a way that RGB arithmetic never could.
                  </p>
                  <div class="post-card__meta">
                    <time class="post-card__date">March 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>6 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Standard post -->
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Accessibility</span>
                    <span class="post-card__tag">Typography</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Atkinson Hyperlegible and the problem of conspicuous accessibility</a>
                  </h2>
                  <p class="post-card__excerpt">
                    Accessibility typefaces can signal to disabled readers that something special was
                    done for them — a subtle form of othering. The question is whether designing for
                    legibility has to look like designing for legibility.
                  </p>
                  <div class="post-card__meta">
                    <time>February 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>8 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Post with cover image -->
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/maps/800/400" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Cartography</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">What map projections taught me about data visualization</a>
                  </h2>
                  <p class="post-card__excerpt">
                    Every map projection preserves some properties and distorts others. There is no
                    neutral representation. The same is true of every chart, graph, and dashboard.
                  </p>
                  <div class="post-card__meta">
                    <time>January 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Compact post (no image) -->
            <li>
              <article class="post-card post-card--compact">
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">AI Safety</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Specification gaming is a design problem</a>
                  </h2>
                  <p class="post-card__excerpt">
                    When a model finds an unintended solution to the stated objective, we call it
                    misalignment. A designer would call it a brief that didn't say what it meant.
                  </p>
                  <div class="post-card__meta">
                    <time>December 2025</time>
                    <span aria-hidden="true">·</span>
                    <span>4 min read</span>
                  </div>
                </div>
              </article>
            </li>

          </ul>
        </div>
      </div>
    `,
  }),
};

export const PostListingGrid: Story = {
  name: 'Post Listing — Grid',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Two-column responsive grid layout. Apply `.post-list--grid` to the list container. Columns collapse to one below ~28rem per column.',
      },
    },
  },
  render: () => ({
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page);">
        <div style="max-width: 64rem; margin: 0 auto; padding: clamp(1.5rem, 5vw, 3rem) 1.5rem clamp(3rem, 8vw, 5rem);">

          <header style="margin-bottom: var(--spacing-xl);">
            <h1 style="
              font-family: var(--font-family-display);
              font-size: var(--font-size-h2);
              font-weight: var(--font-weight-bold);
              font-optical-sizing: auto;
              line-height: var(--line-height-tight);
              color: var(--color-text-default);
              margin: 0 0 var(--spacing-xs);
            ">Writing</h1>
            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-base);
              color: var(--color-text-subtle);
              margin: 0;
            ">Notes on design, cartography, accessibility, and AI.</p>
          </header>

          <ul class="post-list post-list--grid" role="list" style="list-style:none;padding:0;margin:0;">
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/post1/600/300" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Color</span></div>
                  <h2 class="post-card__title"><a href="#">Why perceptual color spaces make better design tools</a></h2>
                  <p class="post-card__excerpt">Hex values are coordinates, not colors. Moving to OKLCH changes how you think about palettes, contrast, and iteration.</p>
                  <div class="post-card__meta"><time>March 2026</time><span aria-hidden="true">·</span><span>6 min read</span></div>
                </div>
              </article>
            </li>
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/post2/600/300" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Accessibility</span></div>
                  <h2 class="post-card__title"><a href="#">Atkinson Hyperlegible and the problem of conspicuous accessibility</a></h2>
                  <p class="post-card__excerpt">Accessibility typefaces can signal to disabled readers that something special was done for them — a subtle form of othering.</p>
                  <div class="post-card__meta"><time>February 2026</time><span aria-hidden="true">·</span><span>8 min read</span></div>
                </div>
              </article>
            </li>
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/post3/600/300" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Cartography</span></div>
                  <h2 class="post-card__title"><a href="#">What map projections taught me about data visualization</a></h2>
                  <p class="post-card__excerpt">Every map projection preserves some properties and distorts others. There is no neutral representation.</p>
                  <div class="post-card__meta"><time>January 2026</time><span aria-hidden="true">·</span><span>5 min read</span></div>
                </div>
              </article>
            </li>
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">AI Safety</span></div>
                  <h2 class="post-card__title"><a href="#">Specification gaming is a design problem</a></h2>
                  <p class="post-card__excerpt">When a model finds an unintended solution to the stated objective, we call it misalignment. A designer would call it a brief that didn't say what it meant.</p>
                  <div class="post-card__meta"><time>December 2025</time><span aria-hidden="true">·</span><span>4 min read</span></div>
                </div>
              </article>
            </li>
          </ul>
        </div>
      </div>
    `,
  }),
};
