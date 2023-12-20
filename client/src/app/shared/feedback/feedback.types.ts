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

export const FeedbackStatus = 'done'; // Idea: in the future, it could be also 'draft'...
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

export const FeedbackRequestStatus = 'pending';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

export type TypedFeedbacks = {
  received: Feedback[];
  given: Feedback[];
  sentRequest: FeedbackRequest[];
  receivedRequest: FeedbackRequest[];
};

export type IdObject = { id: string };

export type TokenObject = { token: string };

// ----- Internal types -----

export const FeedbackType = {
  received: 'received',
  given: 'given',
  sentRequest: 'sentRequest',
  receivedRequest: 'receivedRequest',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];
