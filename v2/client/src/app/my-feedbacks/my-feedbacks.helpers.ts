import { Feedback } from '../shared/feedback/feedback.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export const normalizeReceivedFeedbacks = (data: Feedback[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, updatedAt: date }) => ({
    id,
    email,
    date,
  }));

export const normalizeSentFeedbacks = (data: Feedback[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, updatedAt: date }) => ({
    id,
    email,
    date,
  }));
