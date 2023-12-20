import { FeedbackRequestSummary, FeedbackSummary } from './feedback-db.types';

export const Collection = {
  feedback: 'feedback',
  feedbackRequestToken: 'feedbackRequestToken',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];

export const feedbackSummaryFields = ['senderEmail', 'receiverEmail', 'status', 'createdAt', 'updatedAt'] satisfies (
  | keyof FeedbackSummary
  | keyof FeedbackRequestSummary
)[];
