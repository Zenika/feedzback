import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { FeedbackService } from '../../../shared/feedback/feedback.service';
import { FeedbackDraft, FeedbackDraftType } from '../../../shared/feedback/feedback.types';

@Injectable({
  providedIn: 'root',
})
export class GiveFeedbackDraftService {
  private feedbackService = inject(FeedbackService);

  private _draftList = signal<FeedbackDraft[]>([]);

  draftList = this._draftList.asReadonly();

  hasDraft = computed(() => this._draftList().length > 0);

  private _applyDraft$ = new Subject<FeedbackDraft>();

  applyDraft$ = this._applyDraft$.asObservable();

  constructor() {
    this.feedbackService.getDraftList().subscribe((draftList) => this._draftList.set(draftList));
  }

  give(draft: FeedbackDraft) {
    return this.feedbackService.giveDraft(draft).pipe(
      tap(() => {
        this._draftList.update((draftList) => {
          const draftListIndex = draftList.findIndex(({ receiverEmail }) => receiverEmail === draft.receiverEmail);
          if (draftListIndex !== -1) {
            draftList[draftListIndex] = draft;
          } else {
            draftList.unshift(draft);
          }
          return [...draftList];
        });
      }),
    );
  }

  delete(receiverEmail: string) {
    return this.feedbackService.deleteDraft(FeedbackDraftType, receiverEmail).pipe(
      tap(() => {
        const draftListIndex = this._draftList().findIndex((draft) => draft.receiverEmail === receiverEmail);
        if (draftListIndex === -1) {
          return;
        }
        this._draftList.update((draftList) => {
          draftList.splice(draftListIndex, 1);
          return [...draftList];
        });
      }),
    );
  }

  apply(draft: FeedbackDraft) {
    this._applyDraft$.next(draft);
  }
}
