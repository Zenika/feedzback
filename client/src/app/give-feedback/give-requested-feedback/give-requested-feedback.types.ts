import { FeedbackRequest, FeedbackRequestDraft } from '../../shared/feedback/feedback.types';

export type GiveRequestedFeedbackData = {
  token: string;
  request: FeedbackRequest;
  draft?: Pick<FeedbackRequestDraft, 'positive' | 'negative' | 'comment'>;
};
