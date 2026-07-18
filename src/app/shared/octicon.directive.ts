import { Directive, ElementRef, input, inject, effect } from '@angular/core';
import * as octicons from '@primer/octicons';

@Directive({
  selector: '[octicon]',
  standalone: true,
})
export class OcticonDirective {
  private readonly el = inject(ElementRef);

  octicon = input.required<string>();
  color = input<string>();
  size = input<number>(16);

  constructor() {
    effect(() => {
      const name = this.octicon();
      const colorVal = this.color();
      const sizeVal = this.size();

      const iconObj = (
        octicons as unknown as Record<
          string,
          {
            toSVG(options?: {
              width?: number;
              height?: number;
              fill?: string;
              class?: string;
            }): string;
          }
        >
      )[name];
      if (iconObj) {
        const svgString = iconObj.toSVG({
          width: sizeVal,
          height: sizeVal,
          fill: colorVal || 'currentColor',
          class: `octicon octicon-${name}`,
        });
        this.el.nativeElement.innerHTML = svgString;
      }
    });
  }
}
