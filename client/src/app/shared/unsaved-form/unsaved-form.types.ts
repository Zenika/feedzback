import { DialogData } from '../dialog';
import { UnsavedFormService } from './unsaved-form.service';

export type UnsavedForm = {
  unsavedFormService: UnsavedFormService;
};

export type UnsavedFormConfig = UnsavedFormType | DialogData;

export type UnsavedFormType = 'quitFeedback' | 'applyFeedbackDraft';
