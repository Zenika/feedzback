export type ConfirmBeforeSubmitConfig = ConfirmBeforeSubmitType | ConfirmBeforeSubmitData;

export type ConfirmBeforeSubmitType = 'sendFeedbackRequest' | 'cancelFeedbackRequest' | 'sendFeedback';

export type ConfirmBeforeSubmitData = {
  title: string;
  content?: string;
  action?: {
    label: string;
    icon?: string;
  };
};
