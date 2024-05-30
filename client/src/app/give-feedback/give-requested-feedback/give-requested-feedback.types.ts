import { Signal } from '@angular/core';
import { FeedbackRequest, FeedbackRequestDraft } from '../../shared/feedback/feedback.types';

export interface GiveRequestedFeedbackData {
  token: string | Signal<string>;
  request: FeedbackRequest | Signal<FeedbackRequest>;
  draft:
    | Pick<FeedbackRequestDraft, 'positive' | 'negative' | 'comment'>
    | undefined
    | Signal<Pick<FeedbackRequestDraft, 'positive' | 'negative' | 'comment'> | undefined>;
}
