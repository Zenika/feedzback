import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError, combineLatest, first, of, switchMap, tap } from 'rxjs';
import { authFactory } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { SendFeedbackService } from './send-feedback.service';

export const sendFeedbackGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const feedbackService = inject(FeedbackService);
  const sendFeedbackService = inject(SendFeedbackService);
  const router = inject(Router);

  sendFeedbackService.init();

  return combineLatest([authService.isKnownUser$, authService.isAnonymous$]).pipe(
    first(),
    switchMap(([isKnownUser, isAnonymous]) => {
      const { id } = route.queryParams;
      if (id) {
        return feedbackService.checkAsked(id).pipe(
          tap((askedFeedback) => sendFeedbackService.set(askedFeedback)),
          switchMap(() => {
            if (isKnownUser || isAnonymous) {
              return of(true);
            }
            return authService.signInAnonymously();
          }),
          catchError(() => {
            router.navigate(['/not-found']);
            return EMPTY;
          }),
        );
      }

      if (isKnownUser) {
        return of(true);
      }
      return authFactory(authService, router, state.url);
    }),
  );
};
