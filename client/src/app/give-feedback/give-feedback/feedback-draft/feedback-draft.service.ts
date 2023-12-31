import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { FeedbackService } from '../../../shared/feedback/feedback.service';
import { FeedbackDraft } from '../../../shared/feedback/feedback.types';
import { sortList } from '../../../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class FeedbackDraftService {
  private feedbackService = inject(FeedbackService);

  private _draftList$ = new BehaviorSubject<FeedbackDraft[]>([]);

  draftList$ = this._draftList$.asObservable();

  private _applyDraft$ = new Subject<FeedbackDraft>();

  applyDraft$ = this._applyDraft$.asObservable();

  constructor() {
    this.feedbackService.getDraftList().subscribe((draftList) => this._draftList$.next(draftList));
  }

  save(draft: FeedbackDraft) {
    return this.feedbackService.giveDraft(draft).pipe(
      tap(() => {
        const draftListIndex = this._draftList$.value.findIndex(
          ({ receiverEmail }) => receiverEmail === draft.receiverEmail,
        );
        const newDraftList = [...this._draftList$.value];
        if (draftListIndex !== -1) {
          newDraftList[draftListIndex] = draft;
          this._draftList$.next(newDraftList);
        } else {
          newDraftList.push(draft);
          this._draftList$.next(sortList(newDraftList, 'receiverEmail'));
        }
      }),
    );
  }

  delete(receiverEmail: string) {
    return this.feedbackService.deleteDraft(receiverEmail).pipe(
      tap(() => {
        const draftListIndex = this._draftList$.value.findIndex((draft) => draft.receiverEmail === receiverEmail);
        if (draftListIndex === -1) {
          return;
        }
        const newDraftList = [...this._draftList$.value];
        newDraftList.splice(draftListIndex, 1);
        this._draftList$.next(newDraftList);
      }),
    );
  }

  apply(draft: FeedbackDraft) {
    this._applyDraft$.next(draft);
  }
}
