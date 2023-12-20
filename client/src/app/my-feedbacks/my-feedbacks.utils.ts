import { FeedbackItem, FeedbackRequestItem, FeedbackType } from '../shared/feedback/feedback.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export const getFeedbackType = (value: string | null | undefined): FeedbackType | undefined =>
  Object.values(FeedbackType).find((feedbackType) => value?.toLowerCase() === feedbackType.toLowerCase());

export const normalizeReceivedList = (data: FeedbackItem[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, updatedAt: date }) => ({ id, email, date }));

export const normalizeGivenList = (data: FeedbackItem[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, updatedAt: date }) => ({ id, email, date }));

export const normalizeSentRequestList = (data: FeedbackRequestItem[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, createdAt: date }) => ({ id, email, date }));

export const normalizeReceivedRequestList = (data: FeedbackRequestItem[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, createdAt: date }) => ({ id, email, date }));
