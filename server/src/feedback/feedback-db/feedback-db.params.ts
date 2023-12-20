import { Feedback } from './feedback-db.types';

export type FeedbackRequestParams = Pick<Feedback, 'giverEmail' | 'receiverEmail' | 'message' | 'shared'>;

export type GiveRequestedFeedbackParams = Pick<Feedback, 'positive' | 'negative' | 'comment'>;

export type GiveFeedbackParams = Pick<
  Feedback,
  'giverEmail' | 'receiverEmail' | 'positive' | 'negative' | 'comment' | 'shared'
>;
