import { Injectable, inject } from '@angular/core';
import { Subject, exhaustMap, map, shareReplay, startWith } from 'rxjs';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { normalizeReceivedRequestList } from '../../shared/feedback/feedback.utils';

@Injectable({
  providedIn: 'root',
})
export class GiveRequestedFeedbackListService {
  private feedbackService = inject(FeedbackService);

  private trigger$ = new Subject<''>();

  receivedRequest$ = this.trigger$.pipe(
    startWith(''),
    exhaustMap(() => this.fetch()),
    shareReplay(1),
  );

  refresh() {
    this.trigger$.next('');
  }

  private fetch() {
    return this.feedbackService
      .getListMap(['receivedRequest'])
      .pipe(map(({ receivedRequest }) => normalizeReceivedRequestList(receivedRequest)));
  }
}
