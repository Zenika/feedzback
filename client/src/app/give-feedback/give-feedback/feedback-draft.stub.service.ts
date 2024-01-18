import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { FeedbackDraftService } from './feedback-draft/feedback-draft.service';

@Injectable()
export class FeedbackDraftStubService implements Partial<FeedbackDraftService> {
  applyDraft$ = of({
    receiverEmail: 'receiverEmail',
    positive: 'positive',
    negative: 'negative',
    comment: 'comment',
    shared: true,
  });

  draftList$ = of([
    {
      receiverEmail: 'receiverEmail',
      positive: 'positive',
      negative: 'negative',
      comment: 'comment',
      shared: true,
    },
  ]);
}
