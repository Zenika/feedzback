import { FeedbackItem, FeedbackRequestItem } from './feedback-db.types';

export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];

export const feedbackItemFields = ['senderEmail', 'receiverEmail', 'status', 'createdAt', 'updatedAt'] satisfies (
  | keyof FeedbackItem
  | keyof FeedbackRequestItem
)[];
