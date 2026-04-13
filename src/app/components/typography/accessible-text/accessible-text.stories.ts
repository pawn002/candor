import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccessibleTextComponent } from './accessible-text.component';
import { TextComponent } from '../text/text.component';

const meta: Meta<AccessibleTextComponent> = {
  title: 'Typography/AccessibleText',
  component: AccessibleTextComponent,
  tags: ['autodocs'],
  argTypes: {
    role: {
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
      description: 'Text color (warning/success are non-text tokens — use *-bg panels instead)',
    },
    bold: {
      control: 'boolean',
      description: 'Bold weight override',
    },
  },
};

export default meta;
type Story = StoryObj<AccessibleTextComponent>;

export const Default: Story = {
  args: {
    role: 'label',
    size: 'md',
    color: 'primary',
    bold: false,
  },
  render: (args) => ({
    props: args,
    template: `<app-accessible-text [role]="role" [size]="size" [color]="color" [bold]="bold">
      Accessible Text Playground
    </app-accessible-text>`,
  }),
};

export const StatusMessages: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Error: colored text OK (OKCA 4.8) -->
        <app-accessible-text role="status" color="error">✕ Error: This field is required.</app-accessible-text>

        <!-- Warning: use bg tint + dark text, not colored text -->
        <div style="background: var(--color-status-warning-bg); padding: 0.5rem 0.75rem; border-left: 3px solid var(--color-status-warning); border-radius: var(--radius-sm);">
          <app-accessible-text role="message">⚠ Warning: This action cannot be undone.</app-accessible-text>
        </div>

        <!-- Success: use bg tint + dark text, not colored text -->
        <div style="background: var(--color-status-success-bg); padding: 0.5rem 0.75rem; border-left: 3px solid var(--color-status-success); border-radius: var(--radius-sm);">
          <app-accessible-text role="message">✓ Success: Your changes have been saved.</app-accessible-text>
        </div>

        <app-accessible-text role="message" color="secondary">ℹ Your session will expire in 5 minutes.</app-accessible-text>
      </div>
    `,
  }),
};

export const FontComparison: Story = {
  decorators: [
    moduleMetadata({
      imports: [TextComponent],
    }),
  ],
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0;">Roboto Flex</p>
          <app-text variant="label" size="sm" [bold]="true">FORM LABEL</app-text>
          <app-text variant="body" size="md">The quick brown fox jumps over the lazy dog.</app-text>
          <app-text variant="caption" size="sm" color="secondary">Supplementary annotation for context.</app-text>
          <app-text variant="body" size="sm" color="secondary">Error: This field is required.</app-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-subtle); margin: 0;">Atkinson Hyperlegible</p>
          <app-accessible-text role="label">FORM LABEL</app-accessible-text>
          <app-accessible-text role="message">The quick brown fox jumps over the lazy dog.</app-accessible-text>
          <app-accessible-text role="annotation" color="secondary">Supplementary annotation for context.</app-accessible-text>
          <app-accessible-text role="status" color="error">Error: This field is required.</app-accessible-text>
        </div>
      </div>
    `,
  }),
};

export const CriticalFormContext: Story = {
  render: () => ({
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
          <app-accessible-text role="label" [bold]="true" id="ni-label">National Insurance number</app-accessible-text>
          <app-accessible-text role="annotation" color="secondary">It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'.</app-accessible-text>
          <input
            type="text"
            style="
              border: 2px solid var(--color-status-error);
              border-radius: var(--radius-sm);
              padding: 0.5rem 0.75rem;
              font-family: var(--font-family-base);
              font-size: var(--font-size-md);
              width: 100%;
              box-sizing: border-box;
            "
            value="QQ 00 00 00"
            aria-labelledby="ni-label"
            aria-describedby="ni-error"
          />
          <app-accessible-text role="status" color="error" id="ni-error">Enter a National Insurance number in the correct format.</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.375rem;">
          <app-accessible-text role="label" [bold]="true" id="email-label">Email address</app-accessible-text>
          <input
            type="email"
            style="
              border: 2px solid var(--color-border-strong);
              border-radius: var(--radius-sm);
              padding: 0.5rem 0.75rem;
              font-family: var(--font-family-base);
              font-size: var(--font-size-md);
              width: 100%;
              box-sizing: border-box;
            "
            value="user@example.com"
            aria-labelledby="email-label"
          />
          <div style="background: var(--color-status-success-bg); padding: 0.375rem 0.625rem; border-left: 3px solid var(--color-status-success); border-radius: var(--radius-sm); display: inline-block; margin-top: 0.25rem;">
            <app-accessible-text role="status">✓ Email verified</app-accessible-text>
          </div>
        </div>
      </div>
    `,
  }),
};

export const AllRoles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="label"</p>
          <app-accessible-text role="label">Section Title / Form Field Label</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="message"</p>
          <app-accessible-text role="message">System message: Your request has been received and is being processed. You will receive a confirmation email shortly.</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="status"</p>
          <app-accessible-text role="status" color="error">✕ Validation failed — 3 fields require attention</app-accessible-text>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <p style="font-size: 0.7rem; color: var(--color-text-subtle); margin: 0; font-family: var(--font-family-mono);">role="annotation"</p>
          <app-accessible-text role="annotation" color="secondary">This information is collected under the Data Protection Act 2018. Your data will not be shared with third parties without your consent.</app-accessible-text>
        </div>
      </div>
    `,
  }),
};

// ── AI-app patterns ────────────────────────────────────────────────────────────
// Three recurring patterns discovered in real AI-assisted application migrations.
// Atkinson Hyperlegible is correct for all three: small-size critical text that
// must remain legible under cognitive load.

export const AICardMetadataHeaders: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Pattern: Card metadata headers in AI apps**

Atkinson Hyperlegible at \`role="annotation"\` size (14px) with positive letter-spacing.
Use this pattern for the metadata strip at the top or bottom of AI-generated content cards:
model attribution, confidence tier, generation timestamp, source references.

Rules:
- Regular weight (400) — the metadata is supporting information, not a headline
- Color \`secondary\` — subordinate to the card's primary content
- Never bold — bold would compete with card headings above
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 520px;">

        <!-- Pattern A: top metadata strip -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        ">
          <div style="
            padding: var(--spacing-xs) var(--spacing-sm);
            border-bottom: var(--border-width-thin) solid var(--color-border-subtle);
            display: flex;
            gap: var(--spacing-md);
          ">
            <app-accessible-text role="annotation" color="secondary">Model: GPT-4o</app-accessible-text>
            <app-accessible-text role="annotation" color="secondary">Confidence: High</app-accessible-text>
            <app-accessible-text role="annotation" color="secondary">Generated 3 min ago</app-accessible-text>
          </div>
          <div style="padding: var(--spacing-sm);">
            <p style="font-family: var(--font-family-reading); font-size: var(--font-size-md); line-height: var(--line-height-relaxed); margin: 0;">
              The proposed development is consistent with Policy H3 of the Local Plan.
              No material objections have been identified by statutory consultees.
            </p>
          </div>
        </div>

        <!-- Pattern B: bottom attribution strip -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        ">
          <div style="padding: var(--spacing-sm);">
            <p style="font-family: var(--font-family-reading); font-size: var(--font-size-md); line-height: var(--line-height-relaxed); margin: 0;">
              Traffic modelling suggests peak-hour queuing on the B4632 will increase
              by approximately 4 minutes under the proposed development scenario.
            </p>
          </div>
          <div style="
            padding: var(--spacing-xs) var(--spacing-sm);
            border-top: var(--border-width-thin) solid var(--color-border-subtle);
            display: flex;
            gap: var(--spacing-md);
          ">
            <app-accessible-text role="annotation" color="secondary">Source: Transport Assessment §4.2</app-accessible-text>
            <app-accessible-text role="annotation" color="secondary">Reviewed by planning officer</app-accessible-text>
          </div>
        </div>

      </div>
    `,
  }),
};

export const AIConfidenceScores: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Pattern: Inline confidence and probability scores**

Atkinson at \`role="annotation"\` size alongside classification results or AI outputs.
The score is supporting metadata — smaller than the primary label, regular weight.

Rules:
- Regular weight — the numeric score is a qualifier, not a headline
- Color \`secondary\` for scores within acceptable confidence range
- Color \`error\` (via status token bg panels) for low-confidence thresholds that require human review
- Never display raw decimal probabilities (0.873) to end users — format as percentage (87%) or tier (High / Medium / Low)
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 480px;">

        <!-- Classification result with confidence score -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        ">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);">Supportive</span>
            <app-accessible-text role="annotation" color="secondary">87% confidence</app-accessible-text>
          </div>
          <app-accessible-text role="annotation" color="secondary">Sentiment classification · Agenda item 3</app-accessible-text>
        </div>

        <!-- Low confidence — requires review -->
        <div style="
          background: var(--color-status-warning-bg);
          border: var(--border-width-thin) solid var(--color-status-warning);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        ">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-family: var(--font-family-base); font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);">Neutral / Ambiguous</span>
            <app-accessible-text role="annotation" color="secondary">43% confidence</app-accessible-text>
          </div>
          <app-accessible-text role="status">Requires human review — confidence below threshold</app-accessible-text>
        </div>

        <!-- Multi-class breakdown -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        ">
          <app-accessible-text role="label" [bold]="true">Classification breakdown</app-accessible-text>
          <div style="display: flex; justify-content: space-between;">
            <app-accessible-text role="annotation">Supportive</app-accessible-text>
            <app-accessible-text role="annotation" color="secondary">87%</app-accessible-text>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <app-accessible-text role="annotation">Neutral</app-accessible-text>
            <app-accessible-text role="annotation" color="secondary">9%</app-accessible-text>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <app-accessible-text role="annotation">Opposed</app-accessible-text>
            <app-accessible-text role="annotation" color="secondary">4%</app-accessible-text>
          </div>
        </div>

      </div>
    `,
  }),
};

export const AIStressContextCounters: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Pattern: Stress-context live counters**

Session-sensitive counts that change as the user works — items awaiting review, responses
processed, flags raised. These use \`role="status"\` (announced by screen readers when updated)
and Atkinson at annotation size.

Rules:
- \`role="status"\` so assistive technology announces changes without interrupting focus
- Regular weight — urgency is carried by color and icon, not weight
- Positive tracking (\`letter-spacing: 0.02em\` via the annotation role default) — prevents digit clustering
- The live region must always be in the DOM, even when the count is zero (see CLAUDE.md live region pattern)
        `.trim(),
      },
    },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 480px;">

        <!-- Session progress bar with live counter -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <app-accessible-text role="label" [bold]="true">Review queue</app-accessible-text>
            <!-- role="status" — announced when count changes -->
            <app-accessible-text role="status" color="secondary">14 of 47 reviewed</app-accessible-text>
          </div>
          <div style="
            height: 6px;
            background: var(--color-bg-page);
            border-radius: var(--radius-full);
            overflow: hidden;
          ">
            <div style="
              height: 100%;
              width: 30%;
              background: var(--color-action-primary);
              border-radius: var(--radius-full);
            "></div>
          </div>
        </div>

        <!-- Warning threshold counter -->
        <div style="
          background: var(--color-status-warning-bg);
          border: var(--border-width-thin) solid var(--color-status-warning);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        ">
          <i class="ph ph-warning ph-regular" style="font-size: 1rem; color: var(--color-status-warning); line-height: 1; flex-shrink: 0;" aria-hidden="true"></i>
          <!-- role="status" — polite, does not interrupt -->
          <app-accessible-text role="status">3 responses flagged for review</app-accessible-text>
        </div>

        <!-- Zero state — region present but empty content -->
        <div style="
          background: var(--color-bg-surface);
          border: var(--border-width-thin) solid var(--color-border-subtle);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        ">
          <i class="ph ph-check-circle ph-regular" style="font-size: 1rem; color: var(--color-status-success); line-height: 1; flex-shrink: 0;" aria-hidden="true"></i>
          <app-accessible-text role="status">All responses processed — no flags raised</app-accessible-text>
        </div>

      </div>
    `,
  }),
};
