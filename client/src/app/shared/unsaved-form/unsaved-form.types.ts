import { AbstractControl } from '@angular/forms';
import { UnsavedFormService } from './unsaved-form.service';

export type UnsavedFormConfig = {
  form: AbstractControl;
  storageKey: string;
  saveWhenLeaving?: boolean;
};

export type UnsavedFormGuard = {
  unsavedFormService: UnsavedFormService;
};
