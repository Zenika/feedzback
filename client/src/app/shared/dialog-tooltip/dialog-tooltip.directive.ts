import { Directive, ElementRef, TemplateRef, booleanAttribute, effect, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTooltipComponent } from './dialog-tooltip.component';
import { DialogTooltipData } from './dialog-tooltip.types';

@Directive({
  selector: '[appDialogTooltip]',
  host: {
    '(click)': 'open($event)',
  },
  standalone: true,
})
export class DialogTooltipDirective {
  dialogTitle = input<string>();

  dialogContent = input.required<string | TemplateRef<unknown>>();

  dialogWidth = input<string>();

  ariaLabelFromDialogTitle = input(false, { transform: booleanAttribute });

  private dialog = inject(MatDialog);

  constructor() {
    const { nativeElement } = inject<ElementRef<HTMLElement>>(ElementRef);
    effect(() => {
      if (!this.ariaLabelFromDialogTitle()) {
        return;
      }
      nativeElement.ariaLabel = this.dialogTitle() ?? null;
    });
  }

  open(event?: Event) {
    event?.preventDefault();

    const data: DialogTooltipData = {
      title: this.dialogTitle,
      content: this.dialogContent,
    };

    this.dialog.open(DialogTooltipComponent, {
      data,
      width: this.dialogWidth(),
      maxWidth: '80vw',
    });
  }
}
