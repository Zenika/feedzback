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

// ----- Summaries -----

export type FeedbackSummary = Pick<Feedback, 'senderEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'>;
export type FeedbackSummaryWithId = FeedbackSummary & IdObject;

export type FeedbackRequestSummary = Pick<FeedbackRequest, 'senderEmail' | 'receiverEmail' | 'status' | 'createdAt'>;
export type FeedbackRequestSummaryWithId = FeedbackRequestSummary & IdObject;

export type TypedFeedbackSummaries = {
  received: FeedbackSummaryWithId[];
  given: FeedbackSummaryWithId[];
  sentRequest: FeedbackRequestSummaryWithId[];
  receivedRequest: FeedbackRequestSummaryWithId[];
};

// ----- IdObject -----

export type IdObject = { id: string };

// ----- TokenObject -----

export type TokenObject = { token: string };

// ----- FeedbackRequestToken -----

export type FeedbackRequestToken = { feedbackId: string };
