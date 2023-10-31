export type FeedbackBase = {
  id: string;
  positiveFeedback: string;
  toImprove: string;
  comment: string;
  createdAt: string;
};

export type ReceivedFeedback = FeedbackBase & {
  senderName: string;
  senderEmail: string;
};

export type SentFeedback = FeedbackBase & {
  receverEmail: string; // !FIXME: rename `receiverEmail`
  receverName: string; // !FIXME: rename `receiverName`
};

export type Feedback = ReceivedFeedback & SentFeedback;
