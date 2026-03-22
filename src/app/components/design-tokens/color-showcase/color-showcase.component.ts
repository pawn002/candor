import { ChangeDetectionStrategy, Component } from "@angular/core";

interface ColorSwatch {
  name: string;
  variable: string;
  description: string;
  category: string;
  oklch?: string;
  hex?: string;
}

@Component({
  selector: "app-color-showcase",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./color-showcase.component.html",
  styleUrl: "./color-showcase.component.scss",
})
export class ColorShowcaseComponent {
  colorCategories = [
    {
      name: "Backgrounds",
      description: "Surface hierarchy — page floor, card surface, elevated (shadow-lifted), and inverse",
      colors: [
        {
          name: "Page",
          variable: "--color-bg-page",
          description: "Page floor — white in light mode, deep gray in dark",
          hex: "#FFFFFF",
        },
        {
          name: "Surface",
          variable: "--color-bg-surface",
          description: "Cards and panels — gray-100 in light mode",
          oklch: "oklch(0.91 0 0)",
          hex: "#E0E0E0",
        },
        {
          name: "Elevated",
          variable: "--color-bg-elevated",
          description: "Shadow-lifted surface — white in light, L=0.30 cool in dark",
        },
        {
          name: "Inverse",
          variable: "--color-bg-inverse",
          description: "Dark inverse surface — navy-800 in light mode",
          oklch: "oklch(0.27 0.06 245.34)",
          hex: "#082840",
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
          description: "Subtle separator — gray-200",
          oklch: "oklch(0.88 0.005 17.2)",
          hex: "#DAD8D8",
        },
        {
          name: "Strong",
          variable: "--color-border-strong",
          description: "Emphasized separator — table rules, card edges",
          oklch: "oklch(0.81 0 0)",
        },
        {
          name: "Control",
          variable: "--color-border-control",
          description: "Form control outlines — 3:1 non-text contrast ✅",
          oklch: "oklch(0.56 0 0)",
        },
        {
          name: "Focus",
          variable: "--color-focus",
          description: "Focus ring — azure-400 (#1493FB), high-visibility",
          oklch: "oklch(0.65 0.18 250.80)",
          hex: "#1493FB",
        },
      ],
    },
    {
      name: "Text",
      description: "Type colors from the gray ramp, contrast-validated against their intended backgrounds",
      colors: [
        {
          name: "Default",
          variable: "--color-text-default",
          description: "Body text — 12.6:1 on white",
          oklch: "oklch(0.32 0 0)",
          hex: "#333333",
        },
        {
          name: "Subtle",
          variable: "--color-text-subtle",
          description: "Secondary / supporting text — 4.6:1 on white",
          oklch: "oklch(0.56 0 0)",
          hex: "#757575",
        },
        {
          name: "Subtle on Surface",
          variable: "--color-text-subtle-on-surface",
          description: "Secondary text on gray-100 surface — 5.4:1",
          oklch: "oklch(0.46 0 0)",
        },
        {
          name: "Disabled",
          variable: "--color-text-disabled",
          description: "Disabled state — intentionally below AA",
          oklch: "oklch(0.71 0 0)",
        },
      ],
    },
    {
      name: "Action — Primary",
      description: "Navy — main interactive color. 15.2:1 with white.",
      colors: [
        {
          name: "Navy 800",
          variable: "--color-action-primary",
          description: "Primary action bg — buttons, links",
          oklch: "oklch(0.27 0.06 245.34)",
          hex: "#082840",
        },
        {
          name: "Navy 900 (hover)",
          variable: "--color-action-primary-hover",
          description: "Hover / active state",
          oklch: "oklch(0.19 0.05 245.34)",
        },
      ],
    },
    {
      name: "Action — Secondary",
      description: "Burgundy — supporting action color. 10.4:1 with white.",
      colors: [
        {
          name: "Burgundy 700",
          variable: "--color-action-secondary",
          description: "Secondary action bg",
          oklch: "oklch(0.37 0.08 347.43)",
          hex: "#5F2B48",
        },
        {
          name: "Burgundy 800 (hover)",
          variable: "--color-action-secondary-hover",
          description: "Hover state",
          oklch: "oklch(0.28 0.07 347.43)",
        },
      ],
    },
    {
      name: "Action — Tertiary",
      description: "Neutral fill — no border, low-hierarchy action. Navy text on gray bg.",
      colors: [
        {
          name: "Gray 200",
          variable: "--color-action-tertiary",
          description: "Tertiary action bg",
          oklch: "oklch(0.88 0.005 17.2)",
        },
        {
          name: "Navy (text)",
          variable: "--color-action-tertiary-text",
          description: "Text / icon on tertiary bg — navy-800",
          oklch: "oklch(0.27 0.06 245.34)",
        },
      ],
    },
    {
      name: "Action — Destructive",
      description:
        "Crimson (H=347, boosted chroma) — outlined only; signals irreversibility. Distinct from error orange-red (H=25).",
      colors: [
        {
          name: "Crimson 700",
          variable: "--color-action-destructive-text",
          description: "Destructive label and border — 10.4:1 on white",
          oklch: "oklch(0.37 0.15 347)",
        },
      ],
    },
    {
      name: "Accent — Azure",
      description: "Azure blue — #1493FB brand anchor. azure-500/600 are the accessible steps for text on white.",
      colors: [
        {
          name: "Azure 400 (brand anchor)",
          variable: "--color-focus",
          description: "Original #1493FB — focus ring and dark-bg only",
          oklch: "oklch(0.65 0.18 250.80)",
          hex: "#1493FB",
        },
        {
          name: "Azure 500",
          variable: "--color-link",
          description: "Body link color — 5.1:1 on white",
          oklch: "oklch(0.53 0.18 250.80)",
        },
        {
          name: "Azure 600 (hover)",
          variable: "--color-link-hover",
          description: "Link hover — 7.2:1 on white",
          oklch: "oklch(0.45 0.17 250.80)",
        },
      ],
    },
    {
      name: "Highlight — Purple",
      description: "Soft purple — #6969F7 brand anchor. Accessible step passes on both white and gray-100 surface.",
      colors: [
        {
          name: "Purple 500 (decorative)",
          variable: "--color-highlight-decorative",
          description: "Brand original — decorative only",
          oklch: "oklch(0.60 0.21 278.14)",
          hex: "#6969F7",
        },
        {
          name: "Purple (accessible)",
          variable: "--color-highlight",
          description: "Inline code, accents — 4.6:1 on white, 4.6:1 on surface",
          oklch: "oklch(0.50 0.21 278)",
        },
      ],
    },
    {
      name: "Status — Error",
      description: "H=25 orange-red — failure states and validation errors",
      colors: [
        {
          name: "Error",
          variable: "--color-status-error",
          description: "Icon / border — 4.8:1 on white",
          oklch: "oklch(0.55 0.22 25)",
        },
        {
          name: "Error Background",
          variable: "--color-status-error-bg",
          description: "Toast and alert fill",
          oklch: "oklch(0.95 0.05 25)",
        },
        {
          name: "Error Text",
          variable: "--color-status-error-text",
          description: "Text on error-bg — 5.8:1",
          oklch: "oklch(0.45 0.22 25)",
        },
      ],
    },
    {
      name: "Status — Success",
      description: "H=144 green — confirmation and completion",
      colors: [
        {
          name: "Success",
          variable: "--color-status-success",
          description: "Icon / border — 3.3:1 on white",
          oklch: "oklch(0.63 0.15 144.2)",
        },
        {
          name: "Success Background",
          variable: "--color-status-success-bg",
          description: "Toast and alert fill",
          oklch: "oklch(0.95 0.05 145)",
        },
        {
          name: "Success Text",
          variable: "--color-status-success-text",
          description: "Text on success-bg — 4.9:1",
          oklch: "oklch(0.50 0.15 144.2)",
        },
      ],
    },
    {
      name: "Status — Warning",
      description: "H=53 amber — caution and non-blocking issues",
      colors: [
        {
          name: "Warning",
          variable: "--color-status-warning",
          description: "Icon / border — 3.1:1 on white",
          oklch: "oklch(0.66 0.16 53.54)",
        },
        {
          name: "Warning Background",
          variable: "--color-status-warning-bg",
          description: "Toast and alert fill",
          oklch: "oklch(0.95 0.05 53)",
        },
        {
          name: "Warning Text",
          variable: "--color-status-warning-text",
          description: "Text on warning-bg — 7.6:1",
          oklch: "oklch(0.40 0.16 53.54)",
        },
      ],
    },
    {
      name: "Code Blocks",
      description:
        "Inverted dark navy block in light mode. Deep navy tint in dark mode — bg alone can't delineate at low L, so a border is added.",
      colors: [
        {
          name: "Code Background",
          variable: "--color-bg-code",
          description: "Code block surface — navy-800 in light mode",
          oklch: "oklch(0.27 0.06 245.34)",
          hex: "#082840",
        },
        {
          name: "Code Text",
          variable: "--color-text-code",
          description: "Text on code bg — white in light mode",
          oklch: "oklch(1 0 0)",
          hex: "#FFFFFF",
        },
      ],
    },
  ];
}
