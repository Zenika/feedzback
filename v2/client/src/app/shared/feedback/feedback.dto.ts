export type AskFeedbackDto = {
  recipient: string;
  message: string;
  shared: boolean;
};

export type SendAskedFeedbackDto = {
  token: string;
  positive: string;
  negative: string;
  comment: string;
};

export type SendFeedbackDto = {
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
};
