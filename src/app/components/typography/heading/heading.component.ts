import { Component, Input } from "@angular/core";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingColor = "primary" | "secondary" | "disabled";

@Component({
  selector: "app-heading",
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ["./heading.component.scss"],
  host: {
    "[class]": '"heading heading--" + level + " heading--color-" + color',
    "[attr.role]": '"heading"',
    "[attr.aria-level]": "level.substring(1)",
  },
})
export class HeadingComponent {
  @Input() level: HeadingLevel = "h2";
  @Input() color: HeadingColor = "primary";
}
