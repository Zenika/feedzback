import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, combineLatest, map, switchMap } from 'rxjs';
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

  listLength = computed(() => this._list()?.length);

  private trigger$ = new BehaviorSubject<''>('');

  constructor() {
    combineLatest({
      trigger: this.trigger$,
      authenticated: this.authService.authenticated$,
    })
      .pipe(
        takeUntilDestroyed(),
        switchMap(({ authenticated }) => (authenticated ? this.fetch() : EMPTY)),
      )
      .subscribe((list) => this._list.set(list));
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
