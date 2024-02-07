import { CanDeactivateFn } from '@angular/router';
import { CanDeactivateForm } from './can-deactivate.type';

export const canDeactivateGuard: CanDeactivateFn<CanDeactivateForm> = (component, currentRoute, currentState, nextState) => {
  return component.canDeactivate();
};
