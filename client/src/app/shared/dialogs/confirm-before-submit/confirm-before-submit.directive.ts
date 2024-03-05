import { Directive, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { DialogComponent } from '../dialog.component';
import { DialogData } from '../dialog.types';
import { confirmBeforeSubmitMap } from './confirm-before-submit.config';
import { ConfirmBeforeSubmitConfig } from './confirm-before-submit.types';

@Directive({
  selector: '[appConfirmBeforeSubmit]',
  host: {
    '(ngSubmit)': 'confirmBeforeSubmit()',
  },
  standalone: true,
})
export class ConfirmBeforeSubmitDirective {
  private matDialog = inject(MatDialog);

  config = input.required<ConfirmBeforeSubmitConfig>({ alias: 'appConfirmBeforeSubmitConfig' });

  submit = input.required<CallableFunction>({ alias: 'appConfirmBeforeSubmit' });

  confirmBeforeSubmit() {
    const config = this.config();
    const data: DialogData = typeof config === 'string' ? confirmBeforeSubmitMap[config] : config;

    this.matDialog
      .open(DialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter((confirm?: boolean) => (confirm === undefined ? false : confirm)))
      .subscribe(() => this.submit()());
  }
}
