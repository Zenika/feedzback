import { Feedback } from './feedback.types';

export type FeedbackRequestParams = Pick<Feedback, 'senderEmail' | 'receiverEmail' | 'message' | 'shared'>;

export type GiveRequestedFeedbackParams = Pick<Feedback, 'positive' | 'negative' | 'comment'>;

export type GiveFeedbackParams = Pick<
  Feedback,
  'senderEmail' | 'receiverEmail' | 'positive' | 'negative' | 'comment' | 'shared'
>;
