import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { FeedbackDraft } from 'src/app/shared/feedback/feedback.types';
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

  draftList$ = new BehaviorSubject<FeedbackDraft[]>([
    {
      receiverEmail: 'receiverEmail',
      positive: 'positive',
      negative: 'negative',
      comment: 'comment',
      shared: true,
    },
  ]);
}
