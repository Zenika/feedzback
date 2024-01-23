import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { FeedbackService } from '../../../shared/feedback/feedback.service';
import { FeedbackDraft, FeedbackDraftListMap } from '../../../shared/feedback/feedback.types';
import { sortList } from '../../../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class FeedbackDraftService {
  private feedbackService = inject(FeedbackService);

  private _draftListMap$ = new BehaviorSubject<FeedbackDraftListMap>({
    spontaneous: [],
    requested: [],
  });

  draftListMap$ = this._draftListMap$.asObservable();

  private _applyDraft$ = new Subject<FeedbackDraft>();

  applyDraft$ = this._applyDraft$.asObservable();

  constructor() {
    this.feedbackService.getDraftListMap().subscribe((draftListMap) => this._draftListMap$.next(draftListMap));
  }

  save(draft: FeedbackDraft) {
    return this.feedbackService.giveDraft(draft).pipe(
      tap(() => {
        const draftList = [...this._draftListMap$.value.spontaneous];
        const draftListIndex = draftList.findIndex(({ receiverEmail }) => receiverEmail === draft.receiverEmail);

        if (draftListIndex !== -1) {
          draftList[draftListIndex] = draft;
          this._draftListMap$.next({
            spontaneous: draftList,
            requested: this._draftListMap$.value.requested,
          });
        } else {
          draftList.push(draft);
          this._draftListMap$.next({
            spontaneous: sortList(draftList, 'receiverEmail'),
            requested: this._draftListMap$.value.requested,
          });
        }
      }),
    );
  }

  apply(draft: FeedbackDraft) {
    this._applyDraft$.next(draft);
  }

  delete(receiverEmail: string) {
    return this.feedbackService.deleteDraftByType('spontaneous', receiverEmail).pipe(
      tap(() => {
        const draftList = [...this._draftListMap$.value.spontaneous];
        const draftListIndex = draftList.findIndex((draft) => draft.receiverEmail === receiverEmail);
        if (draftListIndex === -1) {
          return;
        }
        draftList.splice(draftListIndex, 1);
        this._draftListMap$.next({
          spontaneous: draftList,
          requested: this._draftListMap$.value.requested,
        });
      }),
    );
  }

  deleteRequested(token: string) {
    return this.feedbackService.deleteDraftByType('requested', token).pipe(
      tap(() => {
        const draftList = [...this._draftListMap$.value.requested];
        const draftListIndex = draftList.findIndex((draft) => draft.token === token);
        if (draftListIndex === -1) {
          return;
        }
        draftList.splice(draftListIndex, 1);
        this._draftListMap$.next({
          spontaneous: this._draftListMap$.value.spontaneous,
          requested: draftList,
        });
      }),
    );
  }
}
