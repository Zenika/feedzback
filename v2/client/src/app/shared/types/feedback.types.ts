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
  receiverEmail: string;
};

export type Feedback = ReceivedFeedback & SentFeedback;
