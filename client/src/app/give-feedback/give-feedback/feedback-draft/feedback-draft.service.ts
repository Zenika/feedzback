import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { FeedbackService } from '../../../shared/feedback/feedback.service';
import {
  FeedbackDraft,
  FeedbackDraftType,
  FeedbackRequestDraft,
  FeedbackRequestDraftType,
} from '../../../shared/feedback/feedback.types';

@Injectable({
  providedIn: 'root',
})
export class FeedbackDraftService {
  private feedbackService = inject(FeedbackService);

  private _draftList = signal<FeedbackDraft[]>([]);

  draftList = this._draftList.asReadonly();

  private _requestDraftList = signal<FeedbackRequestDraft[]>([]);

  requestDraftList = this._requestDraftList.asReadonly();

  hasAnyDraft = computed(() => this._draftList().length > 0 || this._requestDraftList().length > 0);

  private _applyDraft$ = new Subject<FeedbackDraft>();

  applyDraft$ = this._applyDraft$.asObservable();

  constructor() {
    this.feedbackService.getDraftListMap().subscribe(({ feedback, feedbackRequest }) => {
      this._draftList.set(feedback);
      this._requestDraftList.set(feedbackRequest);
    });
  }

  save(draft: FeedbackDraft) {
    return this.feedbackService.giveDraft(draft).pipe(
      tap(() => {
        this._draftList.update((draftList) => {
          const draftListIndex = draftList.findIndex(({ receiverEmail }) => receiverEmail === draft.receiverEmail);
          if (draftListIndex !== -1) {
            draftList[draftListIndex] = draft;
          } else {
            draftList.push(draft);
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

  deleteRequested(token: string) {
    return this.feedbackService.deleteDraft(FeedbackRequestDraftType, token).pipe(
      tap(() => {
        const requestDraftListIndex = this._requestDraftList().findIndex(
          (requestDraft) => requestDraft.token === token,
        );
        if (requestDraftListIndex === -1) {
          return;
        }
        this._requestDraftList.update((requestDraftList) => {
          requestDraftList.splice(requestDraftListIndex, 1);
          return [...requestDraftList];
        });
      }),
    );
  }
}
