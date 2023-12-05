// ----- API types -----

export type Feedback = {
  id: string;
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

export type AskedFeedback = {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: 'asked';
  createdAt: number;
};

export type TokenIdObj = {
  token: string;
};

export type FeedbackIdObj = {
  id: string;
};

export type TypedFeedbacks = {
  sent: Feedback[];
  received: Feedback[];
  asked: AskedFeedback[];
  pending: AskedFeedback[];
};

// ----- Other types -----

export const FeedbackType = {
  sent: 'sent',
  received: 'received',
  asked: 'asked',
  pending: 'pending',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];
