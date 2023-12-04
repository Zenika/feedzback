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

export type FeedbackIdObj = { id: string };

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
  waitingForSend: AskedFeedback[];
};
