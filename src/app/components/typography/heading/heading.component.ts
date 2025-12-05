import { Component, Input } from "@angular/core";
import { NgClass, NgIf } from "@angular/common";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingColor = "primary" | "secondary" | "disabled";

@Component({
  selector: "app-heading",
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: "./heading.component.html",
  styleUrls: ["./heading.component.scss"],
})
export class HeadingComponent {
  @Input() level: HeadingLevel = "h2";
  @Input() color: HeadingColor = "primary";
}
