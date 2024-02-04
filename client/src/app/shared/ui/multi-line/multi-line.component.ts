import { Component, ViewEncapsulation, input } from '@angular/core';
import { buildTextMatrix } from './multi-line.utils';

@Component({
  selector: 'app-multi-line',
  standalone: true,
  templateUrl: './multi-line.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MultiLineComponent {
  textMatrix = input([], { alias: 'text', transform: (text?: string) => buildTextMatrix(text) });
}
