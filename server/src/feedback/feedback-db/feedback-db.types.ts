import { FieldValue } from 'firebase-admin/firestore';

// ----- Feedback -----

export type Feedback = {
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

export const FeedbackStatus = 'done';
export type FeedbackStatus = typeof FeedbackStatus;

export type FeedbackWithId = Feedback & IdObject;

// ----- FeedbackRequest -----

export type FeedbackRequest = {
  giverEmail: string;
  receiverEmail: string;
  message: string;
  shared: boolean;
  status: FeedbackRequestStatus;
  createdAt: number;
  updatedAt: number;
};

export const FeedbackRequestStatus = 'pending';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

export type FeedbackRequestWithId = FeedbackRequest & IdObject;

// ----- FeedbackListMap -----

// Naming convention:
// A "feedback list" is made up of items where a "feedback item" has fewer properties than the full feedback.
// So the term "item" refers to the fact that the feedback is part of a "list".

export type FeedbackItem = Pick<Feedback, 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'>;
export type FeedbackItemWithId = FeedbackItem & IdObject;

export type FeedbackRequestItem = Pick<FeedbackRequest, 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt'>;
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

export type FeedbackRequestToken = {
  feedbackId: string;
};

// ----- FeedbackDraftMaps -----

export type FeedbackDraftMaps = {
  spontaneous?: FeedbackDraftMap;
  requested?: FeedbackRequestedDraftMap;
};

export type FeedbackDraftMap = {
  [receiverEmail: string]: FeedbackDraft;
};

export type FeedbackDraft = {
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
};

export type FeedbackRequestedDraftMap = {
  [token: string]: FeedbackRequestedDraft;
};

export type FeedbackRequestedDraft = {
  token: string;
  receiverEmail: string;
  positive: string;
  negative: string;
  comment: string;
};

export type FeedbackDraftMapsRemoval = {
  spontaneous?: { [receiverEmail: string]: FieldValue };
  requested?: { [token: string]: FieldValue };
};

// ----- FeedbackEncryptedFields -----

export type FeedbackEncryptedFields = Pick<Feedback, 'message' | 'positive' | 'negative' | 'comment'>;

export const feedbackEncryptedFields: (keyof FeedbackEncryptedFields)[] = [
  'message',
  'positive',
  'negative',
  'comment',
] as const;
