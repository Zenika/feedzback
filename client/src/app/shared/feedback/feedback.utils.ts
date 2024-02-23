import { FeedbackItem, FeedbackRequestItem, FeedbackType, NormalizedFeedback } from './feedback.types';

export const getFeedbackType = (value: string | null | undefined): FeedbackType | undefined =>
  Object.values(FeedbackType).find((feedbackType) => value?.toLowerCase() === feedbackType.toLowerCase());

export const normalizeReceivedList = (data: FeedbackItem[]): NormalizedFeedback[] =>
  data.map(({ id, giverEmail: email, updatedAt: date }) => ({ type: 'received', id, email, date }));

export const normalizeGivenList = (data: FeedbackItem[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, updatedAt: date }) => ({ type: 'given', id, email, date }));

export const normalizeSentRequestList = (data: FeedbackRequestItem[]): NormalizedFeedback[] =>
  data.map(({ id, giverEmail: email, createdAt: date }) => ({ type: 'sentRequest', id, email, date }));

export const normalizeReceivedRequestList = (data: FeedbackRequestItem[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, createdAt: date }) => ({ type: 'receivedRequest', id, email, date }));
