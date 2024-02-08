import { CanDeactivateFn } from '@angular/router';
import { LeaveForm } from './leave-form.types';

export const leaveFormGuard: CanDeactivateFn<LeaveForm> = (component) => component.leaveFormService.canLeave();
