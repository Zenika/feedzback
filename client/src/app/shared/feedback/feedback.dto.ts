export interface FeedbackRequestDto {
  recipient: string;
  message: string;
  shared: boolean;
}

export interface FeedbackRequestAgainDto {
  feedbackId: string;
}

export interface FeedbackArchiveRequestDto {
  feedbackId: string;
}

export interface GiveRequestedFeedbackDto {
  token: string;
  positive: string;
  negative: string;
  comment: string;
}

export interface GiveFeedbackDto {
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
}
