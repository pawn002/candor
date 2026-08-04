import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const NAV_ITEMS = JSON.stringify([
  { label: 'Chat', href: '#', active: true },
  { label: 'Docs', href: '#' },
  { label: 'API', href: '#' },
]);

const meta: Meta = {
  title: 'Examples/Chat Example',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Full-page AI chat interface layout assembling \`<candor-navigation>\`,
\`<candor-article>\`, \`<candor-accessible-text>\`, \`<candor-badge>\`, \`<candor-button>\`, and
\`<candor-chat-input>\` into a conversation UI.

Demonstrates the expected shell structure for an AI chat product: a fixed navigation bar,
a sidebar listing conversation history grouped by time, and a main pane with message turns
and the ChatInput anchored to the bottom.

Both sides use Noto Serif — the serif register signals a considered exchange on both ends.
AI turns use \`<candor-article font="serif" justify>\`; full justification is the sole ambient
signal distinguishing AI output from human input. Turn labels ("You" / "Candor AI") above
each message follow the convention established by ChatGPT and Claude. Code blocks include
a Copy button — universally expected and the first thing developers notice if absent.
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AIChatInterface: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => html`
      <style>
        .chat-sidebar a:hover {
          background: var(--color-action-tertiary);
          color: var(--color-text-default);
        }
        .chat-sidebar a:focus-visible {
          outline: var(--focus-ring-width) solid var(--color-focus);
          outline-offset: var(--focus-ring-offset);
          border-radius: var(--radius-sm);
        }
        .code-block { position: relative; }
        .code-block candor-button { position: absolute; top: var(--spacing-xs); right: var(--spacing-xs); }
        @media (max-width: 600px) {
          .chat-sidebar { display: none !important; }
          candor-navigation { display: none !important; }
          .chat-messages { padding: 1rem !important; }
          .chat-input-area { padding: 0.75rem 1rem 1rem !important; }
        }
      </style>
      <div style="position: fixed; inset: 0; background: var(--color-bg-page); display: flex; flex-direction: column; overflow: hidden;">

        <candor-navigation
          brand="Candor"
          items='${NAV_ITEMS}'
          orientation="horizontal">
        </candor-navigation>

        <main style="flex: 1; display: flex; min-height: 0;">

          <aside
            class="chat-sidebar"
            aria-label="Conversation history"
            style="
              width: 220px;
              flex-shrink: 0;
              background: var(--color-bg-page);
              border-right: 1px solid var(--color-border-default);
              display: flex;
              flex-direction: column;
              gap: 1rem;
              padding: 1rem 0.75rem;
            ">

            <candor-button variant="primary" size="small" style="width: 100%;">+ New conversation</candor-button>

            <nav aria-label="Recent conversations">
              <candor-accessible-text
                role_="label"
                style="display: block; padding: 0 0.5rem; margin-bottom: 0.375rem;">
                Today
              </candor-accessible-text>

              <a href="#" aria-current="page" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                background: var(--color-bg-elevated);
                text-decoration: none;
                margin-bottom: 0.125rem;
              ">
                <candor-accessible-text role_="annotation">OKLCH for brand colors</candor-accessible-text>
              </a>

              <a href="#" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                margin-bottom: 0.125rem;
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-text-subtle);
                letter-spacing: 0.02em;
              ">Design token naming</a>
              <a href="#" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                margin-bottom: 0.125rem;
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-text-subtle);
                letter-spacing: 0.02em;
              ">Tonal palette from hex</a>
              <a href="#" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-text-subtle);
                letter-spacing: 0.02em;
              ">Dark mode contrast strategy</a>
            </nav>
          </aside>

          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0;">

            <div style="
              padding: 0.875rem 1.5rem;
              border-bottom: 1px solid var(--color-border-default);
              display: flex;
              align-items: center;
              gap: 0.75rem;
              flex-shrink: 0;
            ">
              <span style="
                font-family: var(--font-family-base);
                font-weight: var(--font-weight-medium);
                font-size: var(--font-size-md);
                color: var(--color-text-default);
              ">Candor AI</span>
              <candor-badge variant="success" size="sm">Online</candor-badge>
            </div>

            <div
              role="log"
              class="chat-messages"
              aria-label="Conversation"
              aria-live="polite"
              style="
                flex: 1;
                overflow-y: auto;
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
              ">

              <div>
                <p style="
                  text-align: right;
                  font-family: var(--font-family-accessible);
                  font-size: var(--font-size-sm);
                  font-weight: var(--font-weight-bold);
                  color: var(--color-text-subtle);
                  letter-spacing: 0.02em;
                  margin: 0 0 0.25rem;
                  padding-right: 2.625rem;
                ">You</p>
                <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 0.625rem;">
                  <div style="
                    max-width: 68%;
                    background: var(--color-bg-elevated);
                    color: var(--color-text-default);
                    border: 1px solid var(--color-border-default);
                    border-radius: var(--radius-md) var(--radius-md) var(--radius-sm) var(--radius-md);
                    padding: 0.75rem 1rem;
                    font-family: var(--font-family-serif);
                    font-size: var(--font-size-md);
                    line-height: var(--line-height-normal);
                  ">
                    What lightness value should I target in OKLCH if a brand primary needs to pass WCAG AA on white?
                  </div>
                  <div
                    aria-hidden="true"
                    style="
                      width: 2rem;
                      height: 2rem;
                      border-radius: var(--radius-full);
                      background: var(--color-action-primary);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-shrink: 0;
                      font-family: var(--font-family-accessible);
                      /* 12px-ok: badge-chrome — initials in an avatar disc, not text to read.
                         The sender is stated in words beside the message. */
                      font-size: var(--font-size-xs);
                      font-weight: var(--font-weight-bold);
                      color: var(--color-text-on-action);
                      letter-spacing: 0.06em;
                    ">
                    P
                  </div>
                </div>
              </div>

              <div>
                <p style="
                  font-family: var(--font-family-accessible);
                  font-size: var(--font-size-sm);
                  font-weight: var(--font-weight-bold);
                  color: var(--color-text-subtle);
                  letter-spacing: 0.02em;
                  margin: 0 0 0.25rem;
                  padding-left: 2.625rem;
                ">Candor AI</p>
                <div style="display: flex; gap: 0.625rem; align-items: flex-start;">
                  <div
                    aria-hidden="true"
                    style="
                      width: 2rem;
                      height: 2rem;
                      border-radius: var(--radius-full);
                      background: var(--color-bg-surface);
                      border: 1px solid var(--color-border-default);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-shrink: 0;
                      font-family: var(--font-family-accessible);
                      /* 12px-ok: badge-chrome — initials in an avatar disc, not text to read.
                         The sender is stated in words beside the message. */
                      font-size: var(--font-size-xs);
                      font-weight: var(--font-weight-bold);
                      color: var(--color-text-subtle);
                      letter-spacing: 0.06em;
                    ">
                    AI
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <candor-article font="serif" justify lang="en">
                      <p>
                        For WCAG AA (4.5:1 against white), you need <strong>L&nbsp;≤&nbsp;0.55</strong>. Below that threshold, any reasonably saturated hue gives you the headroom you need — the exact cutoff shifts slightly with chroma, but 0.55 is a safe working ceiling.
                      </p>
                      <p>A practical navy starting point:</p>
                      <div class="code-block">
                        <pre tabindex="0"><code>// WCAG AA on white — L ≤ 0.55
--color-brand:        oklch(0.45 0.20 250);  // 7.1:1 ✅
--color-brand-hover:  oklch(0.38 0.20 250);  // 9.8:1 ✅
--color-brand-active: oklch(0.32 0.20 250);  // 13.2:1 ✅</code></pre>
                        <candor-button variant="ghost" size="small">Copy</candor-button>
                      </div>
                      <p>
                        Holding C and H constant means every interactive state is a pure lightness shift — the color stays recognizably itself across rest, hover, and active.
                      </p>
                    </candor-article>
                  </div>
                </div>
              </div>

              <div>
                <p style="
                  text-align: right;
                  font-family: var(--font-family-accessible);
                  font-size: var(--font-size-sm);
                  font-weight: var(--font-weight-bold);
                  color: var(--color-text-subtle);
                  letter-spacing: 0.02em;
                  margin: 0 0 0.25rem;
                  padding-right: 2.625rem;
                ">You</p>
                <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 0.625rem;">
                  <div style="
                    max-width: 68%;
                    background: var(--color-bg-elevated);
                    color: var(--color-text-default);
                    border: 1px solid var(--color-border-default);
                    border-radius: var(--radius-md) var(--radius-md) var(--radius-sm) var(--radius-md);
                    padding: 0.75rem 1rem;
                    font-family: var(--font-family-serif);
                    font-size: var(--font-size-md);
                    line-height: var(--line-height-normal);
                  ">
                    And for dark mode? I need the same hue to work on a dark page.
                  </div>
                  <div
                    aria-hidden="true"
                    style="
                      width: 2rem;
                      height: 2rem;
                      border-radius: var(--radius-full);
                      background: var(--color-action-primary);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-shrink: 0;
                      font-family: var(--font-family-accessible);
                      /* 12px-ok: badge-chrome — initials in an avatar disc, not text to read.
                         The sender is stated in words beside the message. */
                      font-size: var(--font-size-xs);
                      font-weight: var(--font-weight-bold);
                      color: var(--color-text-on-action);
                      letter-spacing: 0.06em;
                    ">
                    P
                  </div>
                </div>
              </div>

              <div>
                <p style="
                  font-family: var(--font-family-accessible);
                  font-size: var(--font-size-sm);
                  font-weight: var(--font-weight-bold);
                  color: var(--color-text-subtle);
                  letter-spacing: 0.02em;
                  margin: 0 0 0.25rem;
                  padding-left: 2.625rem;
                ">Candor AI</p>
                <div style="display: flex; gap: 0.625rem; align-items: flex-start;">
                  <div
                    aria-hidden="true"
                    style="
                      width: 2rem;
                      height: 2rem;
                      border-radius: var(--radius-full);
                      background: var(--color-bg-surface);
                      border: 1px solid var(--color-border-default);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-shrink: 0;
                      font-family: var(--font-family-accessible);
                      /* 12px-ok: badge-chrome — initials in an avatar disc, not text to read.
                         The sender is stated in words beside the message. */
                      font-size: var(--font-size-xs);
                      font-weight: var(--font-weight-bold);
                      color: var(--color-text-subtle);
                      letter-spacing: 0.06em;
                    ">
                    AI
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <candor-article font="serif" justify lang="en">
                      <p>
                        Dark mode inverts the contrast direction — now you need enough lightness <em>above</em> the dark background. On Candor's page color (<code>oklch(0.16 0.02 249)</code>), you need <strong>L&nbsp;≥&nbsp;0.60</strong> for 4.5:1.
                      </p>
                      <p>Keep the hue; step L up significantly, and ease off chroma slightly — high C at high L reads electric on a dark surface:</p>
                      <div class="code-block">
                        <pre tabindex="0"><code>// Same hue, inverted lightness, reduced chroma
--color-brand-dark:        oklch(0.72 0.18 250);  // 5.1:1 on dark page ✅
--color-brand-dark-hover:  oklch(0.80 0.16 250);  // 7.4:1 ✅
--color-brand-dark-active: oklch(0.85 0.14 250);  // 10.2:1 ✅</code></pre>
                        <candor-button variant="ghost" size="small">Copy</candor-button>
                      </div>
                      <p>
                        The chroma taper (0.18 → 0.14) is the same principle as the dark mode status colors — prevent the neon quality that high C at high L produces against a very dark background.
                      </p>
                    </candor-article>
                  </div>
                </div>
              </div>

            </div>

            <div class="chat-input-area" style="
              padding: 1rem 1.5rem 1.25rem;
              border-top: 1px solid var(--color-border-default);
              flex-shrink: 0;
            ">
              <candor-chat-input
                placeholder="Ask about color, type, spacing…"
                label="Message Candor AI"
                disclaimer="Candor AI can make mistakes. Review important information.">
              </candor-chat-input>
            </div>

          </div>
        </main>
      </div>
  `,
};
