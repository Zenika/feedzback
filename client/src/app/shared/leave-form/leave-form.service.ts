import { Injectable, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, of } from 'rxjs';
import { LeaveFormComponent } from './leave-form.component';

@Injectable()
export class LeaveFormService {
  private form?: AbstractControl;

  private snapshot?: string;

  private matDialog = inject(MatDialog);

  registerForm(form: AbstractControl) {
    this.form = form;
    this.takeSnapshot();
  }

  unregisterForm() {
    this.form = undefined;
    this.snapshot = undefined;
  }

  takeSnapshot() {
    this.snapshot = this.stringifyFormValue();
  }

  hasChanged() {
    return this.form && this.stringifyFormValue() !== this.snapshot;
  }

  canLeave() {
    if (!this.hasChanged()) {
      return of(true);
    }
    return this.matDialog
      .open(LeaveFormComponent)
      .afterClosed()
      .pipe(map((result?: boolean) => (result === undefined ? false : result)));
  }

  private stringifyFormValue() {
    if (!this.form) {
      console.error('LeaveFormService.stringifyFormValue: you first need to register a form.');
      return;
    }
    return JSON.stringify(this.form.value);
  }
}
