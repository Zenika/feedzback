// ---------------------
// ----- API types -----

// ----- Feedback -----

export type Feedback = {
  id: string;
  giverEmail: string;
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

// ----- FeedbackRequest -----

export type FeedbackRequest = {
  id: string;
  giverEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: FeedbackRequestStatus;
  createdAt: number;
};

export const FeedbackRequestStatus = 'pending';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

// ----- FeedbackListMap -----

// Naming convention:
// A "feedback list" is made up of items where a "feedback item" has fewer properties than the full feedback.
// So the term "item" refers to the fact that the feedback is part of a "list".

export type FeedbackItem = Pick<Feedback, 'id' | 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'>;

export type FeedbackRequestItem = Pick<FeedbackRequest, 'id' | 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt'>;

export type FeedbackListMap = {
  received: FeedbackItem[];
  given: FeedbackItem[];
  sentRequest: FeedbackRequestItem[];
  receivedRequest: FeedbackRequestItem[];
};

// ----- IdObject -----

export type IdObject = { id: string };

// ----- TokenObject -----

export type TokenObject = { token: string };

// --------------------------
// ----- Internal types -----

export const FeedbackType = {
  received: 'received',
  given: 'given',
  sentRequest: 'sentRequest',
  receivedRequest: 'receivedRequest',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];
