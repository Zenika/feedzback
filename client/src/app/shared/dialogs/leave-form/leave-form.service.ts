import { Injectable, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, of } from 'rxjs';
import { DialogComponent } from '../dialog.component';
import { DialogData } from '../dialog.types';
import { leaveFormMap } from './leave-form.config';
import { LeaveFormConfig } from './leave-form.types';

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

  canLeave(config: LeaveFormConfig) {
    if (!this.hasChanged()) {
      return of(true);
    }

    const data: DialogData = typeof config === 'string' ? leaveFormMap[config] : config;

    return this.matDialog
      .open(DialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(map((canLeave?: boolean) => (canLeave === undefined ? false : canLeave)));
  }

  private stringifyFormValue() {
    if (!this.form) {
      console.error('LeaveFormService.stringifyFormValue: you first need to register a form.');
      return;
    }
    return JSON.stringify(this.form.value);
  }
}
