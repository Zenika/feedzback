import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError, map, withLatestFrom } from 'rxjs';
import { NotFoundNavigationState } from '../not-found/not-found.types';
import { AuthService } from '../shared/auth';
import { FeedbackService } from '../shared/feedback';
import { FeedbackDetails } from './feedback-details.types';
import { inferFeedbackType } from './feedback-details.utils';

export const feedbackDetailsResolver: ResolveFn<FeedbackDetails> = (route) => {
  const feedbackService = inject(FeedbackService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return feedbackService.getDocument(route.params['id']).pipe(
    withLatestFrom(authService.user$),
    map(([feedback]) => {
      if (!feedback || !authService.userEmail()) {
        throw new Error();
      }
      return {
        feedback,
        type: inferFeedbackType(feedback, authService.userEmail())!,
      };
    }),
    catchError(() => {
      const state: NotFoundNavigationState = {
        details: $localize`:@@PageNotFound.InvalidFeedbackId:Le lien est erroné ou le feedZback a été archivé.`,
      };
      router.navigate(['/not-found'], { state });
      return EMPTY;
    }),
  );
};
