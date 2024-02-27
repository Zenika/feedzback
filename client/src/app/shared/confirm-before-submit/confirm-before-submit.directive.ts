import { Directive, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ConfirmBeforeSubmitComponent } from './confirm-before-submit.component';
import { confirmBeforeSubmitMap } from './confirm-before-submit.config';
import { ConfirmBeforeSubmitConfig, ConfirmBeforeSubmitData } from './confirm-before-submit.types';

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
    const data: ConfirmBeforeSubmitData = typeof config === 'string' ? confirmBeforeSubmitMap[config] : config;

    this.matDialog
      .open(ConfirmBeforeSubmitComponent, { data })
      .afterClosed()
      .pipe(filter((confirm?: boolean) => (confirm === undefined ? false : confirm)))
      .subscribe(() => this.submit()());
  }
}
