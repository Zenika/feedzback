import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError, map, withLatestFrom } from 'rxjs';
import { AuthService } from '../shared/auth';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { FeedbackDetails } from './feedback-details.types';
import { inferFeedbackType } from './feedback-details.utils';

export const feedbackDetailsResolver: ResolveFn<FeedbackDetails> = (route) => {
  const feedbackService = inject(FeedbackService);
  const user$ = inject(AuthService).user$;
  const router = inject(Router);

  return feedbackService.getDocument(route.params['id']).pipe(
    withLatestFrom(user$),
    map(([feedback, user]) => {
      if (!feedback || !user?.email) {
        throw new Error();
      }
      return {
        feedback,
        type: inferFeedbackType(feedback, user.email)!,
      };
    }),
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;
    }),
  );
};
