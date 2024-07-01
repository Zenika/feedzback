import { DialogData } from '..';

export type ConfirmBeforeSubmitConfig = ConfirmBeforeSubmitType | DialogData;

export type ConfirmBeforeSubmitType =
  | 'sendFeedbackRequest'
  | 'archiveFeedbackRequest'
  | 'sendFeedback'
  | 'archiveFeedback';
