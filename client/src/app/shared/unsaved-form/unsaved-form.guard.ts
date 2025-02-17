import { CanDeactivateFn } from '@angular/router';
import { DialogData } from '../dialog';
import { UnsavedFormGuard } from './unsaved-form.types';

export const unsavedFormGuardFactory =
  (data: DialogData): CanDeactivateFn<UnsavedFormGuard> =>
  (component) => {
    return component.unsavedFormService.canLeave(data);
  };
