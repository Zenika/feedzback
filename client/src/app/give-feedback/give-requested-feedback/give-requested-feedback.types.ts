import { FeedbackRequest, FeedbackRequestedDraft } from '../../shared/feedback/feedback.types';

export type GiveRequestedFeedbackData = {
  token: string;
  request: FeedbackRequest;
  draft?: Pick<FeedbackRequestedDraft, 'positive' | 'negative' | 'comment'>;
};
