import { CanDeactivateFn } from '@angular/router';
import { UnsavedForm, UnsavedFormConfig } from './unsaved-form.types';

/** @deprecated TODO confirm deprecation? */
export const unsavedFormGuardFactory =
  (config: UnsavedFormConfig): CanDeactivateFn<UnsavedForm> =>
  (component) => {
    return component.unsavedFormService.canLeave(config);
  };
