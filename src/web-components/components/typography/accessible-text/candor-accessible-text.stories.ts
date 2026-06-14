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

### Four roles

| Role | Use case | Size | Weight | Style |
|---|---|---|---|---|
| \`label\` | Form field labels, structural anchors in instructional contexts | 14px | bold | uppercase |
| \`message\` | System messages, body-length guidance the user must act on | 16px | regular | — |
| \`status\` | Validation errors, live counters, state changes | 14px | regular | — |
| \`annotation\` | Hints, constraints, legal small print that guide an action | 14px | regular | italic |

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
      options: ['label', 'message', 'status', 'annotation'],
      description: 'Functional role in the UI',
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
  args: { role_: 'label', color: 'primary', bold: false },
  render: (args) => html`<candor-accessible-text role_="${args['role_']}"${args['size'] ? ` size="${args['size']}"` : ''} color="${args['color']}" ${args['bold'] ? 'bold' : ''}>Accessible Text Playground</candor-accessible-text>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const StatusMessages: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <candor-accessible-text role_="status" color="error">✕ Error: This field is required.</candor-accessible-text>

      <div style="background:var(--color-status-warning-bg);padding:0.5rem 0.75rem;border-left:3px solid var(--color-status-warning);border-radius:var(--radius-sm);">
        <candor-accessible-text role_="message">⚠ Warning: This action cannot be undone.</candor-accessible-text>
      </div>

      <div style="background:var(--color-status-success-bg);padding:0.5rem 0.75rem;border-left:3px solid var(--color-status-success);border-radius:var(--radius-sm);">
        <candor-accessible-text role_="message">✓ Success: Your changes have been saved.</candor-accessible-text>
      </div>

      <candor-accessible-text role_="message" color="secondary">ℹ Your session will expire in 5 minutes.</candor-accessible-text>
    </div>
  `,
};

export const FontComparison: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
      <div style="display:flex;flex-direction:column;gap:0.75rem;font-family:var(--font-family-base);">
        <p style="font-size:var(--font-size-sm);text-transform:uppercase;letter-spacing:0.08em;color:var(--color-text-subtle);margin:0;">Roboto Flex</p>
        <span style="font-size:var(--font-size-sm);font-weight:var(--font-weight-bold);letter-spacing:var(--letter-spacing-wide);text-transform:uppercase;line-height:var(--line-height-tight);">FORM LABEL</span>
        <span style="font-size:var(--font-size-md);letter-spacing:0.02em;line-height:var(--line-height-normal);">The quick brown fox jumps over the lazy dog.</span>
        <span style="font-size:var(--font-size-sm);letter-spacing:0.02em;line-height:var(--line-height-relaxed);font-style:italic;color:var(--color-text-subtle);">Supplementary annotation for context.</span>
        <span style="font-size:var(--font-size-sm);letter-spacing:0.02em;line-height:var(--line-height-tight);color:var(--color-status-error-text);">Error: This field is required.</span>
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
            <candor-accessible-text role_="status">✓ Email verified</candor-accessible-text>
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
          <candor-accessible-text role_="status" color="error">✕ Validation failed — 3 fields require attention</candor-accessible-text>
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
        <candor-accessible-text role_="status">Requires human review — confidence below threshold</candor-accessible-text>
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
          <candor-accessible-text role_="status" color="secondary">14 of 47 reviewed</candor-accessible-text>
        </div>
        <div style="height:6px;background:var(--color-bg-page);border-radius:var(--radius-full);overflow:hidden;">
          <div style="height:100%;width:30%;background:var(--color-action-primary);border-radius:var(--radius-full);"></div>
        </div>
      </candor-card>
      <div style="background:var(--color-status-warning-bg);border:var(--border-width-thin) solid var(--color-status-warning);border-radius:var(--radius-md);padding:var(--spacing-sm);display:flex;align-items:center;gap:var(--spacing-xs);">
        <candor-accessible-text role_="status">⚠ 3 responses flagged for review</candor-accessible-text>
      </div>
      <candor-card padding="sm">
        <candor-accessible-text role_="status">✓ All responses processed — no flags raised</candor-accessible-text>
      </candor-card>
    </div>
  `,
};
