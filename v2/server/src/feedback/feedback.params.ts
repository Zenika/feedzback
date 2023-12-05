import { Feedback } from './feedback.types';

export type AskFeedbackParams = Pick<Feedback, 'senderEmail' | 'receiverEmail' | 'message' | 'shared'>;

export type SendAskedFeedbackParams = Pick<Feedback, 'positive' | 'negative' | 'comment'>;

export type SendFeedbackParams = Pick<
  Feedback,
  'senderEmail' | 'receiverEmail' | 'positive' | 'negative' | 'comment' | 'shared'
>;