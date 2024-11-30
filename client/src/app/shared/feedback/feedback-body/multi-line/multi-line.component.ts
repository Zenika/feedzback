import { Component, ViewEncapsulation, input } from '@angular/core';
import { buildTextMatrix } from './multi-line.utils';

@Component({
  selector: 'app-multi-line',
  standalone: true,
  templateUrl: './multi-line.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MultiLineComponent {
  // note: property `text` represents a "text matrix"
  text = input([], { transform: (text?: string) => buildTextMatrix(text) });
}
