import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { ButtonComponent } from '../components/button/button.component';
import { CardComponent } from '../components/card/card.component';
import { AccessibleTextComponent } from '../components/typography/accessible-text/accessible-text.component';
import { ChatInputComponent } from '../components/form/chat-input/chat-input.component';

const meta: Meta = {
  title: 'Examples/Chat Example',
  decorators: [
    moduleMetadata({
      imports: [
        NavigationComponent,
        BadgeComponent,
        ButtonComponent,
        CardComponent,
        AccessibleTextComponent,
        ChatInputComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const AIChatInterface: Story = {
  render: () => ({
    props: {
      navItems: [
        { label: 'Chat', href: '#', active: true },
        { label: 'Docs', href: '#' },
        { label: 'API', href: '#' },
      ],
    },
    template: `
      <div style="min-height: 100vh; background: var(--color-bg-page); display: flex; flex-direction: column;">

        <!-- Navigation -->
        <app-navigation
          brand="Candor"
          [items]="navItems"
          orientation="horizontal">
        </app-navigation>

        <!-- Chat layout -->
        <div style="flex: 1; display: flex;">

          <!-- Sidebar -->
          <aside
            aria-label="Conversation history"
            style="
              width: 220px;
              flex-shrink: 0;
              background: var(--color-bg-surface);
              border-right: 1px solid var(--color-border-default);
              display: flex;
              flex-direction: column;
              gap: 1rem;
              padding: 1rem 0.75rem;
            ">

            <app-button variant="tertiary" size="small">+ New conversation</app-button>

            <nav aria-label="Recent conversations">
              <app-accessible-text
                role="label"
                style="display: block; padding: 0 0.5rem; margin-bottom: 0.375rem;">
                Recent
              </app-accessible-text>

              <!-- Active conversation -->
              <a href="#" aria-current="page" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                background: var(--color-bg-elevated);
                text-decoration: none;
                margin-bottom: 0.125rem;
              ">
                <app-accessible-text role="annotation">OKLCH for brand colors</app-accessible-text>
              </a>

              <a href="#" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                margin-bottom: 0.125rem;
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-text-subtle-on-surface);
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
                color: var(--color-text-subtle-on-surface);
                letter-spacing: 0.02em;
              ">Tonal palette from hex</a>
              <a href="#" style="
                display: block;
                padding: 0.5rem;
                border-radius: var(--radius-sm);
                text-decoration: none;
                font-family: var(--font-family-accessible);
                font-size: var(--font-size-sm);
                color: var(--color-text-subtle-on-surface);
                letter-spacing: 0.02em;
              ">Dark mode contrast strategy</a>
            </nav>
          </aside>

          <!-- Main chat column -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">

            <!-- Chat header -->
            <header style="
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
              <app-badge variant="success" size="sm">Online</app-badge>
            </header>

            <!-- Message thread -->
            <div
              role="log"
              aria-label="Conversation"
              aria-live="polite"
              style="
                flex: 1;
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
              ">

              <!-- ── User message 1 ── -->
              <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 0.625rem;">
                <div style="
                  max-width: 68%;
                  background: var(--color-action-primary);
                  color: var(--color-text-on-action);
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
                    background: var(--color-bg-surface);
                    border: 1px solid var(--color-border-strong);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-family: var(--font-family-accessible);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text-subtle-on-surface);
                    letter-spacing: 0.06em;
                  ">
                  P
                </div>
              </div>

              <!-- ── Assistant message 1 ── -->
              <div style="display: flex; gap: 0.625rem; align-items: flex-start;">
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
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text-on-action);
                    letter-spacing: 0.06em;
                  ">
                  AI
                </div>
                <div style="flex: 1; min-width: 0;">
                  <app-card variant="default" style="display: block;">
                    <div style="
                      font-family: var(--font-family-serif);
                      font-size: var(--font-size-md);
                      line-height: var(--line-height-relaxed);
                      color: var(--color-text-default);
                      display: flex;
                      flex-direction: column;
                      gap: 0.875rem;
                    ">
                      <p style="margin: 0;">
                        For WCAG AA (4.5:1 against white), you need <strong>L&nbsp;≤&nbsp;0.55</strong>. Below that threshold, any reasonably saturated hue gives you the headroom you need — the exact cutoff shifts slightly with chroma, but 0.55 is a safe working ceiling.
                      </p>
                      <p style="margin: 0;">A practical navy starting point:</p>
                      <pre style="
                        background: var(--color-bg-code);
                        color: var(--color-text-code);
                        padding: 1rem;
                        border-radius: var(--radius-sm);
                        font-family: var(--font-family-mono);
                        font-size: var(--font-size-sm);
                        line-height: 1.6;
                        overflow-x: auto;
                        margin: 0;
                        border: 1px solid var(--color-border-code);
                      " tabindex="0"><code>// WCAG AA on white — L ≤ 0.55
--color-brand:        oklch(0.45 0.20 250);  // 7.1:1 ✅
--color-brand-hover:  oklch(0.38 0.20 250);  // 9.8:1 ✅
--color-brand-active: oklch(0.32 0.20 250);  // 13.2:1 ✅</code></pre>
                      <p style="margin: 0;">
                        Holding C and H constant means every interactive state is a pure lightness shift — the color stays recognizably itself across rest, hover, and active.
                      </p>
                    </div>
                  </app-card>
                </div>
              </div>

              <!-- ── User message 2 ── -->
              <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 0.625rem;">
                <div style="
                  max-width: 68%;
                  background: var(--color-action-primary);
                  color: var(--color-text-on-action);
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
                    background: var(--color-bg-surface);
                    border: 1px solid var(--color-border-strong);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-family: var(--font-family-accessible);
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text-subtle-on-surface);
                    letter-spacing: 0.06em;
                  ">
                  P
                </div>
              </div>

              <!-- ── Assistant message 2 ── -->
              <div style="display: flex; gap: 0.625rem; align-items: flex-start;">
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
                    font-size: var(--font-size-xs);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text-on-action);
                    letter-spacing: 0.06em;
                  ">
                  AI
                </div>
                <div style="flex: 1; min-width: 0;">
                  <app-card variant="default" style="display: block;">
                    <div style="
                      font-family: var(--font-family-serif);
                      font-size: var(--font-size-md);
                      line-height: var(--line-height-relaxed);
                      color: var(--color-text-default);
                      display: flex;
                      flex-direction: column;
                      gap: 0.875rem;
                    ">
                      <p style="margin: 0;">
                        Dark mode inverts the contrast direction — now you need enough lightness <em>above</em> the dark background. On Candor's page color (<code style="font-family: var(--font-family-mono); font-size: 0.9em; background: var(--color-bg-surface); padding: 0.1em 0.35em; border-radius: var(--radius-sm); color: var(--color-highlight);">oklch(0.16 0.02 249)</code>), you need <strong>L&nbsp;≥&nbsp;0.60</strong> for 4.5:1.
                      </p>
                      <p style="margin: 0;">Keep the hue; step L up significantly, and ease off chroma slightly — high C at high L reads electric on a dark surface:</p>
                      <pre style="
                        background: var(--color-bg-code);
                        color: var(--color-text-code);
                        padding: 1rem;
                        border-radius: var(--radius-sm);
                        font-family: var(--font-family-mono);
                        font-size: var(--font-size-sm);
                        line-height: 1.6;
                        overflow-x: auto;
                        margin: 0;
                        border: 1px solid var(--color-border-code);
                      " tabindex="0"><code>// Same hue, inverted lightness, reduced chroma
--color-brand-dark:        oklch(0.72 0.18 250);  // 5.1:1 on dark page ✅
--color-brand-dark-hover:  oklch(0.80 0.16 250);  // 7.4:1 ✅
--color-brand-dark-active: oklch(0.85 0.14 250);  // 10.2:1 ✅</code></pre>
                      <p style="margin: 0;">
                        The chroma taper (0.18 → 0.14) is the same principle as the dark mode status colors — prevent the neon quality that high C at high L produces against a very dark background.
                      </p>
                    </div>
                  </app-card>
                </div>
              </div>

            </div>

            <!-- Compose area -->
            <div style="
              padding: 1rem 1.5rem 1.25rem;
              border-top: 1px solid var(--color-border-default);
              flex-shrink: 0;
            ">
              <app-chat-input
                placeholder="Ask about color, type, spacing…"
                label="Message Candor AI"
                disclaimer="Candor AI can make mistakes. Review important information.">
              </app-chat-input>
            </div>

          </div>
        </div>
      </div>
    `,
  }),
};
