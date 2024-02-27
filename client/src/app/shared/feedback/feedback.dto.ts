export type FeedbackRequestDto = {
  recipient: string;
  message: string;
  shared: boolean;
};

export type FeedbackRequestAgainDto = {
  feedbackId: string;
};

export type FeedbackDeleteRequestDto = {
  feedbackId: string;
};

export type GiveRequestedFeedbackDto = {
  token: string;
  positive: string;
  negative: string;
  comment: string;
};

export type GiveFeedbackDto = {
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
};
