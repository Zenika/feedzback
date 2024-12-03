import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DialogTooltipData } from './dialog-tooltip.types';

@Component({
  selector: 'app-dialog-tooltip',
  imports: [NgTemplateOutlet, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  templateUrl: './dialog-tooltip.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DialogTooltipComponent {
  protected data: DialogTooltipData = inject(MAT_DIALOG_DATA);

  protected isTemplateRef(content: string | TemplateRef<unknown>): content is TemplateRef<unknown> {
    return content instanceof TemplateRef;
  }
}
