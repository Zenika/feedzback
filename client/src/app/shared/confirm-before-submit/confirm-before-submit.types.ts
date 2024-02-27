export type ConfirmBeforeSubmitConfig = ConfirmBeforeSubmitType | ConfirmBeforeSubmitData;

export type ConfirmBeforeSubmitType = 'send' | 'delete';

export type ConfirmBeforeSubmitData = {
  title: string;
  content?: string;
};
