import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Typography/Article',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<candor-article>\` renders long-form prose with full semantic HTML support (headings,
lists, blockquotes, code, tables, figures). Uses **light DOM** (\`createRenderRoot()\`
returns \`this\`) so global prose styles reach projected children — equivalent to Angular's
\`ViewEncapsulation.None\`.

## Serif vs. sans — which font and when

**The rule:** content that originates from a human author or a generative AI model uses
**Noto Serif** (\`font="serif"\`, the default). Content that is UI infrastructure —
navigation, settings, system messages, help text — uses **Noto Sans** or Roboto Flex.

The distinction is cognitive context, not visual preference:

| Context | Font | Why |
|---|---|---|
| AI-generated summaries, reports, deliberation content | Noto Serif (\`serif\`) | Signals authored content; slows reading toward reflection |
| Human-authored articles, editorial prose | Noto Serif (\`serif\`) | Same — human and AI prose share the reading frame |
| Help documentation, release notes, policy text | Noto Serif (\`serif\`) | Sustained reading; benefits from serif rhythm |
| In-app explanatory copy, onboarding text | Noto Sans (\`sans\`) | Brief, scanning context; utility not reading |

**The signal serif sends:** In AI-assisted applications, displaying AI-generated content in
Noto Serif visually communicates "this is a produced artifact — read it, don't scan it."

**Headings always use Roboto Flex** regardless of the \`font\` attribute. Only the body
paragraph typeface changes.
        `.trim(),
      },
    },
  },
  argTypes: {
    font: {
      control: 'select',
      options: ['serif', 'sans'],
      description: 'Body typeface — Noto Serif (serif, default) or Noto Sans (sans, for syndication/utility contexts). Headings always use Roboto Flex.',
    },
  },
  args: { font: 'serif' },
  render: (args) => ({
    template: `<candor-article font="${args['font']}">
      <h1>The humanist case for accessible design</h1>
      <p>Good typography isn't decoration — it's a form of care. When we choose typefaces that honour the shapes of letters, set type that breathes, and maintain contrast that doesn't strain the eye, we're acknowledging that text exists to be read by people.</p>
      <h2>Perceptual colour</h2>
      <p>OKLCH gives designers control over <strong>perceived lightness</strong> rather than numerical luminance. A colour that looks mid-tone on screen should behave as mid-tone — not surprise you with a jarring jump when lightness is adjusted by 10%.</p>
      <blockquote>The measure of a typeface is not its beauty in isolation but its service to the reader over long stretches of text.</blockquote>
      <h3>Code as prose</h3>
      <p>Even code blocks belong inside the humanist frame. A <code>monospace</code> span should feel warm, not clinical.</p>
      <pre><code>npm install @candor-design/tokens</code></pre>
      <p>Visit the <a href="#">documentation site</a> for full usage guidance.</p>
    </candor-article>`,
  }),
};

export default meta;
type Story = StoryObj;

const fullArticleContent = `
  <h1>The Case for Slower Reading</h1>
  <p>We live in an age of infinite scroll and push notifications, where the average piece of content is consumed in under ninety seconds. Yet some of the most important ideas in science, philosophy, and literature require something different — not skimming, but <em>dwelling</em>.</p>
  <p>Reading slowly is not a cognitive limitation. It is a discipline, and like all disciplines, it produces results that faster methods cannot.</p>
  <h2>What Slow Reading Actually Means</h2>
  <p>Slow reading does not mean reading every word at the same pace. It means granting yourself permission to pause, to re-read a paragraph, to sit with an uncomfortable idea long enough for it to change your mind.</p>
  <blockquote>"The reading of all good books is like a conversation with the finest minds of past centuries." — René Descartes</blockquote>
  <h3>The Neuroscience</h3>
  <p>Research in cognitive science suggests that <strong>deep reading</strong> — the kind that involves inference, analogical reasoning, and critical analysis — activates a different neural network than the rapid decoding of text we use for social media.</p>
  <h3>A Practical Approach</h3>
  <ul>
    <li>Set a fixed time: thirty minutes, uninterrupted.</li>
    <li>Read with a pencil. Underline what surprises you.</li>
    <li>After each chapter, write one sentence summarising the core argument.</li>
    <li>Return to difficult passages — confusion is data, not failure.</li>
  </ul>
  <h2>What You Stand to Gain</h2>
  <p>The case for slow reading is ultimately a case for depth over breadth. Not everything worth knowing fits in a tweet.</p>
  <h4>A Note on Environment</h4>
  <p>Where you read matters almost as much as how. A quiet room, a single open tab, and no notifications are not luxuries — they are prerequisites for the kind of attention slow reading demands.</p>
  <h5>Recommended conditions</h5>
  <p>Physical books outperform screens for deep reading in most studies, likely because the absence of hyperlinks removes the temptation to branch away from the current argument.</p>
  <h6>On annotation tools</h6>
  <p>A pencil remains the best annotation tool. Digital highlighting creates the illusion of engagement without the synthesis that handwritten notes require.</p>
  <hr />
  <p><em>This article is part of an ongoing series on attention, craft, and the conditions that enable good thinking.</em></p>
`;

const codeArticleContent = `
  <h1>Understanding CSS Custom Properties</h1>
  <p>CSS custom properties — often called <em>CSS variables</em> — are one of the most powerful features added to the language in recent years. They allow you to store values in named containers and reuse them throughout your stylesheet.</p>
  <h2>Declaring a Custom Property</h2>
  <p>You declare a custom property on any element using the <code>--property-name</code> syntax. The most common pattern is declaring them on <code>:root</code> to make them globally available:</p>
  <pre><code>:root {
  --color-primary: oklch(0.27 0.06 245);
  --spacing-md: 1.5rem;
  --font-size-body: 1.25rem;
}</code></pre>
  <p>You then reference the value anywhere in your CSS using the <code>var()</code> function. The second argument to <code>var()</code> is an optional fallback value:</p>
  <pre><code>button {
  background-color: var(--color-primary);
  padding: var(--spacing-md, 1rem);
  font-size: var(--font-size-body);
}</code></pre>
  <h2>Scoping and Inheritance</h2>
  <p>Custom properties follow the CSS cascade. A property declared on a parent element is inherited by its descendants, which makes <strong>component-level theming</strong> straightforward:</p>
  <pre><code>.card--dark {
  --color-primary: oklch(0.65 0.18 250);
  --color-text: oklch(1 0 0);
}</code></pre>
  <h3>Key Facts</h3>
  <ol>
    <li>Custom properties are <strong>case-sensitive</strong>: <code>--Color</code> ≠ <code>--color</code>.</li>
    <li>They can store any valid CSS value, including other <code>var()</code> references.</li>
    <li>Invalid fallbacks do not cause errors — the browser uses the initial value instead.</li>
  </ol>
`;

export const Serif: Story = {};

export const SansSerif: Story = {
  args: { font: 'sans' },
};

export const WithCode: Story = {
  args: { font: 'serif' },
  render: () => ({
    template: `<candor-article font="serif">${codeArticleContent}</candor-article>`,
  }),
};

export const SansWithCode: Story = {
  args: { font: 'sans' },
  render: () => ({
    template: `<candor-article font="sans">${codeArticleContent}</candor-article>`,
  }),
};

export const WithLinks: Story = {
  args: { font: 'serif' },
  render: () => ({
    template: `<candor-article font="serif">
      <h1>On Reading and the Open Web</h1>
      <p>The web was built on links. From the earliest days of <a href="#">CERN's internal documentation</a> to the modern era of <a href="#">interconnected knowledge graphs</a>, the hyperlink remains the fundamental unit of the web's architecture.</p>
      <p>Yet most reading environments treat links as a necessary intrusion — a flash of blue that pulls the eye away from the sentence it lives in. <a href="#">Typographers have long debated</a> whether underlines aid or hinder scanning, and whether color alone is sufficient to signal interactivity.</p>
      <h2>Link Accessibility</h2>
      <p>WCAG 2.1 requires that links be distinguishable from surrounding text by more than color alone — either through underline, weight, or another non-color cue. This article uses <a href="#">underline with a custom offset</a> to satisfy that requirement without cluttering the baseline rhythm.</p>
      <p>Here is a run of text with <a href="#">multiple</a> <a href="#">consecutive</a> <a href="#">links</a> to evaluate spacing and visual noise in dense link contexts.</p>
      <h3>Focus Behaviour</h3>
      <p>Keyboard users rely on a visible focus ring to navigate. Tab to any <a href="#">link in this paragraph</a> to verify the focus style is present and clearly visible against the page background.</p>
    </candor-article>`,
  }),
};

export const WithRichContent: Story = {
  args: { font: 'serif' },
  render: () => ({
    template: `<candor-article font="serif">
      <h1>Typography in Data-Rich Articles</h1>
      <p>Editorial layouts often combine prose with structured data — <abbr title="HyperText Markup Language">HTML</abbr> provides the semantic elements, but the design system must ensure they all coexist coherently.</p>
      <h2>Comparing Typeface Metrics</h2>
      <table>
        <thead>
          <tr><th>Typeface</th><th>Role</th><th>Variable axes</th><th>Min size</th></tr>
        </thead>
        <tbody>
          <tr><td>Roboto Flex</td><td>Display / headings</td><td>opsz, wght, wdth, GRAD</td><td>16px</td></tr>
          <tr><td>Noto Sans</td><td>Long-form reading</td><td>wght</td><td>16px</td></tr>
          <tr><td>Atkinson Hyperlegible</td><td>Critical UI text</td><td>—</td><td>14px</td></tr>
          <tr><td>Roboto Mono</td><td>Code</td><td>—</td><td>14px</td></tr>
        </tbody>
      </table>
      <h2>Figures and Captions</h2>
      <p>Images within articles should be accompanied by a <code>figcaption</code> that provides context.</p>
      <figure>
        <img src="https://picsum.photos/seed/article/800/400" alt="A placeholder landscape" />
        <figcaption>Figure 1. Optical sizing in Roboto Flex means stroke weight adapts to the rendered size — larger text naturally carries heavier strokes.</figcaption>
      </figure>
    </candor-article>`,
  }),
};

export const WithNumericTable: Story = {
  args: { font: 'serif' },
  render: () => ({
    template: `<candor-article font="serif">
      <h1>Typographic Scale — Optical Metrics</h1>
      <p>The table below presents measured optical characteristics for each step in the Candor type scale. Values are derived from the Major Third ratio (1.25×) applied to a 16px base.</p>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Token</th>
            <th class="numeric">Size (px)</th>
            <th class="numeric">Size (rem)</th>
            <th class="numeric">Line height</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>h1</td><td><code>--font-size-h1</code></td><td class="numeric">39.06</td><td class="numeric">2.441</td><td class="numeric">1.20</td></tr>
          <tr><td>h2</td><td><code>--font-size-h2</code></td><td class="numeric">31.25</td><td class="numeric">1.953</td><td class="numeric">1.20</td></tr>
          <tr><td>h3</td><td><code>--font-size-h3</code></td><td class="numeric">25.00</td><td class="numeric">1.563</td><td class="numeric">1.20</td></tr>
          <tr><td>h4</td><td><code>--font-size-h4</code></td><td class="numeric">20.00</td><td class="numeric">1.250</td><td class="numeric">1.20</td></tr>
          <tr><td>body</td><td><code>--font-size-base</code></td><td class="numeric">16.00</td><td class="numeric">1.000</td><td class="numeric">1.60</td></tr>
          <tr><td>sm</td><td><code>--font-size-sm</code></td><td class="numeric">14.00</td><td class="numeric">0.875</td><td class="numeric">1.40</td></tr>
        </tbody>
      </table>
    </candor-article>`,
  }),
};

export const FontComparison: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;">
        <div>
          <p style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-sm);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);font-weight:var(--font-weight-semibold);">Noto Serif (serif)</p>
          <candor-article font="serif">${fullArticleContent}</candor-article>
        </div>
        <div>
          <p style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-bottom:var(--spacing-sm);text-transform:uppercase;letter-spacing:var(--letter-spacing-wide);font-weight:var(--font-weight-semibold);">Noto Sans (sans)</p>
          <candor-article font="sans">${fullArticleContent}</candor-article>
        </div>
      </div>
    `,
  }),
};

export const AIGeneratedProse: Story = {
  render: () => ({
    template: `
      <div style="max-width:680px;">
        <div style="background:var(--color-bg-surface);border:var(--border-width-thin) solid var(--color-border-subtle);border-radius:var(--radius-md);overflow:hidden;">
          <div style="padding:var(--spacing-sm) var(--spacing-md);border-bottom:var(--border-width-thin) solid var(--color-border-subtle);display:flex;align-items:center;gap:var(--spacing-xs);">
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:var(--color-text-default);">✦ AI Summary</span>
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);margin-left:auto;">Generated · 2 min ago</span>
          </div>
          <div style="padding:var(--spacing-md);">
            <candor-article font="serif">
              <p>The council's deliberation on the proposed housing development centred on three interconnected concerns: traffic impact on the B4632 corridor, the adequacy of the proposed green-space offset, and the heritage setting of the adjacent Grade II listed farmhouse.</p>
              <p>Members broadly supported the principle of the development but identified the traffic assessment as requiring independent review before any resolution could be made. The applicant agreed in principle to commission an updated transport study, with findings to be reported back to committee within eight weeks.</p>
              <p>On the heritage question, the conservation officer's report was accepted without amendment. The proposed materials palette — hand-made clay brick with a recessed mortar joint — was considered sympathetic to the setting.</p>
            </candor-article>
          </div>
        </div>
      </div>
    `,
  }),
};
