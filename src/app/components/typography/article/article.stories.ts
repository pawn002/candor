import type { Meta, StoryObj } from '@storybook/angular';
import { ArticleComponent } from './article.component';

const meta: Meta<ArticleComponent> = {
  title: 'Angular Components/Typography/Article',
  component: ArticleComponent,
  tags: ['autodocs'],
  argTypes: {
    font: {
      control: { type: 'select' },
      options: ['serif', 'sans'],
      description: 'Body typeface — Noto Serif (serif, default) or Noto Sans (sans, for syndication/utility contexts). Headings always use Roboto Flex.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
\`app-article\` renders long-form prose with full semantic HTML support (headings, lists,
blockquotes, code, tables, figures).

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
| Syndicated content with mixed origins | Noto Sans (\`sans\`) | Sans is safer when you cannot verify the reading context |

**The signal serif sends:** In AI-assisted applications, displaying AI-generated content in Noto
Serif visually communicates "this is a produced artifact — read it, don't scan it." This is a
deliberate design choice, not an aesthetic preference.

**Headings always use Roboto Flex** regardless of the \`font\` input. Only the body paragraph
typeface changes.
        `.trim(),
      },
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

  <h4>A Note on Environment</h4>
  <p>
    Where you read matters almost as much as how. A quiet room, a single open tab, and no
    notifications are not luxuries — they are prerequisites for the kind of attention slow
    reading demands.
  </p>

  <h5>Recommended conditions</h5>
  <p>
    Physical books outperform screens for deep reading in most studies, likely because the
    absence of hyperlinks removes the temptation to branch away from the current argument.
  </p>

  <h6>On annotation tools</h6>
  <p>
    A pencil remains the best annotation tool. Digital highlighting creates the illusion of
    engagement without the synthesis that handwritten notes require.
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
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${fullArticleContent}</app-article>`,
  }),
};

export const Sans: Story = {
  args: { font: 'sans' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${fullArticleContent}</app-article>`,
  }),
};

export const WithCode: Story = {
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${codeArticleContent}</app-article>`,
  }),
};

export const SansWithCode: Story = {
  args: { font: 'sans' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">${codeArticleContent}</app-article>`,
  }),
};

export const WithLinks: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Link accessibility — what the system guarantees and what it cannot**

Links satisfy WCAG 1.4.1 (Use of Color) for the link-vs-surrounding-text distinction:
underline provides the non-color cue regardless of whether the reader distinguishes azure from body text.

**\`:visited\` state uses a double-underline indicator** — a structural cue on top of the hue shift.

Browsers only allow color-value CSS properties inside \`:visited\` rules (\`color\`, \`border-color\`,
\`outline-color\`, etc.) — width, style, and layout properties are silently ignored to prevent
navigation-history side-channel attacks. This system exploits that constraint:
a \`border-bottom\` is pre-declared on the base link rule with \`transparent\` color. On \`:visited\`,
only the border color changes — but the result is a second underline appearing beneath the
existing \`text-decoration\` underline.

**Structural signal:** single underline = unvisited. Double underline = visited.
This distinguishes the states beyond hue shift, providing a cue that persists under deuteranopia
and protanopia (red-green CVD), where the azure→purple shift alone may be ambiguous.

**Token mapping:**
- Light mode: \`--azure-500\` → \`--purple-700\` (both pass WCAG contrast independently)
- Dark mode: \`--azure-300\` → \`--purple-300\` (both pass WCAG contrast independently)

**Consumers who need even stronger differentiation** (e.g. icon-level indicator) can implement
a JS-assisted pattern: intercept clicks, store visited URLs in \`localStorage\`, apply a class
(e.g. \`.is-visited\`). Class selectors are not subject to the \`:visited\` color-only restriction.

See \`docs/ACCESSIBILITY-CONFORMANCE.md\` for the full platform-limitation note.
        `.trim(),
      },
    },
  },
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">
      <h1>On Reading and the Open Web</h1>
      <p>
        The web was built on links. From the earliest days of
        <a href="#">CERN's internal documentation</a> to the modern era of
        <a href="#">interconnected knowledge graphs</a>, the hyperlink remains the
        fundamental unit of the web's architecture.
      </p>
      <p>
        Yet most reading environments treat links as a necessary intrusion —
        a flash of blue that pulls the eye away from the sentence it lives in.
        <a href="#">Typographers have long debated</a> whether underlines aid or
        hinder scanning, and whether color alone is sufficient to signal interactivity.
      </p>
      <h2>Link Accessibility</h2>
      <p>
        WCAG 2.1 requires that links be distinguishable from surrounding text by more than
        color alone — either through underline, weight, or another non-color cue.
        This article uses <a href="#">underline with a custom offset</a> to satisfy that
        requirement without cluttering the baseline rhythm.
      </p>
      <p>
        Links within a visited state, <a href="https://pawn002.github.io/blog-public/">like this one</a>, should ideally
        signal that the destination has already been seen. Here is a run of text with
        <a href="#">multiple</a> <a href="#">consecutive</a> <a href="#">links</a>
        to evaluate spacing and visual noise in dense link contexts.
      </p>
      <h3>Focus Behaviour</h3>
      <p>
        Keyboard users rely on a visible focus ring to navigate. Tab to any
        <a href="#">link in this paragraph</a> to verify the focus style is
        present and clearly visible against the page background.
      </p>
    </app-article>`,
  }),
};

export const WithRichContent: Story = {
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">
      <h1>Typography in Data-Rich Articles</h1>
      <p>
        Editorial layouts often combine prose with structured data —
        <abbr title="HyperText Markup Language">HTML</abbr> provides the semantic elements,
        but the design system must ensure they all coexist coherently.
      </p>

      <h2>Comparing Typeface Metrics</h2>
      <p>
        The table below compares key optical characteristics across the typefaces
        used in this system.
      </p>
      <table>
        <thead>
          <tr>
            <th>Typeface</th>
            <th>Role</th>
            <th>Variable axes</th>
            <th>Min size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Roboto Flex</td>
            <td>Display / headings</td>
            <td>opsz, wght, wdth, GRAD</td>
            <td>16px</td>
          </tr>
          <tr>
            <td>Noto Sans</td>
            <td>Long-form reading</td>
            <td>wght</td>
            <td>16px</td>
          </tr>
          <tr>
            <td>Atkinson Hyperlegible</td>
            <td>Critical UI text</td>
            <td>—</td>
            <td>14px</td>
          </tr>
          <tr>
            <td>Roboto Mono</td>
            <td>Code</td>
            <td>—</td>
            <td>14px</td>
          </tr>
        </tbody>
      </table>

      <h2>Figures and Captions</h2>
      <p>
        Images within articles should be accompanied by a <code>figcaption</code>
        that provides context — captions are rendered at the 14px floor to keep
        them clearly subordinate to body text.
      </p>
      <figure>
        <img src="https://picsum.photos/seed/article/800/400" alt="A placeholder landscape" />
        <figcaption>
          Figure 1. Optical sizing in Roboto Flex means stroke weight adapts
          to the rendered size — larger text naturally carries heavier strokes.
        </figcaption>
      </figure>

      <p>
        The <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> success
        criterion 1.4.3 requires a contrast ratio of at least 4.5:1 for normal text.
        All body tokens in this system are validated against their actual background,
        not just the page default.
      </p>
    </app-article>`,
  }),
};

export const WithNumericTable: Story = {
  args: { font: 'serif' },
  render: (args) => ({
    props: args,
    template: `<app-article [font]="font">
      <h1>Typographic Scale — Optical Metrics</h1>
      <p>
        The table below presents measured optical characteristics for each step in
        the Candor type scale. Values are derived from the Major Third ratio (1.25×)
        applied to a 16px base.
      </p>

      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Token</th>
            <th class="numeric">Size (px)</th>
            <th class="numeric">Size (rem)</th>
            <th class="numeric">Line height</th>
            <th class="numeric">Cap height (px)</th>
            <th class="numeric">x-height (px)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>h1</td>
            <td><code>--font-size-h1</code></td>
            <td class="numeric">39.06</td>
            <td class="numeric">2.441</td>
            <td class="numeric">1.20</td>
            <td class="numeric">28.12</td>
            <td class="numeric">19.53</td>
          </tr>
          <tr>
            <td>h2</td>
            <td><code>--font-size-h2</code></td>
            <td class="numeric">31.25</td>
            <td class="numeric">1.953</td>
            <td class="numeric">1.20</td>
            <td class="numeric">22.50</td>
            <td class="numeric">15.63</td>
          </tr>
          <tr>
            <td>h3</td>
            <td><code>--font-size-h3</code></td>
            <td class="numeric">25.00</td>
            <td class="numeric">1.563</td>
            <td class="numeric">1.20</td>
            <td class="numeric">18.00</td>
            <td class="numeric">12.50</td>
          </tr>
          <tr>
            <td>h4</td>
            <td><code>--font-size-h4</code></td>
            <td class="numeric">20.00</td>
            <td class="numeric">1.250</td>
            <td class="numeric">1.20</td>
            <td class="numeric">14.40</td>
            <td class="numeric">10.00</td>
          </tr>
          <tr>
            <td>body</td>
            <td><code>--font-size-base</code></td>
            <td class="numeric">16.00</td>
            <td class="numeric">1.000</td>
            <td class="numeric">1.60</td>
            <td class="numeric">11.52</td>
            <td class="numeric">8.00</td>
          </tr>
          <tr>
            <td>sm</td>
            <td><code>--font-size-sm</code></td>
            <td class="numeric">14.00</td>
            <td class="numeric">0.875</td>
            <td class="numeric">1.40</td>
            <td class="numeric">10.08</td>
            <td class="numeric">7.00</td>
          </tr>
          <tr>
            <td>xs</td>
            <td><code>--font-size-xs</code></td>
            <td class="numeric">12.00</td>
            <td class="numeric">0.750</td>
            <td class="numeric">1.40</td>
            <td class="numeric">8.64</td>
            <td class="numeric">6.00</td>
          </tr>
        </tbody>
      </table>

      <p>
        Cap height is estimated at 72% of the em square for Noto Serif;
        x-height at 50%. These are approximations — optical correction by
        the typeface designer means actual rendered values will vary slightly.
      </p>
    </app-article>`,
  }),
};

export const FontComparison: Story = {
  args: {},
  render: () => ({
    props: {},
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
        <div>
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); font-weight: var(--font-weight-semibold);">Noto Serif (serif)</p>
          <app-article font="serif">${fullArticleContent}</app-article>
        </div>
        <div>
          <p style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-bottom: var(--spacing-sm); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); font-weight: var(--font-weight-semibold);">Noto Sans (sans)</p>
          <app-article font="sans">${fullArticleContent}</app-article>
        </div>
      </div>
    `,
  }),
};

// AI Prose — demonstrates Noto Serif as the correct typeface for AI-generated content.
// The pattern applies equally to human-authored reports and deliberation content.
export const AIGeneratedProse: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Pattern: AI-generated content in Noto Serif**

Use \`font="serif"\` (the default) when displaying AI-generated text. The serif typeface
signals "produced artifact — read this, don't scan it." This applies to: AI summaries,
generated reports, deliberation outputs, and AI-assisted writing anywhere in the app.

The framing chrome (card header, metadata, status labels) uses Roboto Flex or Atkinson
Hyperlegible — only the body prose switches to Noto Serif.
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="max-width: 680px;">
        <!-- Card framing in Roboto Flex -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        ">
          <div style="
            padding: var(--spacing-sm) var(--spacing-md);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
          ">
            <i class="ph ph-sparkle" style="font-size: 1rem; color: var(--color-action-primary); line-height: 1;" aria-hidden="true"></i>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-text-default);">AI Summary</span>
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-sm); color: var(--color-text-subtle); margin-left: auto;">Generated · 2 min ago</span>
          </div>
          <!-- Body prose in Noto Serif -->
          <div style="padding: var(--spacing-md);">
            <app-article font="serif">
              <p>
                The council's deliberation on the proposed housing development centred on three
                interconnected concerns: traffic impact on the B4632 corridor, the adequacy of
                the proposed green-space offset, and the heritage setting of the adjacent
                Grade II listed farmhouse.
              </p>
              <p>
                Members broadly supported the principle of the development but identified the
                traffic assessment as requiring independent review before any resolution could
                be made. The applicant agreed in principle to commission an updated transport
                study, with findings to be reported back to committee within eight weeks.
              </p>
              <p>
                On the heritage question, the conservation officer's report was accepted
                without amendment. The proposed materials palette — hand-made clay brick
                with a recessed mortar joint — was considered sympathetic to the setting.
              </p>
            </app-article>
          </div>
        </div>
      </div>
    `,
  }),
};
