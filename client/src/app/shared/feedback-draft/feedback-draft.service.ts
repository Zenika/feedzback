import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { FeedbackService } from '../feedback/feedback.service';
import {
  FeedbackDraft,
  FeedbackDraftType,
  FeedbackRequestDraft,
  FeedbackRequestDraftType,
} from '../feedback/feedback.types';

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

  // ----- Feedback draft -----

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

  // ----- Requested feedback draft -----

  giveRequested(requestDraft: FeedbackRequestDraft) {
    const { token, positive, negative, comment } = requestDraft;
    return this.feedbackService.giveRequestedDraft({ token, positive, negative, comment }).pipe(
      tap(() => {
        this._requestDraftList.update((requestDraftList) => {
          const requestDraftListIndex = requestDraftList.findIndex(
            ({ receiverEmail }) => receiverEmail === requestDraft.receiverEmail,
          );
          if (requestDraftListIndex !== -1) {
            requestDraftList[requestDraftListIndex] = requestDraft;
          } else {
            requestDraftList.unshift(requestDraft);
          }
          return [...requestDraftList];
        });
      }),
    );
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
