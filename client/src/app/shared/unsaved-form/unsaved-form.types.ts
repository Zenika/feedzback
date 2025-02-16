import { AbstractControl } from '@angular/forms';
import { DialogData } from '../dialog';
import { UnsavedFormService } from './unsaved-form.service';

export type UnsavedFormConfig = {
  form: AbstractControl;
  storageKey: string;
  saveWhenLeaving?: boolean;
};

export type UnsavedFormGuard = {
  unsavedFormService: UnsavedFormService;
};

export type UnsavedFormDialogConfig = UnsavedFormDialogType | DialogData;

export type UnsavedFormDialogType = 'quitFeedback' | 'applyFeedbackDraft';
