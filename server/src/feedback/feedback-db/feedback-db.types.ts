// ----- Feedback -----

export type Feedback = {
  giverEmail: string;
  receiverEmail: string;
  context: string;
  positive: string;
  negative: string;
  comment: string;
  message: string;
  shared: boolean;
  requested: boolean;
  status: FeedbackStatus;
  createdAt: number;
  updatedAt: number;
  archived: FeedbackArchived;
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
  requested: true;
  status: FeedbackRequestStatus;
  createdAt: number;
  updatedAt: number;
  archived: typeof FeedbackArchived.No | typeof FeedbackArchived.Both;
};

export const FeedbackRequestStatus = 'pending';
export type FeedbackRequestStatus = typeof FeedbackRequestStatus;

export type FeedbackRequestWithId = FeedbackRequest & IdObject;

// ----- FeedbackArchived -----

// Explanation of possible values for field `Feedback['archived']`:
//    == 0   ->   archived for no-one
//    == 1   ->   archived for the receiver
//    == 2   ->   archived for the giver
//    == 3   ->   archived for both the receiver and the giver

export const FeedbackArchived = {
  No: 0,
  Receiver: 1,
  Giver: 2,
  Both: 3,
} as const;
export type FeedbackArchived = (typeof FeedbackArchived)[keyof typeof FeedbackArchived];

// ----- FeedbackListMap -----

// Naming convention:
// A "feedback list" is made up of items where a "feedback item" has fewer properties than the full feedback.
// So the term "item" refers to the fact that the feedback is part of a "list".

export type FeedbackItem = Pick<Feedback, 'giverEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'>;
export type FeedbackItemWithId = FeedbackItem & IdObject;

export type FeedbackRequestItem = Pick<
  FeedbackRequest,
  'giverEmail' | 'receiverEmail' | 'status' | 'createdAt' | 'updatedAt'
>;
export type FeedbackRequestItemWithId = FeedbackRequestItem & IdObject;

export type FeedbackListMap = {
  received: FeedbackItemWithId[];
  given: FeedbackItemWithId[];
  sentRequest: FeedbackRequestItemWithId[];
  receivedRequest: FeedbackRequestItemWithId[];
};

export type FeedbackListType = keyof FeedbackListMap;

// ----- IdObject -----

export type IdObject = { id: string };

// ----- TokenObject -----

export type TokenObject = { token: string };

// ----- FeedbackRequestToken -----

export type FeedbackRequestToken = {
  feedbackId: string;
};

// ----- FeedbackDraft & FeedbackRequestDraft -----

export const FeedbackDraftType = 'feedback';
export type FeedbackDraftType = typeof FeedbackDraftType;

export const FeedbackRequestDraftType = 'feedbackRequest';
export type FeedbackRequestDraftType = typeof FeedbackRequestDraftType;

export type FeedbackDraft = {
  receiverEmail: string;
  context: string;
  positive: string;
  negative: string;
  comment: string;
  shared: boolean;
};

export type FeedbackRequestDraft = {
  token: string;
  receiverEmail: string;
  context: string;
  positive: string;
  negative: string;
  comment: string;
};

// ----- FeedbackEncryptedFields -----

export type FeedbackEncryptedFields = Pick<Feedback, 'message' | 'context' | 'positive' | 'negative' | 'comment'>;

export const feedbackEncryptedFields: (keyof FeedbackEncryptedFields)[] = [
  'message',
  'context',
  'positive',
  'negative',
  'comment',
] as const;
