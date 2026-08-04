import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Typography/AccessibleText',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Atkinson Hyperlegible** — the designated typeface for instructional UI text.

Use \`<candor-accessible-text>\` to apply Atkinson with automatic role-based sizing, tracking, and color.

### Instruction vs. comprehension

The core authoring decision is not "is this text important?" — all text in a well-designed UI is important. The question is: **does the user need to read this precisely to know what to do next?**

- **Use \`<candor-accessible-text>\`** for instructional text: form field labels, validation errors, status changes, action-required hints. The user must read these correctly to take the right action.
- **Use Roboto Flex** (\`--font-family-base\`) for comprehension text: data values, classification results, section headings that organise data, body prose. The user reads these to form a judgment, not to follow an instruction.

\`\`\`html
<!-- ✓ Instructional — user must read this precisely to fix their input -->
<candor-accessible-text role_="status" color="error">Enter a valid National Insurance number.</candor-accessible-text>

<!-- ✗ Wrong — "87% confidence" is a data value the user reads to understand, not to act.
     The annotation role is for instructional hints (e.g. format guidance), not data values. -->
<candor-accessible-text role_="annotation">87% confidence</candor-accessible-text>

<!-- ✓ Correct — comprehension data uses Roboto Flex with token styles -->
<span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">87%</span>
\`\`\`

---

### Five roles

| Role | Use case | Size | Weight | Style | Tier |
|---|---|---|---|---|---|
| \`label\` | Form field labels, structural anchors in instructional contexts | 14px | bold | uppercase | 2 |
| \`message\` | System messages, body-length guidance the user must act on | 16px | regular | — | 1 |
| \`status\` | Validation errors and action-required text — what the user must **do next** | 16px | regular | — | 1 |
| \`state\` | Outcomes that have **already happened** — renders a tone icon | 14px | regular | — | 3 |
| \`annotation\` | Hints, constraints, legal small print that guide an action | 14px | regular | italic | 3 |

**The tier decides the size, and the split between \`status\` and \`state\` is the clearest case of it.**

\`status\` is Tier 1: the text is the *sole* channel for an instruction. An icon beside "Enter a valid National Insurance number" can say that something is wrong, but not which field or what format — so nothing makes 14px sufficient, and Tier 1 regular is required to be 16px. At 14px the old 9.5 floor was unreachable by any chromatic text colour in the system, which made validation errors the one place where the mandated size and the required contrast could not both be met (#208).

\`state\` is Tier 3: the component renders an \`aria-hidden\` tone icon, so the outcome genuinely *is* redundantly coded and 14px is fine. The redundancy is structural — you cannot forget it — which is what makes the lower floor honest rather than asserted.

A useful test: **could a reader who cannot resolve the glyphs still act correctly?** For "All responses processed" beside a green check, yes. For "Enter a valid National Insurance number", no. The first is \`state\`; the second is \`status\`.

Note also what \`state\` does with colour. The icon carries the tone using the \`--color-status-*\` tokens — which are validated for non-text use and must never be used as text colour — while the text stays at \`--color-text-default\` (OKCA 11.5 on page). Moving the colour burden onto the icon is what removes the contrast problem entirely rather than negotiating with it.

**Section headings that label data** (not instructional) should use \`<candor-text variant="label">\` instead — same visual treatment, Roboto Flex.

---

### Bold rule

**Bold is for hierarchy, not urgency.** \`role_="label"\` always renders bold. Do not set \`bold\` on \`role="status"\` for error states — the error color carries the urgency signal. Bold on top of error color reads as double-emphasis and disrupts hierarchy.

\`\`\`html
<!-- ✓ Regular for status — color carries urgency -->
<candor-accessible-text role_="status" color="error">Enter a valid number.</candor-accessible-text>

<!-- ✗ Wrong — bold + error color is double-emphasis -->
<candor-accessible-text role_="status" color="error" bold>Enter a valid number.</candor-accessible-text>
\`\`\`

---

### Tracking

Atkinson requires positive letter-spacing to prevent glyph clustering (adjacent glyphs like "rr" reading as "m"). Spacing is applied automatically per role — never override to \`letter-spacing: 0\`.

---

### Note on the \`role_\` attribute

The attribute is named \`role_\` (trailing underscore) because \`role\` is a reserved ARIA attribute on every HTML element and using it as the Web Component (WC) property would conflict with the host element's actual ARIA role.
        `.trim(),
      },
    },
  },
  argTypes: {
    role_: {
      control: 'select',
      options: ['label', 'message', 'status', 'state', 'annotation'],
      description: 'Functional role in the UI',
    },
    tone: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
      description: 'Outcome tone — selects the icon. Only applies to role_="state".',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size override (applied after role defaults)',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled', 'error'],
      description: 'Text color',
    },
    bold: {
      control: 'boolean',
      description: 'Bold weight — for hierarchy/labels only, not urgency',
    },
  },
  args: { role_: 'label', color: 'primary', tone: 'info', bold: false },
  render: (args) => html`<candor-accessible-text role_="${args['role_']}"${args['size'] ? ` size="${args['size']}"` : ''} color="${args['color']}" tone="${args['tone']}" ?bold=${args['bold']}>Accessible Text Playground</candor-accessible-text>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const StatusMessages: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <candor-accessible-text role_="status" color="error">Error: This field is required.</candor-accessible-text>

      <div style="background:var(--color-status-warning-bg);padding:0.5rem 0.75rem;border-left:3px solid var(--color-status-warning);border-radius:var(--radius-sm);">
        <candor-accessible-text role_="message">Warning: This action cannot be undone.</candor-accessible-text>
      </div>

      <div style="background:var(--color-status-success-bg);padding:0.5rem 0.75rem;border-left:3px solid var(--color-status-success);border-radius:var(--radius-sm);">
        <candor-accessible-text role_="message">Success: Your changes have been saved.</candor-accessible-text>
      </div>

      <candor-accessible-text role_="message" color="secondary">Your session will expire in 5 minutes.</candor-accessible-text>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'No glyph is typed into the text. A literal `✕` or `⚠` in content is announced by a screen ' +
          'reader ("multiplication sign"), so the state is carried in words — "Error:", "Warning:" — ' +
          'which every user receives. Where an *icon* is wanted as a redundant visual channel, use ' +
          '`role_="state"`, which renders an `aria-hidden` one for you.',
      },
    },
  },
};

export const StateOutcomes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:520px;">
      <candor-accessible-text role_="state" tone="success">All responses processed — no flags raised</candor-accessible-text>
      <candor-accessible-text role_="state" tone="warning">3 responses flagged for review</candor-accessible-text>
      <candor-accessible-text role_="state" tone="error">Sync failed — last synced 14 minutes ago</candor-accessible-text>
      <candor-accessible-text role_="state" tone="info">Draft saved automatically</candor-accessible-text>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          '`role_="state"` reports an **outcome** — something that has happened — as opposed to ' +
          '`role_="status"`, which tells the user what they must do next.\n\n' +
          'That difference is why this role stays at 14px while `status` is 16px. The icon is a ' +
          'genuine redundant channel for the outcome, so the text is Tier 3 — OKCA 4.5 floor — rather ' +
          'than Tier 1. The redundancy is structural — the component renders the icon, so it cannot ' +
          'be forgotten.\n\n' +
          'Note what the icon does **not** do: it carries the outcome, not an instruction. A ' +
          'validation error stays `role_="status"` at 16px, because there an icon can only say ' +
          '"something is wrong" while the text has to say *which field and what format* — and no ' +
          'icon makes that readable.\n\n' +
          'The text needs no colour of its own. The icon carries the state in the ' +
          '`--color-status-*` tokens, which are validated for non-text use, so the text stays at ' +
          '`--color-text-default` (OKCA 11.5 on page) and clears every floor with margin. The icon is ' +
          '`aria-hidden`; screen-reader users get the outcome from the wording, which is why each ' +
          'line reads correctly on its own.',
      },
    },
  },
};

export const FontComparison: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 240px), 1fr));gap:2rem;">
      <div style="display:flex;flex-direction:column;gap:0.75rem;font-family:var(--font-family-base);">
        <p style="font-size:var(--font-size-sm);text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0;">Roboto Flex</p>
        <span style="font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;line-height:var(--line-height-tight);">FORM LABEL</span>
        <span style="font-size:var(--font-size-md);letter-spacing:0.02em;line-height:var(--line-height-normal);">The quick brown fox jumps over the lazy dog.</span>
        <span style="font-size:var(--font-size-sm);letter-spacing:0.02em;line-height:var(--line-height-relaxed);font-style:italic;color:var(--color-text-subtle);">Supplementary annotation for context.</span>
        <span style="font-size:var(--font-size-md);letter-spacing:0.02em;line-height:var(--line-height-tight);color:var(--color-status-error-text);">Error: This field is required.</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <p style="font-size:var(--font-size-sm);text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0;">Atkinson Hyperlegible</p>
        <candor-accessible-text role_="label" bold>FORM LABEL</candor-accessible-text>
        <candor-accessible-text role_="message">The quick brown fox jumps over the lazy dog.</candor-accessible-text>
        <candor-accessible-text role_="annotation" color="secondary">Supplementary annotation for context.</candor-accessible-text>
        <candor-accessible-text role_="status" color="error">Error: This field is required.</candor-accessible-text>
      </div>
    </div>
  `,
};

export const CriticalFormContext: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Label casing rule:** form field labels use sentence case ("National Insurance number", "Email address") — they name what the user fills in.
Structural UI anchors — \`<candor-accessible-text role_="label">\` used to head a region or column — render uppercase via CSS ("PAGE BACKGROUND", "SURFACE BACKGROUND").
The test: does the user fill it in? → sentence case. Does it label a section of the interface? → uppercase Atkinson anchor.`,
      },
    },
  },
  render: () => html`
    <div style="max-width:400px;display:flex;flex-direction:column;gap:var(--spacing-lg);">
      <candor-card>
        <candor-input
          label="National Insurance number"
          value="QQ 00 00 00"
          hint="It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'."
          error="Enter a National Insurance number in the correct format."
        ></candor-input>
      </candor-card>
      <candor-card>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <candor-input
            label="Email address"
            type="email"
            value="user@example.com"
          ></candor-input>
          <div style="background:var(--color-status-success-bg);padding:var(--spacing-xs) var(--spacing-sm);border-left:var(--border-width-thick) solid var(--color-status-success);border-radius:var(--radius-sm);">
            <candor-accessible-text role_="state" tone="success">Email verified</candor-accessible-text>
          </div>
        </div>
      </candor-card>
    </div>
  `,
};

export const AllRoles: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-width:520px;">
      <candor-card>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0;font-family:var(--font-family-mono);">role_="label"</p>
          <candor-accessible-text role_="label">Section Title / Form Field Label</candor-accessible-text>
        </div>
      </candor-card>
      <candor-card>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0;font-family:var(--font-family-mono);">role_="message"</p>
          <candor-accessible-text role_="message">System message: Your request has been received and is being processed. You will receive a confirmation email shortly.</candor-accessible-text>
        </div>
      </candor-card>
      <candor-card>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0;font-family:var(--font-family-mono);">role_="status"</p>
          <candor-accessible-text role_="status" color="error">Validation failed — 3 fields require attention</candor-accessible-text>
        </div>
      </candor-card>
      <candor-card>
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <p style="font-size:var(--font-size-sm);color:var(--color-text-subtle);margin:0;font-family:var(--font-family-mono);">role_="annotation"</p>
          <candor-accessible-text role_="annotation" color="secondary">This information is collected under the Data Protection Act 2018. Your data will not be shared with third parties without your consent.</candor-accessible-text>
        </div>
      </candor-card>
    </div>
  `,
};

export const AICardMetadataHeaders: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);max-width:520px;">
      <candor-card>
        <div slot="header" style="display:flex;gap:var(--spacing-md);">
          <candor-accessible-text role_="annotation" color="secondary">Model: GPT-4o</candor-accessible-text>
          <candor-accessible-text role_="annotation" color="secondary">Confidence: High</candor-accessible-text>
          <candor-accessible-text role_="annotation" color="secondary">Generated 3 min ago</candor-accessible-text>
        </div>
        <p style="font-family:var(--font-family-reading);font-size:var(--font-size-md);line-height:var(--line-height-relaxed);margin:0;">The proposed development is consistent with Policy H3 of the Local Plan. No material objections have been identified by statutory consultees.</p>
      </candor-card>
      <candor-card>
        <p style="font-family:var(--font-family-reading);font-size:var(--font-size-md);line-height:var(--line-height-relaxed);margin:0;">Traffic modelling suggests peak-hour queuing on the B4632 will increase by approximately 4 minutes under the proposed development scenario.</p>
        <div slot="footer" style="display:flex;gap:var(--spacing-md);">
          <candor-accessible-text role_="annotation" color="secondary">Source: Transport Assessment §4.2</candor-accessible-text>
          <candor-accessible-text role_="annotation" color="secondary">Reviewed by planning officer</candor-accessible-text>
        </div>
      </candor-card>
    </div>
  `,
};

export const AIConfidenceScores: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);max-width:480px;">
      <candor-card padding="sm">
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);">Supportive</span>
            <candor-accessible-text role_="annotation" color="secondary">87% confidence</candor-accessible-text>
          </div>
          <candor-accessible-text role_="annotation" color="secondary">Sentiment classification · Agenda item 3</candor-accessible-text>
        </div>
      </candor-card>
      <div style="background:var(--color-status-warning-bg);border:var(--border-width-thin) solid var(--color-status-warning);border-radius:var(--radius-md);padding:var(--spacing-sm);display:flex;flex-direction:column;gap:var(--spacing-xs);">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-family:var(--font-family-base);font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);">Neutral / Ambiguous</span>
          <candor-accessible-text role_="annotation" color="secondary">43% confidence</candor-accessible-text>
        </div>
        <candor-accessible-text role_="state" tone="warning">Requires human review — confidence below threshold</candor-accessible-text>
      </div>
      <candor-card padding="sm">
        <div style="display:flex;flex-direction:column;gap:var(--spacing-xs);">
          <candor-text variant="label">Classification breakdown</candor-text>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-default);">Supportive</span>
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">87%</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-default);">Neutral</span>
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">9%</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-default);">Opposed</span>
            <span style="font-family:var(--font-family-base);font-size:var(--font-size-sm);color:var(--color-text-subtle);">4%</span>
          </div>
        </div>
      </candor-card>
    </div>
  `,
};

export const AIStressContextCounters: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--spacing-sm);max-width:480px;">
      <candor-card padding="sm">
        <div slot="header" style="display:flex;justify-content:space-between;align-items:center;">
          Review queue
          <!-- A data readout, not an instruction — the user reads it to form a
               judgment, so it is comprehension text in Roboto Flex, not Atkinson.
               The progress bar below is its redundant channel. -->
          <candor-text variant="body" size="sm" color="secondary">14 of 47 reviewed</candor-text>
        </div>
        <div style="height:6px;background:var(--color-bg-page);border-radius:var(--radius-full);overflow:hidden;">
          <div style="height:100%;width:30%;background:var(--color-action-primary);border-radius:var(--radius-full);"></div>
        </div>
      </candor-card>
      <div style="background:var(--color-status-warning-bg);border:var(--border-width-thin) solid var(--color-status-warning);border-radius:var(--radius-md);padding:var(--spacing-sm);display:flex;align-items:center;gap:var(--spacing-xs);">
        <candor-accessible-text role_="state" tone="warning">3 responses flagged for review</candor-accessible-text>
      </div>
      <candor-card padding="sm">
        <candor-accessible-text role_="state" tone="success">All responses processed — no flags raised</candor-accessible-text>
      </candor-card>
    </div>
  `,
};
