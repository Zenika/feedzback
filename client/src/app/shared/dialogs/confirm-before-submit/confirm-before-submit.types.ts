import { DialogData } from '../dialog.types';

export type ConfirmBeforeSubmitConfig = ConfirmBeforeSubmitType | DialogData;

export type ConfirmBeforeSubmitType =
  | 'sendFeedbackRequest'
  | 'cancelFeedbackRequest'
  | 'sendFeedback'
  | 'archiveFeedback';
