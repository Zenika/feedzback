// ---------------------
// ----- API types -----

// ----- Feedback -----

export interface Feedback {
  id: string;
  giverEmail: string;
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  message: string;
  shared: boolean;
  requested: boolean;
  status: FeedbackStatus;
  createdAt: number;
  updatedAt: number;
  archived: number;
}

export const FeedbackStatus = 'done';
export type FeedbackStatus = typeof FeedbackStatus;

// ----- FeedbackRequest -----

export interface FeedbackRequest {
  id: string;
  giverEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  requested: true;
  status: FeedbackRequestStatus;
  createdAt: number;
  updatedAt: number;
  archived: number;
}

export const FeedbackRequestStatus = 'pending';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

// ----- FeedbackListMap -----

// Naming convention:
// A "feedback list" is made up of items where a "feedback item" has fewer properties than the full feedback.
// So the term "item" refers to the fact that the feedback is part of a "list".

export type FeedbackItem = Pick<Feedback, 'id' | 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'>;

export type FeedbackRequestItem = Pick<FeedbackRequest, 'id' | 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt'>;

export interface FeedbackListMap {
  received: FeedbackItem[];
  given: FeedbackItem[];
  sentRequest: FeedbackRequestItem[];
  receivedRequest: FeedbackRequestItem[];
}

export type FeedbackListType = keyof FeedbackListMap;

// ----- FeedbackDraft & FeedbackRequestDraft -----

export const FeedbackDraftType = 'feedback';
export type FeedbackDraftType = typeof FeedbackDraftType;

export const FeedbackRequestDraftType = 'feedbackRequest';
export type FeedbackRequestDraftType = typeof FeedbackRequestDraftType;

export interface FeedbackDraft {
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
}

export interface FeedbackRequestDraft {
  token: string;
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
}

// ----- IdObject -----

export interface IdObject {
  id: string;
}

// ----- TokenObject -----

export interface TokenObject {
  token: string;
}

// --------------------------
// ----- Internal types -----

export const FeedbackType = {
  received: 'received',
  given: 'given',
  sentRequest: 'sentRequest',
  receivedRequest: 'receivedRequest',
} as const;

export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];

export interface NormalizedFeedback {
  type: FeedbackType;
  id: string;
  email: string;
  date: number;
}
