import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, catchError, first, of, switchMap, tap } from 'rxjs';
import { NotFoundNavigationState } from '../../not-found/not-found.types';
import { AuthService } from '../../shared/auth';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { GiveRequestedFeedbackData } from './give-requested-feedback.types';

export const giveRequestedFeedbackGuard = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const feedbackService = inject(FeedbackService);
  const router = inject(Router);

  return authService.guest$.pipe(
    first(),
    switchMap((guest) => {
      const { token } = route.params;
      return feedbackService.checkRequest(token).pipe(
        tap(({ request, draft }) => {
          let _draft: GiveRequestedFeedbackData['draft'] = undefined;
          if (draft) {
            const { positive, negative, comment } = draft;
            _draft = { positive, negative, comment };
          }
          // Note: this guard has more than one responsibility (it also provides data to the routed component)
          route.data = { token, request, draft: _draft } satisfies GiveRequestedFeedbackData;
        }),
        switchMap(() => {
          if (!guest) {
            return of(true);
          }
          return authService.signInAnonymously();
        }),
        catchError(() => {
          const state: NotFoundNavigationState = {
            details: $localize`:@@PageNotFound.InvalidTokenId:Le lien est erroné ou la demande de feedZback a été archivée.`,
          };
          router.navigate(['/not-found'], { state });
          return EMPTY;
        }),
      );
    }),
  );
};
