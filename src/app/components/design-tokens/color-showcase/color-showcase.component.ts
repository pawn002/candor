import { ChangeDetectionStrategy, Component } from "@angular/core";

export interface ColorSwatch {
  name: string;
  variable: string;
  description: string;
  category?: string;
  light?: string;
  dark?: string;
}

export interface ColorCategory {
  name: string;
  description: string;
  colors: ColorSwatch[];
}

export const COLOR_CATEGORIES: ColorCategory[] = [
    {
      name: "Backgrounds",
      description: "Surface hierarchy — page floor, card surface, elevated (shadow-lifted), and inverse",
      colors: [
        {
          name: "Page",
          variable: "--color-bg-page",
          description: "Page floor",
          light: "oklch(1 0 0)",
          dark:  "oklch(0.16 0.02 248.99)",
        },
        {
          name: "Surface",
          variable: "--color-bg-surface",
          description: "Cards and panels",
          light: "oklch(0.91 0 0)",
          dark:  "oklch(0.24 0.03 248.99)",
        },
        {
          name: "Elevated",
          variable: "--color-bg-elevated",
          description: "Shadow-lifted surface",
          light: "oklch(1 0 0)",
          dark:  "oklch(0.30 0.02 248)",
        },
        {
          name: "Inverse",
          variable: "--color-bg-inverse",
          description: "Dark inverse surface — flips in dark mode",
          light: "oklch(0.27 0.06 245.34)",
          dark:  "oklch(1 0 0)",
        },
      ],
    },
    {
      name: "Borders & Focus",
      description: "Separators, control outlines, and focus indicators",
      colors: [
        {
          name: "Default",
          variable: "--color-border-default",
          description: "Subtle separator",
          light: "oklch(0.88 0.005 17.2)",
          dark:  "oklch(0.46 0 0)",
        },
        {
          name: "Strong",
          variable: "--color-border-strong",
          description: "Emphasized separator — table rules, card edges",
          light: "oklch(0.81 0 0)",
          dark:  "oklch(0.56 0 0)",
        },
        {
          name: "Control",
          variable: "--color-border-control",
          description: "Form control outlines — 3:1 non-text contrast",
          light: "oklch(0.56 0 0)",
          dark:  "oklch(0.56 0 0)",
        },
        {
          name: "Control on Surface",
          variable: "--color-border-control-on-surface",
          description: "Form control outline on bg-surface — higher L for sufficient contrast",
          light: "oklch(0.50 0 0)",
          dark:  "oklch(0.60 0 0)",
        },
        {
          name: "On Inverse",
          variable: "--color-border-on-inverse",
          description: "Divider on inverse (navy) surface",
          light: "oklch(0.40 0.05 245)",
          dark:  "oklch(0.85 0 0)",
        },
        {
          name: "Focus",
          variable: "--color-focus",
          description: "Focus ring — high-visibility azure",
          light: "oklch(0.65 0.18 250.80)",
          dark:  "oklch(0.77 0.15 250.80)",
        },
      ],
    },
    {
      name: "Text",
      description: "Neutral text colors from the gray ramp, contrast-validated against their intended backgrounds",
      colors: [
        {
          name: "Default",
          variable: "--color-text-default",
          description: "Body text",
          light: "oklch(0.32 0 0)",
          dark:  "oklch(0.88 0.01 248)",
        },
        {
          name: "Subtle",
          variable: "--color-text-subtle",
          description: "Secondary / supporting text",
          light: "oklch(0.50 0 0)",
          dark:  "oklch(0.71 0 0)",
        },
        {
          name: "Subtle on Surface",
          variable: "--color-text-subtle-on-surface",
          description: "Secondary text on bg-surface",
          light: "oklch(0.44 0 0)",
          dark:  "oklch(0.71 0 0)",
        },
        {
          name: "Disabled",
          variable: "--color-text-disabled",
          description: "Disabled state — intentionally below AA",
          light: "oklch(0.71 0 0)",
          dark:  "oklch(0.46 0 0)",
        },
        {
          name: "Inverse",
          variable: "--color-text-inverse",
          description: "Text on inverse surface — white in light mode, near-black in dark mode",
          light: "oklch(1 0 0)",
          dark:  "oklch(0.24 0.03 248.99)",
        },
        {
          name: "Subtle on Inverse",
          variable: "--color-text-subtle-on-inverse",
          description: "Muted text on inverse surface — OKCA 5.5 on bg-inverse",
          light: "oklch(0.75 0.02 245)",
          dark:  "oklch(0.40 0 0)",
        },
        {
          name: "On Action",
          variable: "--color-text-on-action",
          description: "Text on primary/secondary button fills",
          light: "oklch(1 0 0)",
          dark:  "oklch(0.16 0.02 248.99)",
        },
        {
          name: "Toast Message",
          variable: "--color-toast-message",
          description: "Toast body text — text-default in light, text-subtle in dark",
          light: "oklch(0.32 0 0)",
          dark:  "oklch(0.71 0 0)",
        },
      ],
    },
    {
      name: "Action — Primary",
      description: "Navy — main interactive color",
      colors: [
        {
          name: "Primary",
          variable: "--color-action-primary",
          description: "Primary button and action fill",
          light: "oklch(0.27 0.06 245.34)",
          dark:  "oklch(0.79 0.12 245)",
        },
        {
          name: "Primary Hover",
          variable: "--color-action-primary-hover",
          description: "Hover state",
          light: "oklch(0.19 0.05 245.34)",
          dark:  "oklch(0.87 0.08 245)",
        },
        {
          name: "Primary Active",
          variable: "--color-action-primary-active",
          description: "Pressed state",
          light: "oklch(0.19 0.05 245.34)",
          dark:  "oklch(0.87 0.08 245)",
        },
      ],
    },
    {
      name: "Action — Secondary",
      description: "Burgundy — supporting action color",
      colors: [
        {
          name: "Secondary",
          variable: "--color-action-secondary",
          description: "Secondary button fill",
          light: "oklch(0.37 0.08 347.43)",
          dark:  "oklch(0.76 0.06 347.43)",
        },
        {
          name: "Secondary Hover",
          variable: "--color-action-secondary-hover",
          description: "Hover state",
          light: "oklch(0.28 0.07 347.43)",
          dark:  "oklch(0.86 0.05 347.43)",
        },
        {
          name: "Secondary Active",
          variable: "--color-action-secondary-active",
          description: "Pressed state",
          light: "oklch(0.20 0.05 347.43)",
          dark:  "oklch(0.86 0.05 347.43)",
        },
      ],
    },
    {
      name: "Action — Tertiary",
      description: "Neutral fill — no border, low-hierarchy action",
      colors: [
        {
          name: "Tertiary",
          variable: "--color-action-tertiary",
          description: "Tertiary button fill",
          light: "oklch(0.88 0.005 17.2)",
          dark:  "oklch(0.32 0 0)",
        },
        {
          name: "Tertiary Hover",
          variable: "--color-action-tertiary-hover",
          description: "Hover state",
          light: "oklch(0.81 0 0)",
          dark:  "oklch(0.46 0 0)",
        },
        {
          name: "Tertiary Text",
          variable: "--color-action-tertiary-text",
          description: "Text / icon on tertiary bg",
          light: "oklch(0.27 0.06 245.34)",
          dark:  "oklch(1 0 0)",
        },
      ],
    },
    {
      name: "Action — Destructive",
      description: "Crimson (hue=347) — outlined only; signals irreversibility. Distinct from error (hue=25).",
      colors: [
        {
          name: "Destructive",
          variable: "--color-action-destructive",
          description: "Button fill — transparent (outlined variant)",
          light: "transparent",
          dark:  "transparent",
        },
        {
          name: "Destructive Hover",
          variable: "--color-action-destructive-hover",
          description: "Subtle crimson tint on hover",
          light: "oklch(0.37 0.15 347 / 0.08)",
          dark:  "oklch(0.72 0.15 347 / 0.12)",
        },
        {
          name: "Destructive Active",
          variable: "--color-action-destructive-active",
          description: "Stronger crimson tint on press",
          light: "oklch(0.37 0.15 347 / 0.15)",
          dark:  "oklch(0.72 0.15 347 / 0.22)",
        },
        {
          name: "Destructive Text",
          variable: "--color-action-destructive-text",
          description: "Button label — OKCA 8.8 on white",
          light: "oklch(0.37 0.15 347)",
          dark:  "oklch(0.74 0.15 347)",
        },
        {
          name: "Destructive Border",
          variable: "--color-action-destructive-border",
          description: "Outline — matches destructive text",
          light: "oklch(0.37 0.15 347)",
          dark:  "oklch(0.74 0.15 347)",
        },
      ],
    },
    {
      name: "Links",
      description: "Azure — #1493FB brand anchor. Accessible steps lighten in dark mode.",
      colors: [
        {
          name: "Link",
          variable: "--color-link",
          description: "Body link color",
          light: "oklch(0.49 0.18 250.80)",
          dark:  "oklch(0.77 0.15 250.80)",
        },
        {
          name: "Link Hover",
          variable: "--color-link-hover",
          description: "Link hover state",
          light: "oklch(0.45 0.17 250.80)",
          dark:  "oklch(0.86 0.10 250.80)",
        },
        {
          name: "Link Visited",
          variable: "--color-link-visited",
          description: "Visited link — purple, universal convention",
          light: "oklch(0.47 0.20 278.14)",
          dark:  "oklch(0.77 0.15 278.14)",
        },
      ],
    },
    {
      name: "Highlight",
      description: "Inline code — burgundy (hue=347), clearly distinct from indigo visited links.",
      colors: [
        {
          name: "Highlight",
          variable: "--color-highlight",
          description: "Inline code text — burgundy, clearly distinct from indigo visited links",
          light: "oklch(0.37 0.08 347.43)",
          dark:  "oklch(0.86 0.05 347.43)",
        },
      ],
    },
    {
      name: "Status — Error",
      description: "Orange-red (hue=25) — failure states and validation errors",
      colors: [
        {
          name: "Error",
          variable: "--color-status-error",
          description: "Icon / border use",
          light: "oklch(0.55 0.22 25)",
          dark:  "oklch(0.68 0.11 25)",
        },
        {
          name: "Error Background",
          variable: "--color-status-error-bg",
          description: "Toast and alert fill",
          light: "oklch(0.95 0.05 25)",
          dark:  "oklch(0.23 0.02 18)",
        },
        {
          name: "Error Text",
          variable: "--color-status-error-text",
          description: "Text on error-bg",
          light: "oklch(0.45 0.22 25)",
          dark:  "oklch(0.79 0.22 25)",
        },
      ],
    },
    {
      name: "Status — Success",
      description: "Green (hue=144) — confirmation and completion",
      colors: [
        {
          name: "Success",
          variable: "--color-status-success",
          description: "Icon / border use",
          light: "oklch(0.63 0.15 144.2)",
          dark:  "oklch(0.70 0.08 144.2)",
        },
        {
          name: "Success Background",
          variable: "--color-status-success-bg",
          description: "Toast and alert fill",
          light: "oklch(0.95 0.05 145)",
          dark:  "oklch(0.23 0.02 144)",
        },
        {
          name: "Success Text",
          variable: "--color-status-success-text",
          description: "Text on success-bg",
          light: "oklch(0.46 0.15 144.2)",
          dark:  "oklch(0.80 0.15 144.2)",
        },
      ],
    },
    {
      name: "Status — Warning",
      description: "Amber (hue=53) — caution and non-blocking issues",
      colors: [
        {
          name: "Warning",
          variable: "--color-status-warning",
          description: "Icon / border use",
          light: "oklch(0.66 0.16 53.54)",
          dark:  "oklch(0.72 0.09 53.54)",
        },
        {
          name: "Warning Background",
          variable: "--color-status-warning-bg",
          description: "Toast and alert fill",
          light: "oklch(0.95 0.05 53)",
          dark:  "oklch(0.25 0.02 68)",
        },
        {
          name: "Warning Text",
          variable: "--color-status-warning-text",
          description: "Text on warning-bg",
          light: "oklch(0.40 0.16 53.54)",
          dark:  "oklch(0.82 0.16 53.54)",
        },
      ],
    },
    {
      name: "Code Blocks",
      description: "Dark navy surface for code blocks — always visually distinct from ambient backgrounds. Border required when the ambient background is also dark.",
      colors: [
        {
          name: "Code Background",
          variable: "--color-bg-code",
          description: "Code block surface",
          light: "oklch(0.27 0.06 245.34)",
          dark:  "oklch(0.20 0.04 248)",
        },
        {
          name: "Code Text",
          variable: "--color-text-code",
          description: "Text on code bg",
          light: "oklch(1 0 0)",
          dark:  "oklch(0.88 0.01 248)",
        },
        {
          name: "Code Border",
          variable: "--color-border-code",
          description: "Border required in dark mode — transparent in light",
          light: "transparent",
          dark:  "oklch(0.56 0 0)",
        },
      ],
    },
    {
      name: "Blockquote",
      description: "Pull-quote surface — bg-surface fill with burgundy left border",
      colors: [
        {
          name: "Blockquote Background",
          variable: "--color-blockquote-bg",
          description: "Blockquote surface — inherits bg-surface",
          light: "oklch(0.91 0 0)",
          dark:  "oklch(0.24 0.03 248.99)",
        },
        {
          name: "Blockquote Border",
          variable: "--color-blockquote-border",
          description: "Left accent border — burgundy (action-secondary)",
          light: "oklch(0.37 0.08 347.43)",
          dark:  "oklch(0.76 0.06 347.43)",
        },
        {
          name: "Blockquote Text",
          variable: "--color-blockquote-text",
          description: "Blockquote prose — inherits text-subtle-on-surface",
          light: "oklch(0.44 0 0)",
          dark:  "oklch(0.71 0 0)",
        },
      ],
    },
];

@Component({
  selector: "app-color-showcase",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./color-showcase.component.html",
  styleUrl: "./color-showcase.component.scss",
})
export class ColorShowcaseComponent {
  colorCategories = COLOR_CATEGORIES;
}
