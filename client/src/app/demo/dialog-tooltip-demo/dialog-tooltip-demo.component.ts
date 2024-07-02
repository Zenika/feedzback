import { Component, ViewEncapsulation } from '@angular/core';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';
import { IconModule } from '../../shared/icon';

@Component({
  selector: 'app-dialog-tooltip-demo',
  standalone: true,
  imports: [DialogTooltipDirective, IconModule],
  templateUrl: './dialog-tooltip-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DialogTooltipDemoComponent {}
