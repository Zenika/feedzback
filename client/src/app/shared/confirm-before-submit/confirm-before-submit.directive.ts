import { Directive, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ConfirmBeforeSubmitComponent } from './confirm-before-submit.component';
import { ConfirmBeforeSubmitData } from './confirm-before-submit.types';

@Directive({
  selector: '[appConfirmBeforeSubmit]',
  host: {
    '(ngSubmit)': 'confirmBeforeSubmit()',
  },
  standalone: true,
})
export class ConfirmBeforeSubmitDirective {
  private matDialog = inject(MatDialog);

  content = input<string | undefined>(undefined, { alias: 'appConfirmBeforeSubmitContent' });

  submit = input.required<CallableFunction>({ alias: 'appConfirmBeforeSubmit' });

  confirmBeforeSubmit() {
    const data: ConfirmBeforeSubmitData = {
      content: this.content(),
    };

    this.matDialog
      .open(ConfirmBeforeSubmitComponent, { data })
      .afterClosed()
      .pipe(filter((confirm?: boolean) => (confirm === undefined ? false : confirm)))
      .subscribe(() => this.submit()());
  }
}
