import { Signal } from '@angular/core';
import { FeedbackRequest, FeedbackRequestDraft } from '../../shared/feedback/feedback.types';

export type GiveRequestedFeedbackData = {
  token: string | Signal<string>;
  request: FeedbackRequest | Signal<FeedbackRequest>;
  draft:
    | Pick<FeedbackRequestDraft, 'context' | 'positive' | 'negative' | 'comment'>
    | undefined
    | Signal<Pick<FeedbackRequestDraft, 'context' | 'positive' | 'negative' | 'comment'> | undefined>;
};
