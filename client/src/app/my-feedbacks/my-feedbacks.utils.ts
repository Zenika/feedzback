import { FeedbackRequestSummary, FeedbackSummary, FeedbackType } from '../shared/feedback/feedback.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export const getFeedbackType = (value: string | null | undefined): FeedbackType | undefined =>
  Object.values(FeedbackType).find((feedbackType) => value?.toLowerCase() === feedbackType.toLowerCase());

export const normalizeReceivedFeedbacks = (data: FeedbackSummary[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, updatedAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeGivenFeedbacks = (data: FeedbackSummary[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, updatedAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeSentRequests = (data: FeedbackRequestSummary[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, createdAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeReceivedRequests = (data: FeedbackRequestSummary[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, createdAt: date }) => ({
    id,
    email,
    date,
  }));
