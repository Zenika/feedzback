import { FeedbackItem, FeedbackRequestItem } from './feedback-db.types';

export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
  feedbackDraft: 'feedbackDraft',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];

export const feedbackItemFields = ['giverEmail', 'receiverEmail', 'status', 'createdAt', 'updatedAt'] satisfies (
  | keyof FeedbackItem
  | keyof FeedbackRequestItem
)[];

// Note: due to date imprecision, on the server side, the deadline is shorter than on the client side.
export const FEEDBACK_REQUEST_DEADLINE_IN_DAYS = 29;
