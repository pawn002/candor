import { Component, Input } from "@angular/core";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingColor = "primary" | "secondary" | "disabled";

@Component({
  selector: "app-heading",
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ["./heading.component.scss"],
  host: {
    "[class]":
      '"heading heading--" + normalizedLevel + " heading--color-" + color',
    "[attr.role]": '"heading"',
    "[attr.aria-level]": "ariaLevel",
  },
})
export class HeadingComponent {
  @Input() level: HeadingLevel | number = "h2";
  @Input() color: HeadingColor = "primary";

  get normalizedLevel(): string {
    return typeof this.level === "number" ? `h${this.level}` : this.level;
  }

  get ariaLevel(): number {
    return typeof this.level === "number"
      ? this.level
      : parseInt(this.level.substring(1), 10);
  }
}
