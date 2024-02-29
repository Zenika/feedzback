export type ConfirmBeforeSubmitConfig = ConfirmBeforeSubmitType | ConfirmBeforeSubmitData;

export type ConfirmBeforeSubmitType =
  | 'sendFeedbackRequest'
  | 'cancelFeedbackRequest'
  | 'sendRequestedFeedback'
  | 'sendSpontaneousFeedback';

export type ConfirmBeforeSubmitData = {
  title: string;
  content?: string;
};
