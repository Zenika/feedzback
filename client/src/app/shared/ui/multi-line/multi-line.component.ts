import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-multi-line',
  standalone: true,
  templateUrl: './multi-line.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MultiLineComponent {
  @HostBinding('class.app-multi-line') hasCss = true;

  @Input() set text(value: string | null | undefined) {
    this.textMatrix = (value ?? '')
      .replaceAll(/\n{3,}/g, '\n\n')
      .split('\n\n')
      .map((paragraph) => paragraph.split('\n'));
  }

  protected textMatrix: string[][] = [];
}
