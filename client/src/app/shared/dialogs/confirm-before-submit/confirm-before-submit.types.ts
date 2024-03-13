import { DialogData } from '../dialog.types';

export type ConfirmBeforeSubmitConfig = ConfirmBeforeSubmitType | DialogData;

export type ConfirmBeforeSubmitType =
  | 'sendFeedbackRequest'
  | 'archiveFeedbackRequest'
  | 'sendFeedback'
  | 'archiveFeedback';
