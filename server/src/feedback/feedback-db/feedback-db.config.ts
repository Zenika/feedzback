import { FeedbackItem } from './feedback-db.types';

export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
  feedbackDraft: 'feedbackDraft',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];

export const feedbackItemFields = [
  'giverEmail',
  'receiverEmail',
  'status',
  'createdAt',
  'updatedAt',
] satisfies (keyof FeedbackItem)[]; // Note: the "academic" type should be: `(keyof FeedbackItem | FeedbackRequestItem)[]`
