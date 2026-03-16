import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

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
  imports: [CommonModule],
  templateUrl: "./color-showcase.component.html",
  styleUrl: "./color-showcase.component.scss",
})
export class ColorShowcaseComponent {
  colorCategories = [
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
      name: "Accent — Azure",
      description: "Azure blue — original brand anchor #1493FB. Accessible step at azure-500 (5.2:1).",
      colors: [
        {
          name: "Azure 400",
          variable: "--color-link",
          description: "Original brand color — decorative / dark-bg only",
          oklch: "oklch(0.65 0.18 250.80)",
          hex: "#1493FB",
        },
        {
          name: "Azure 500",
          variable: "--color-link-hover",
          description: "Accessible step — 5.2:1 with white",
          oklch: "oklch(0.53 0.18 250.80)",
        },
      ],
    },
    {
      name: "Highlight — Purple",
      description: "Soft purple — original #6969F7. Accessible step at purple-600 (4.6:1).",
      colors: [
        {
          name: "Purple 500",
          variable: "--color-highlight-decorative",
          description: "Original brand color — decorative only",
          oklch: "oklch(0.60 0.21 278.14)",
          hex: "#6969F7",
        },
        {
          name: "Purple 600",
          variable: "--color-highlight",
          description: "Accessible step — 4.6:1 with white",
          oklch: "oklch(0.56 0.21 278.14)",
          hex: "#5f5dea",
        },
      ],
    },
    {
      name: "Text",
      description: "Type colors derived from the gray ramp",
      colors: [
        {
          name: "Gray 700",
          variable: "--color-text-default",
          description: "Default body text — 12.6:1 on white",
          oklch: "oklch(0.32 0 0)",
          hex: "#333333",
        },
        {
          name: "Gray 500",
          variable: "--color-text-subtle",
          description: "Secondary / supporting text — 4.5:1 on white",
          oklch: "oklch(0.57 0 0)",
          hex: "#767676",
        },
        {
          name: "Gray 400",
          variable: "--color-text-disabled",
          description: "Disabled state",
          oklch: "oklch(0.71 0 0)",
        },
      ],
    },
    {
      name: "Backgrounds & Borders",
      description: "Surface and border colors",
      colors: [
        {
          name: "White",
          variable: "--color-bg-page",
          description: "Page background",
          oklch: "oklch(1 0 0)",
          hex: "#FFFFFF",
        },
        {
          name: "Gray 100",
          variable: "--color-bg-surface",
          description: "Card / surface background",
          oklch: "oklch(0.91 0 0)",
          hex: "#E0E0E0",
        },
        {
          name: "Gray 200",
          variable: "--color-border-default",
          description: "Default border",
          oklch: "oklch(0.88 0.005 17.2)",
          hex: "#DAD8D8",
        },
      ],
    },
    {
      name: "Status",
      description: "Feedback and system status colors",
      colors: [
        {
          name: "Error",
          variable: "--color-status-error",
          description: "Error states",
          oklch: "oklch(0.55 0.22 25)",
        },
        {
          name: "Success",
          variable: "--color-status-success",
          description: "Success states",
          oklch: "oklch(0.63 0.15 144.2)",
        },
        {
          name: "Warning",
          variable: "--color-status-warning",
          description: "Warning states",
          oklch: "oklch(0.71 0.18 53.54)",
        },
      ],
    },
  ];
}
