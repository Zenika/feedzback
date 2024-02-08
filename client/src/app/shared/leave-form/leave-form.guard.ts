import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { LeaveForm } from './leave-form.types';

import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { LeaveFormComponent } from './leave-form.component';

export const leaveFormGuard: CanDeactivateFn<LeaveForm> = (component) => {
  if (!component.leaveFormService.valueChanged()) {
    return true;
  }
  return inject(MatDialog)
    .open(LeaveFormComponent, {})
    .afterClosed()
    .pipe(map((result) => (result === undefined ? false : result)));
};
