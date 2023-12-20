import { Feedback, FeedbackRequest } from '../shared/feedback/feedback.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export const normalizeReceivedFeedbacks = (data: Feedback[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, updatedAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeGivenFeedbacks = (data: Feedback[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, updatedAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeSentRequests = (data: FeedbackRequest[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, createdAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeReceivedRequests = (data: FeedbackRequest[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, createdAt: date }) => ({
    id,
    email,
    date,
  }));
