import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../shared/auth';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { NormalizedFeedback } from '../../shared/feedback/feedback.types';
import { normalizeReceivedRequestList } from '../../shared/feedback/feedback.utils';

@Injectable({
  providedIn: 'root',
})
export class GiveRequestedFeedbackListService {
  private authService = inject(AuthService);

  private feedbackService = inject(FeedbackService);

  private _list = signal<NormalizedFeedback[] | undefined>(undefined);

  list = this._list.asReadonly();

  listLength = computed(() => {
    const list = this._list();
    return list ? list.length || null : undefined;
  });

  private trigger$ = new Subject<''>();

  constructor() {
    combineLatest({
      trigger: this.trigger$.pipe(startWith('')),
      authenticated: this.authService.authenticated$,
    })
      .pipe(switchMap(({ authenticated }) => (authenticated ? this.fetch() : of([]))))
      .subscribe((feedbacks) => this._list.set(feedbacks));
  }

  refresh() {
    this.trigger$.next('');
  }

  private fetch() {
    return this.feedbackService
      .getListMap(['receivedRequest'])
      .pipe(map(({ receivedRequest }) => normalizeReceivedRequestList(receivedRequest)));
  }
}
