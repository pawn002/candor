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
        { label: 'About', href: '#' },
      ],
    },
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page);">

        <!-- Navigation -->
        <app-navigation
          brand="pawn002"
          [items]="navItems"
          orientation="horizontal">
        </app-navigation>

        <!-- Page content -->
        <div style="max-width: 42rem; margin: 0 auto; padding: clamp(1.5rem, 5vw, 3rem) 1.5rem clamp(3rem, 8vw, 5rem);">

          <!-- Post header -->
          <header style="margin-bottom: 2.5rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <app-badge variant="default">Accessibility</app-badge>
              <app-badge variant="default">AI</app-badge>
              <app-badge variant="default">Ethics</app-badge>
            </div>

            <h1 style="
              font-family: var(--font-family-display);
              font-size: var(--font-size-h1);
              font-weight: var(--font-weight-bold);
              font-optical-sizing: auto;
              line-height: var(--line-height-tight);
              color: var(--color-text-default);
              margin: 0 0 1rem;
            ">Accessible AI: Why LLM Outputs Fail Users with Disabilities</h1>

            <p style="
              font-family: var(--font-family-base);
              font-size: var(--font-size-lg);
              color: var(--color-text-subtle);
              line-height: var(--line-height-normal);
              margin: 0 0 1.5rem;
            ">LLMs produce technically-valid outputs that fail to serve disabled users. Context is the intervention — examining prompt engineering patterns that shift burden from systems to users.</p>

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
              <span>January 2026</span>
              <span aria-hidden="true">·</span>
              <span>8 min read</span>
            </div>
          </header>

          <!-- Hero image -->
          <figure style="margin: 0 0 2.5rem;">
            <img
              src="https://picsum.photos/seed/accessibleai/900/400"
              alt="Hero illustration: transformation from hollow speech bubble to solid accessible speech bubble, representing how context transforms LLM outputs"
              style="display: block; width: 100%; border-radius: var(--radius-md); aspect-ratio: 16/7; object-fit: cover;"
            >
          </figure>

          <!-- Article body -->
          <app-article font="reading">
            <p>A screen reader user asks an AI assistant to summarize a research paper. The assistant returns five bullet points. Each bullet is a complete sentence, unpunctuated, beginning with a capital letter. The screen reader announces them as a single run-on utterance. The information is all there. The output is inaccessible.</p>

            <p>This is not an edge case. It is the default behavior of every major LLM when accessibility context is absent from the prompt. The model produces output that is technically correct and structurally broken — because no one told it otherwise.</p>

            <blockquote>
              The accessibility failure is not in the model. It is in the prompt. The model will do exactly what you ask. The question is whether what you asked includes the needs of the person receiving the output.
            </blockquote>

            <h2>The compliance gap</h2>

            <p>WCAG 2.1 was written for static content. It defines requirements for images, color contrast, keyboard navigation, and semantic structure — all properties of a document that exists before a user arrives. LLM output is none of these things. It is generated at request time, shaped entirely by context, and structurally unconstrained by default.</p>

            <p>This creates a compliance gap that organizations are not yet accounting for. A product can pass a WCAG audit and still deliver inaccessible AI-generated content to every user who relies on assistive technology.</p>

            <h2>Context as intervention</h2>

            <p>The intervention is prompt engineering — specifically, injecting accessibility context at the system level so that every generation inherits it without the end user having to ask. A system prompt that instructs the model to use semantic punctuation, avoid markdown in voice contexts, and structure lists as actual lists produces output that works for screen reader users without requiring any change to the user-facing interface.</p>

            <p>The pattern is straightforward. The resistance is organizational: this requires product and AI teams to treat accessibility as a constraint on generation, not a post-processing filter on output. Those are different architectural positions.</p>

            <h2>Shifting the burden</h2>

            <p>The current state places the burden on the disabled user: they must prompt the AI in ways that elicit accessible output, often without knowing which patterns work or why. This is the digital equivalent of asking a wheelchair user to request a ramp — technically possible, fundamentally wrong.</p>

            <p>System-level prompt engineering moves the constraint to the right place. The user gets accessible output because the system was built to produce it, not because they knew the right words to ask for it.</p>
          </app-article>

          <!-- Post footer — prev/next navigation -->
          <footer style="
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--color-border-default);
          ">
            <nav aria-label="Post navigation" style="display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <a href="#" style="
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-link);
                letter-spacing: 0.02em;
              ">← Compliance without Accommodation</a>
              <a href="#" style="
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-link);
                letter-spacing: 0.02em;
              ">The P+F+I+D Framework →</a>
            </nav>
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
          brand="pawn002"
          [items]="[{label:'Writing',href:'#',active:true},{label:'About',href:'#'}]"
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
            ">Cross disciplinary writing bringing together technology, art, and life.</p>
          </header>

          <!-- Post listing — uses candor-blog.css classes -->
          <ul class="post-list" role="list" style="list-style:none;padding:0;margin:0;">

            <!-- Featured post — has hero image -->
            <li>
              <article class="post-card post-card--featured">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/accessibleai/800/450" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Accessibility</span>
                    <span class="post-card__tag">AI</span>
                    <span class="post-card__tag">Ethics</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Accessible AI: Why LLM Outputs Fail Users with Disabilities</a>
                  </h2>
                  <p class="post-card__excerpt">
                    LLMs produce technically-valid outputs that fail to serve disabled users.
                    Context is the intervention — examining prompt engineering patterns that
                    shift burden from users to systems.
                  </p>
                  <div class="post-card__meta">
                    <time datetime="2026-01-21">January 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>8 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Standard post — no hero image -->
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Accessibility</span>
                    <span class="post-card__tag">AI Safety</span>
                    <span class="post-card__tag">Policy</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Safe on Paper: What Accessibility Standards Teach AI Safety Governance</a>
                  </h2>
                  <p class="post-card__excerpt">
                    Standards calcify. Accessibility governance spent 25 years learning what happens
                    when compliance diverges from outcomes — AI safety is setting up the same dynamic,
                    with those lessons available in advance.
                  </p>
                  <div class="post-card__meta">
                    <time datetime="2026-02-28">February 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>7 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Standard post — no hero image -->
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Accessibility</span>
                    <span class="post-card__tag">Policy</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Compliance without Accommodation: The Unfortunate Circumstance of Existing Accessibility Guidance</a>
                  </h2>
                  <p class="post-card__excerpt">
                    How WCAG's legal codification has created a paradox where organizations face risk
                    when adopting better solutions — leaving disabled users underserved despite apparent compliance.
                  </p>
                  <div class="post-card__meta">
                    <time datetime="2026-01-20">January 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>6 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Standard post — has hero image -->
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/pfid/800/400" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">Prompt Engineering</span>
                    <span class="post-card__tag">AI</span>
                    <span class="post-card__tag">Portfolio</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">The P+F+I+D Framework: A Prompt Engineering Case Study</a>
                  </h2>
                  <p class="post-card__excerpt">
                    A case study documenting the evolution from 0/10 to 9.5/10 prompt engineering
                    skill through the P+F+I+D framework, featuring real prompts, metrics, and the
                    CLAUDE.md breakthrough.
                  </p>
                  <div class="post-card__meta">
                    <time datetime="2026-01-15">January 2026</time>
                    <span aria-hidden="true">·</span>
                    <span>10 min read</span>
                  </div>
                </div>
              </article>
            </li>

            <!-- Compact post — no image, older archive entry -->
            <li>
              <article class="post-card post-card--compact">
                <div class="post-card__body">
                  <div class="post-card__tags">
                    <span class="post-card__tag">AI</span>
                    <span class="post-card__tag">Portfolio</span>
                  </div>
                  <h2 class="post-card__title">
                    <a href="#">Building a Privacy-First Transcription Tool with Claude Code</a>
                  </h2>
                  <p class="post-card__excerpt">
                    How I used AI to build an offline transcription app that protects user privacy —
                    and what it reveals about the democratization of software development.
                  </p>
                  <div class="post-card__meta">
                    <time datetime="2025-11-19">November 2025</time>
                    <span aria-hidden="true">·</span>
                    <span>5 min read</span>
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
            ">Cross disciplinary writing bringing together technology, art, and life.</p>
          </header>

          <!-- Grid has a mix of image and text-only cards — text-only cards get a left accent border via CSS :not(:has(.post-card__image-link)) -->
          <ul class="post-list post-list--grid" role="list" style="list-style:none;padding:0;margin:0;">

            <!-- Has hero image -->
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/accessibleai/600/400" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Accessibility</span><span class="post-card__tag">AI</span></div>
                  <h2 class="post-card__title"><a href="#">Accessible AI: Why LLM Outputs Fail Users with Disabilities</a></h2>
                  <p class="post-card__excerpt">LLMs produce technically-valid outputs that fail to serve disabled users. Context is the intervention.</p>
                  <div class="post-card__meta"><time datetime="2026-01-21">January 2026</time><span aria-hidden="true">·</span><span>8 min read</span></div>
                </div>
              </article>
            </li>

            <!-- No hero image — gets left accent border in grid -->
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Accessibility</span><span class="post-card__tag">AI Safety</span></div>
                  <h2 class="post-card__title"><a href="#">Safe on Paper: What Accessibility Standards Teach AI Safety Governance</a></h2>
                  <p class="post-card__excerpt">Standards calcify. Accessibility governance spent 25 years learning what happens when compliance diverges from outcomes.</p>
                  <div class="post-card__meta"><time datetime="2026-02-28">February 2026</time><span aria-hidden="true">·</span><span>7 min read</span></div>
                </div>
              </article>
            </li>

            <!-- Has hero image -->
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/pfid/600/400" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Prompt Engineering</span><span class="post-card__tag">AI</span></div>
                  <h2 class="post-card__title"><a href="#">The P+F+I+D Framework: A Prompt Engineering Case Study</a></h2>
                  <p class="post-card__excerpt">Documenting the evolution from 0/10 to 9.5/10 prompt engineering skill through a structured framework.</p>
                  <div class="post-card__meta"><time datetime="2026-01-15">January 2026</time><span aria-hidden="true">·</span><span>10 min read</span></div>
                </div>
              </article>
            </li>

            <!-- No hero image — gets left accent border in grid -->
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Accessibility</span><span class="post-card__tag">Policy</span></div>
                  <h2 class="post-card__title"><a href="#">Compliance without Accommodation: The Unfortunate Circumstance of Existing Accessibility Guidance</a></h2>
                  <p class="post-card__excerpt">How WCAG's legal codification has created a paradox where organizations face risk when adopting better solutions.</p>
                  <div class="post-card__meta"><time datetime="2026-01-20">January 2026</time><span aria-hidden="true">·</span><span>6 min read</span></div>
                </div>
              </article>
            </li>

            <!-- Has hero image -->
            <li>
              <article class="post-card">
                <a class="post-card__image-link" href="#" tabindex="-1" aria-hidden="true">
                  <img class="post-card__image" src="https://picsum.photos/seed/creativedir/600/400" alt="">
                </a>
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">Design Strategy</span><span class="post-card__tag">Portfolio</span></div>
                  <h2 class="post-card__title"><a href="#">Working With Creative Direction</a></h2>
                  <p class="post-card__excerpt">How listening, shared constraints, and translation between disciplines transforms the relationship between creative vision and technical reality.</p>
                  <div class="post-card__meta"><time datetime="2025-11-22">November 2025</time><span aria-hidden="true">·</span><span>6 min read</span></div>
                </div>
              </article>
            </li>

            <!-- No hero image — gets left accent border in grid -->
            <li>
              <article class="post-card">
                <div class="post-card__body">
                  <div class="post-card__tags"><span class="post-card__tag">AI</span><span class="post-card__tag">Portfolio</span></div>
                  <h2 class="post-card__title"><a href="#">Building a Privacy-First Transcription Tool with Claude Code</a></h2>
                  <p class="post-card__excerpt">How I used AI to build an offline transcription app that protects user privacy — and what it reveals about the democratization of software development.</p>
                  <div class="post-card__meta"><time datetime="2025-11-19">November 2025</time><span aria-hidden="true">·</span><span>5 min read</span></div>
                </div>
              </article>
            </li>

          </ul>
        </div>
      </div>
    `,
  }),
};
