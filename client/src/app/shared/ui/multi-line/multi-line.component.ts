import { Component, HostBinding, ViewEncapsulation, computed, input } from '@angular/core';
import { buildTextMatrix } from './multi-line.utils';

@Component({
  selector: 'app-multi-line',
  standalone: true,
  templateUrl: './multi-line.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MultiLineComponent {
  @HostBinding('class.app-multi-line') hasCss = true;

  text = input<string>();

  protected textMatrix = computed(() => buildTextMatrix(this.text()));
}
