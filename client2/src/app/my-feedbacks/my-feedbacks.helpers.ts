import { ReceivedFeedback, SentFeedback } from '../shared/types/feedback.types';
import { NormalizedFeedback } from './my-feedbacks.types';

export const normalizeReceivedFeedbacks = (data: ReceivedFeedback[]): NormalizedFeedback[] =>
  data.map(({ id, senderName: name, senderEmail: email, createdAt }) => ({
    id,
    name,
    email,
    createdAt,
  }));

export const normalizeSentFeedbacks = (data: SentFeedback[]): NormalizedFeedback[] =>
  data.map(({ id, receverName: name, receverEmail: email, createdAt }) => ({
    id,
    name,
    email,
    createdAt,
  }));
