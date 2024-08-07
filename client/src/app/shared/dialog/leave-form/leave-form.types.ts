import { DialogData } from '..';
import { LeaveFormService } from './leave-form.service';

export type LeaveForm = {
  leaveFormService: LeaveFormService;
};

export type LeaveFormConfig = LeaveFormType | DialogData;

export type LeaveFormType = 'quitFeedback' | 'applyFeedbackDraft';
