import { CanDeactivateFn } from '@angular/router';
import { LeaveForm, LeaveFormConfig } from './leave-form.types';

/** @deprecated TODO confirm deprecation? */
export const leaveFormGuardFactory =
  (config: LeaveFormConfig): CanDeactivateFn<LeaveForm> =>
  (component) => {
    return component.leaveFormService.canLeave(config);
  };
