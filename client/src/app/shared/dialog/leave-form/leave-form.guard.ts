import { CanDeactivateFn } from '@angular/router';
import { LeaveForm, LeaveFormConfig } from './leave-form.types';

export const leaveFormGuardFactory =
  (config: LeaveFormConfig): CanDeactivateFn<LeaveForm> =>
  (component) => {
    return component.leaveFormService.canLeave(config);
  };
