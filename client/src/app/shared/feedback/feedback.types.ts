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
  status: FeedbackStatus;
  createdAt: number;
  updatedAt: number;
};

export const FeedbackStatus = 'given';
export type FeedbackStatus = typeof FeedbackStatus;

export type FeedbackRequest = {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: FeedbackRequestStatus;
  createdAt: number;
};

export const FeedbackRequestStatus = 'requested';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

export type TypedFeedbacks = {
  received: Feedback[];
  sent: Feedback[];
  sentRequest: FeedbackRequest[];
  receivedRequest: FeedbackRequest[];
};

export type IdObject = { id: string };

export type TokenObject = { token: string };

// ----- Internal types -----

export const FeedbackType = {
  received: 'received',
  sent: 'sent',
  sentRequest: 'sentRequest',
  receivedRequest: 'receivedRequest',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];
