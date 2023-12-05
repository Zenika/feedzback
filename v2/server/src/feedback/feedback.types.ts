// ----- Feedback -----

export type Feedback = {
  senderEmail: string;
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  message: string;
  shared: boolean;
  status: 'given';
  createdAt: number;
  updatedAt: number;
};
export type FeedbackWithId = Feedback & FeedbackIdObj;

// ----- AskedFeedback -----

export type AskedFeedback = {
  senderEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: 'asked';
  createdAt: number;
};
export type AskedFeedbackWithId = AskedFeedback & FeedbackIdObj;

// ----- TypedFeedbacks -----

export type TypedFeedbacks = {
  received: Feedback[];
  sent: Feedback[];
  asked: AskedFeedback[];
  pending: AskedFeedback[];
};

// ----- FeedbackIdObj -----

export type FeedbackIdObj = { id: string };

// ----- AskedFeedbackToken -----

export type AskedFeedbackToken = { feedbackId: string };

// ----- TokenIdObj -----

export type TokenIdObj = { token: string };
