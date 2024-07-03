import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';
import { IconDirective } from '../../shared/icon';

@Component({
  selector: 'app-dialog-tooltip-demo',
  standalone: true,
  imports: [DialogTooltipDirective, MatIconModule, IconDirective],
  templateUrl: './dialog-tooltip-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DialogTooltipDemoComponent {}
