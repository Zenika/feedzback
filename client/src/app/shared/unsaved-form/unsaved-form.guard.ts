import { CanDeactivateFn } from '@angular/router';
import { UnsavedFormDialogConfig, UnsavedFormGuard } from './unsaved-form.types';

export const unsavedFormGuardFactory =
  (config: UnsavedFormDialogConfig): CanDeactivateFn<UnsavedFormGuard> =>
  (component) => {
    return component.unsavedFormService.canLeave(config);
  };
