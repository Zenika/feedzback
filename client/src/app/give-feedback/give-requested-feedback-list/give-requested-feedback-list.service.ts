import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, exhaustMap, map, shareReplay, startWith } from 'rxjs';
import { normalizeReceivedRequestList } from '../../history/history.utils';
import { FeedbackService } from '../../shared/feedback/feedback.service';

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

  receivedRequest = toSignal(this.receivedRequest$);

  refresh() {
    this.trigger$.next('');
  }

  private fetch() {
    return this.feedbackService
      .getListMap(['receivedRequest'])
      .pipe(map(({ receivedRequest }) => normalizeReceivedRequestList(receivedRequest)));
  }
}
