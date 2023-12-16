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

export const FeedbackStatus = 'given';
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

export const FeedbackRequestStatus = 'requested';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

export type FeedbackRequestWithId = FeedbackRequest & IdObject;

// ----- TypedFeedbacks -----

export type TypedFeedbacks = {
  received: Feedback[];
  sent: Feedback[];
  sentRequest: FeedbackRequest[];
  receivedRequest: FeedbackRequest[];
};

// ----- IdObject -----

export type IdObject = { id: string };

// ----- TokenObject -----

export type TokenObject = { token: string };

// ----- FeedbackRequestToken -----

export type FeedbackRequestToken = { feedbackId: string };

// ----- Manager -----

export type Manager = {
  [managerEmail: string]: ManagerData;
};

export type ManagerData = {
  consultants: string[];
};
