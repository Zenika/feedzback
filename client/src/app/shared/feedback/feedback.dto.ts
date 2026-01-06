export type FeedbackPreRequestTokenDto = {
  message: string;
  shared: boolean;
};

export type FeedbackPreRequestEmailDto = {
  token: string;
  giverEmail: string;
};

export type FeedbackRequestDto = {
  recipient: string;
  message: string;
  shared: boolean;
};

export type FeedbackRequestAgainDto = {
  feedbackId: string;
};

export type FeedbackArchiveRequestDto = {
  feedbackId: string;
};

export type GiveRequestedFeedbackDto = {
  token: string;
  context: string;
  positive: string;
  negative: string;
  comment: string;
};

export type GiveFeedbackDto = {
  receiverEmail: string;
  context: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
};
