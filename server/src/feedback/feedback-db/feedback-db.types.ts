// ----- Feedback -----

export type Feedback = {
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

export type FeedbackWithId = Feedback & IdObject;

// ----- FeedbackRequest -----

export type FeedbackRequest = {
  senderEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: FeedbackRequestStatus;
  createdAt: number;
};

export const FeedbackRequestStatus = 'pending';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

export type FeedbackRequestWithId = FeedbackRequest & IdObject;

// ----- FeedbackListMap -----

// Naming convention:
// A "feedback list" is made up of items where a "feedback item" has fewer properties than the full feedback.
// So the term "item" refers to the fact that the feedback is part of a "list".

export type FeedbackItem = Pick<Feedback, 'senderEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'>;
export type FeedbackItemWithId = FeedbackItem & IdObject;

export type FeedbackRequestItem = Pick<FeedbackRequest, 'senderEmail' | 'receiverEmail' | 'status' | 'createdAt'>;
export type FeedbackRequestItemWithId = FeedbackRequestItem & IdObject;

export type FeedbackListMap = {
  received: FeedbackItemWithId[];
  given: FeedbackItemWithId[];
  sentRequest: FeedbackRequestItemWithId[];
  receivedRequest: FeedbackRequestItemWithId[];
};

// ----- IdObject -----

export type IdObject = { id: string };

// ----- TokenObject -----

export type TokenObject = { token: string };

// ----- FeedbackRequestToken -----

export type FeedbackRequestToken = { feedbackId: string };
