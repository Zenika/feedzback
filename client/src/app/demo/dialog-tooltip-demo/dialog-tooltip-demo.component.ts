import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';

@Component({
  selector: 'app-dialog-tooltip-demo',
  imports: [DialogTooltipDirective, MatIconModule],
  templateUrl: './dialog-tooltip-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DialogTooltipDemoComponent {}
