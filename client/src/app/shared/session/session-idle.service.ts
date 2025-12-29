import { DOCUMENT, inject, Injectable, NgZone } from '@angular/core';
import {
  delay,
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import { AuthService } from '../auth';
import { SESSION_ACTIVITY_DATE_STORAGE_KEY, SESSION_CONFIG } from './session.constants';
import { SessionIdleEvent } from './session.types';
import { parseNumber } from './session.utils';

@Injectable({
  providedIn: 'root',
})
export class SessionIdleService {
  private ngZone = inject(NgZone);

  private window = inject(DOCUMENT).defaultView;

  private authService = inject(AuthService);

  private readonly config = SESSION_CONFIG;

  // ----- Activity date: events -----

  private activityDateFromCurrentTab$ = this.ngZone.runOutsideAngular(() => {
    if (!this.window) {
      return EMPTY;
    }
    return merge(
      fromEvent(this.window, 'click'),
      fromEvent(this.window, 'scroll'),
      fromEvent(this.window, 'mousemove'),
    ).pipe(
      startWith('any value'),
      throttleTime(2000),
      map(() => Date.now()),
      tap((activityDate) => this.setActivityDate(activityDate)),
    );
  });

  private activityDateFromOtherTab$ = this.ngZone.runOutsideAngular(() => {
    if (!this.window) {
      return EMPTY;
    }
    return fromEvent(this.window, 'storage').pipe(
      filter(
        (event): event is StorageEvent =>
          event instanceof StorageEvent && event.key === SESSION_ACTIVITY_DATE_STORAGE_KEY,
      ),
      switchMap(({ newValue }) => {
        const activityDate = parseNumber(newValue);
        return activityDate === undefined ? EMPTY : of(activityDate);
      }),
    );
  });

  private activityDate$ = this.authService.authenticated$.pipe(
    switchMap((authenticated) => {
      if (!this.window?.localStorage) {
        return of(undefined);
      }
      if (!authenticated) {
        this.removeActivityDate();
        return of(null);
      }
      return merge(this.activityDateFromCurrentTab$, this.activityDateFromOtherTab$);
    }),
    filter((activityDate) => activityDate !== undefined),
    shareReplay(1),
  );

  events$: Observable<SessionIdleEvent> = this.activityDate$.pipe(
    switchMap((activityDate) => {
      if (!activityDate) {
        return EMPTY;
      }
      return merge(
        of('noIdleWarning' as const),
        of('idleWarning' as const).pipe(delay((this.config.idle - this.config.idleWarning) * 1000)),
        of('idle' as const).pipe(delay(this.config.idle * 1000)),
      );
    }),
  );

  // ----- Activity date: storage -----

  private setActivityDate(activityDate: number) {
    this.window?.localStorage.setItem(SESSION_ACTIVITY_DATE_STORAGE_KEY, activityDate.toString());
  }

  private removeActivityDate() {
    this.window?.localStorage.removeItem(SESSION_ACTIVITY_DATE_STORAGE_KEY);
  }

  getActivityDate() {
    return parseNumber(this.window?.localStorage.getItem(SESSION_ACTIVITY_DATE_STORAGE_KEY));
  }
}
