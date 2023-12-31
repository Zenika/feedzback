import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { FeedbackDraftData } from '../../shared/feedback/feedback.types';

@Injectable({
  providedIn: 'root',
})
export class GiveFeedbackService {
  private feedbackService = inject(FeedbackService);

  private draftDataList$ = new BehaviorSubject<FeedbackDraftData[]>([]);

  receiverEmail$ = new BehaviorSubject<string>('');

  filteredDraftDataList$ = combineLatest([this.draftDataList$, this.receiverEmail$]).pipe(
    map(([dataList, receiverEmail]) => {
      return dataList.filter((item) => item.receiverEmail.split('@')[0].includes(receiverEmail.split('@')[0]));
    }),
  );

  constructor() {
    this.feedbackService.getDraftDataList().subscribe((draftDataList) => this.draftDataList$.next(draftDataList));
  }

  giveDraft(data: FeedbackDraftData) {
    return this.feedbackService.giveDraft(data).pipe(
      tap(() => {
        const dataList = [...this.draftDataList$.value];

        const dataIndex = dataList.findIndex(({ receiverEmail }) => receiverEmail === data.receiverEmail);
        if (dataIndex !== -1) {
          dataList[dataIndex] = data;
        } else {
          dataList.push(data);
          dataList.sort((a, b) => (a.receiverEmail > b.receiverEmail ? 1 : a.receiverEmail < b.receiverEmail ? -1 : 0));
        }

        this.draftDataList$.next(dataList);
      }),
    );
  }

  // !FIXME: missing removing `draftData` on client-side...
  give = this.feedbackService.give.bind(this.feedbackService); // Alias
}
