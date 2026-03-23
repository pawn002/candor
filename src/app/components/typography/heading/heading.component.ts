import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingColor = "primary" | "secondary" | "disabled";

@Component({
  selector: "app-heading",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styleUrls: ["./heading.component.scss"],
  host: {
    "[class]":
      '"heading heading--" + normalizedLevel() + " heading--color-" + color()',
    "[attr.role]": '"heading"',
    "[attr.aria-level]": "ariaLevel()",
  },
})
export class HeadingComponent {
  level = input<HeadingLevel | number>("h2");
  color = input<HeadingColor>("primary");

  normalizedLevel = computed(() => {
    const lvl = this.level();
    return typeof lvl === "number" ? `h${lvl}` : lvl;
  });

  ariaLevel = computed(() => {
    const lvl = this.level();
    return typeof lvl === "number" ? lvl : parseInt(lvl.substring(1), 10);
  });
}
