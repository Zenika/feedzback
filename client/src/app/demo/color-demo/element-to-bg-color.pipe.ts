import { DOCUMENT } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { extractRgb, rgbToHex } from './element-to-bg-color.utils';

@Pipe({
  name: 'elementToBgColor',
  standalone: true,
})
export class ElementToBgColorPipe implements PipeTransform {
  #document = inject(DOCUMENT);

  transform(element: HTMLElement, displayHexColor = false): string {
    const backgroundColor = this.#document.defaultView?.getComputedStyle(element).backgroundColor;
    if (!backgroundColor) {
      return '';
    }

    if (!displayHexColor) {
      return backgroundColor;
    }

    const rgb = extractRgb(backgroundColor);
    if (!rgb) {
      return backgroundColor;
    }

    return rgbToHex(...rgb);
  }
}
