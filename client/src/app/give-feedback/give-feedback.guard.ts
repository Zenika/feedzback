import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, catchError, combineLatest, first, of, switchMap, tap } from 'rxjs';
import { authFactory } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { GiveFeedbackData, RequestWithToken } from './give-feedback.types';

export const giveFeedbackGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const feedbackService = inject(FeedbackService);
  const router = inject(Router);

  return combineLatest([authService.isKnownUser$, authService.isAnonymous$]).pipe(
    first(),
    switchMap(([isKnownUser, isAnonymous]) => {
      const { token } = route.queryParams;
      if (token) {
        return feedbackService.checkRequest(token).pipe(
          tap((request) => {
            const requestWithToken: RequestWithToken = { ...request, token };
            route.data = { requestWithToken } as GiveFeedbackData;
          }),
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
