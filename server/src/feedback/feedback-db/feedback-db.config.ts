import { FeedbackItem, FeedbackRequestItem } from './feedback-db.types';

export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
  feedbackDraftMap: 'feedbackDraftMap',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];

export const feedbackItemFields = ['giverEmail', 'receiverEmail', 'status', 'createdAt', 'updatedAt'] satisfies (
  | keyof FeedbackItem
  | keyof FeedbackRequestItem
)[];
