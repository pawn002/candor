import type { Meta, StoryObj } from '@storybook/angular';
import { ArticleComponent } from './article.component';

const meta: Meta<ArticleComponent> = {
  title: 'Typography/Article',
  component: ArticleComponent,
  tags: ['autodocs'],
  argTypes: {
    font: {
      control: { type: 'select' },
      options: ['reading', 'serif'],
      description: 'Body typeface — Noto Sans (reading) or Noto Serif (serif). Headings always use Roboto Flex.',
    },
  },
};

export default meta;
type Story = StoryObj<ArticleComponent>;

const fullArticleContent = `
  <h1>The Case for Slower Reading</h1>
  <p>
    We live in an age of infinite scroll and push notifications, where the average piece of content
    is consumed in under ninety seconds. Yet some of the most important ideas in science, philosophy,
    and literature require something different — not skimming, but <em>dwelling</em>.
  </p>
  <p>
    Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines,
    it produces results that faster methods cannot.
  </p>

  <h2>What Slow Reading Actually Means</h2>
  <p>
    Slow reading does not mean reading every word at the same pace. It means granting yourself
    permission to pause, to re-read a paragraph, to sit with an uncomfortable idea long enough
    for it to change your mind.
  </p>
  <blockquote>
    "The reading of all good books is like a conversation with the finest minds of past centuries."
    — René Descartes
  </blockquote>
  <p>
    The Descartes quote above is often invoked lightly, but consider what conversation actually requires:
    attention, presence, and the willingness to be changed by what you hear.
  </p>

  <h3>The Neuroscience</h3>
  <p>
    Research in cognitive science suggests that <strong>deep reading</strong> — the kind that
    involves inference, analogical reasoning, and critical analysis — activates a different neural
    network than the rapid decoding of text we use for social media. The pathways built by sustained
    reading are, quite literally, different structures in the brain.
  </p>

  <h3>A Practical Approach</h3>
  <ul>
    <li>Set a fixed time: thirty minutes, uninterrupted.</li>
    <li>Read with a pencil. Underline what surprises you.</li>
    <li>After each chapter, write one sentence summarising the core argument.</li>
    <li>Return to difficult passages — confusion is data, not failure.</li>
  </ul>

  <h2>What You Stand to Gain</h2>
  <p>
    The case for slow reading is ultimately a case for depth over breadth. Not everything worth
    knowing fits in a tweet. Some ideas only become available to those patient enough to follow
    an author's full argument — including its qualifications, counterexamples, and admissions of
    uncertainty.
  </p>
  <p>
    That is not inefficiency. That is how understanding actually works.
  </p>

  <hr />
  <p>
    <em>This article is part of an ongoing series on attention, craft, and the conditions that
    enable good thinking.</em>
  </p>
`;

const codeArticleContent = `
  <h1>Understanding CSS Custom Properties</h1>
  <p>
    CSS custom properties — often called <em>CSS variables</em> — are one of the most powerful
    features added to the language in recent years. They allow you to store values in named
    containers and reuse them throughout your stylesheet.
  </p>

  <h2>Declaring a Custom Property</h2>
  <p>
    You declare a custom property on any element using the <code>--property-name</code> syntax.
    The most common pattern is declaring them on <code>:root</code> to make them globally available:
  </p>
  <pre><code>:root &#123;
  --color-primary: oklch(0.27 0.06 245);
  --spacing-md: 1.5rem;
  --font-size-body: 1.25rem;
&#125;</code></pre>

  <p>
    You then reference the value anywhere in your CSS using the <code>var()</code> function.
    The second argument to <code>var()</code> is an optional fallback value:
  </p>
  <pre><code>button &#123;
  background-color: var(--color-primary);
  padding: var(--spacing-md, 1rem);
  font-size: var(--font-size-body);
&#125;</code></pre>

  <h2>Scoping and Inheritance</h2>
  <p>
    Custom properties follow the CSS cascade. A property declared on a parent element is
    inherited by its descendants, which makes <strong>component-level theming</strong>
    straightforward:
  </p>
  <pre><code>.card--dark &#123;
  --color-primary: oklch(0.65 0.18 250);
  --color-text: oklch(1 0 0);
&#125;</code></pre>

  <p>
    Any element inside <code>.card--dark</code> that references <code>--color-primary</code>
    will automatically receive the overridden value — no additional selectors required.
  </p>

  <h3>Key Facts</h3>
  <ol>
    <li>Custom properties are <strong>case-sensitive</strong>: <code>--Color</code> ≠ <code>--color</code>.</li>
    <li>They can store any valid CSS value, including other <code>var()</code> references.</li>
    <li>Invalid fallbacks do not cause errors — the browser uses the initial value instead.</li>
  </ol>
`;

export const Default: Story = {
  args: { font: 'reading' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${fullArticleContent}</app-article>`,
  }),
};

export const Serif: Story = {
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${fullArticleContent}</app-article>`,
  }),
};

export const WithCode: Story = {
  args: { font: 'reading' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${codeArticleContent}</app-article>`,
  }),
};

export const SerifWithCode: Story = {
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${codeArticleContent}</app-article>`,
  }),
};

export const FontComparison: Story = {
  args: {},
  render: () => ({
    props: {},
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
        <div>
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Noto Sans (reading)</p>
          <app-article font="reading">${fullArticleContent}</app-article>
        </div>
        <div>
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Noto Serif (serif)</p>
          <app-article font="serif">${fullArticleContent}</app-article>
        </div>
      </div>
    `,
  }),
};
