import { ReceivedFeedback, SentFeedback } from '../shared/types/feedback.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export const normalizeReceivedFeedbacks = (data: ReceivedFeedback[]): NormalizedFeedback[] =>
  data.map(({ id, senderEmail: email, createdAt }) => ({
    id,
    email,
    createdAt,
  }));

export const normalizeSentFeedbacks = (data: SentFeedback[]): NormalizedFeedback[] =>
  data.map(({ id, receiverEmail: email, createdAt }) => ({
    id,
    email,
    createdAt,
  }));
