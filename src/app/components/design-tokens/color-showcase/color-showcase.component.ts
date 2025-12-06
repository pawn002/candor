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
      name: "Primary Colors",
      description: "Main brand colors for the Atlas application",
      colors: [
        {
          name: "Ocean Blue",
          variable: "--color-primary",
          description: "Primary brand color - trustworthy, navigation",
          category: "primary",
          oklch: "oklch(0.62 0.17 250.87)",
          hex: "#1E88E5",
        },
        {
          name: "Ocean Blue Hover",
          variable: "--color-primary-hover",
          description: "Hover state for primary color",
          category: "primary",
          oklch: "oklch(0.52 0.17 250.87)",
        },
        {
          name: "Ocean Blue Active",
          variable: "--color-primary-active",
          description: "Active state for primary color",
          category: "primary",
          oklch: "oklch(0.42 0.17 250.87)",
        },
      ],
    },
    {
      name: "Secondary Colors",
      description: "Supporting accent colors",
      colors: [
        {
          name: "Deep Teal",
          variable: "--color-secondary",
          description: "Secondary accent - sophisticated, modern",
          category: "secondary",
          oklch: "oklch(0.57 0.10 182.45)",
          hex: "#00897B",
        },
        {
          name: "Warm Amber",
          variable: "--color-accent",
          description: "Fun accent - discovery, energy",
          category: "accent",
          oklch: "oklch(0.71 0.18 53.54)",
          hex: "#F57C00",
        },
        {
          name: "Terrain Green",
          variable: "--color-terrain",
          description: "Nature, maps, topography",
          category: "terrain",
          oklch: "oklch(0.63 0.15 144.20)",
          hex: "#43A047",
        },
      ],
    },
    {
      name: "Neutral Colors",
      description: "Backgrounds and surfaces",
      colors: [
        {
          name: "Background",
          variable: "--color-background",
          description: "Default background",
          category: "neutral",
          oklch: "oklch(0.98 0.01 250)",
        },
        {
          name: "Warm Cream",
          variable: "--color-background-warm",
          description: "Friendly background alternative",
          category: "neutral",
          oklch: "oklch(0.98 0.03 92.94)",
          hex: "#FFF8E1",
        },
      ],
    },
    {
      name: "Text Colors",
      description: "Typography colors",
      colors: [
        {
          name: "Charcoal",
          variable: "--color-text-primary",
          description: "Primary text - professional, grounded",
          category: "text",
          oklch: "oklch(0.39 0.02 229.79)",
          hex: "#37474F",
        },
        {
          name: "Text Secondary",
          variable: "--color-text-secondary",
          description: "Secondary text",
          category: "text",
          oklch: "oklch(0.55 0.02 229.79)",
        },
        {
          name: "Text Disabled",
          variable: "--color-text-disabled",
          description: "Disabled state text",
          category: "text",
          oklch: "oklch(0.70 0.01 229.79)",
        },
      ],
    },
    {
      name: "Semantic Colors",
      description: "Status and feedback colors",
      colors: [
        {
          name: "Success",
          variable: "--color-success",
          description: "Success states",
          category: "semantic",
          oklch: "oklch(0.63 0.15 144.20)",
        },
        {
          name: "Warning",
          variable: "--color-warning",
          description: "Warning states",
          category: "semantic",
          oklch: "oklch(0.71 0.18 53.54)",
        },
        {
          name: "Error",
          variable: "--color-error",
          description: "Error states",
          category: "semantic",
          oklch: "oklch(0.55 0.22 25)",
        },
      ],
    },
  ];
}
