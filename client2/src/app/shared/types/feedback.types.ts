export type FeedbackBase = {
  id: string;
  positiveFeedback: string;
  toImprove: string;
  comment: string;
  createdAt: string;
};

export type ReceivedFeedback = FeedbackBase & {
  senderEmail: string;
};

export type SentFeedback = FeedbackBase & {
  receverEmail: string; // !FIXME: rename `receiverEmail`
};

export type Feedback = ReceivedFeedback & SentFeedback;
