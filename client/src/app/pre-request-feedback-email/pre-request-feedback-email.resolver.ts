import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NotFoundNavigationState } from '../not-found/not-found.types';
import { FeedbackService } from '../shared/feedback';
import { FeedbackPreRequestSummary } from '../shared/feedback/feedback.types';
import { getPreRequestFeedbackEmailErrMsg } from './pre-request-feedback-email.constants';

export const preRequestFeedbackEmailResolver: ResolveFn<FeedbackPreRequestSummary> = (route) => {
  const router = inject(Router);

  return inject(FeedbackService)
    .checkPreRequest(route.params['token'])
    .pipe(
      catchError((response: HttpErrorResponse) => {
        const state: NotFoundNavigationState = {
          details: getPreRequestFeedbackEmailErrMsg(response) ?? '',
        };
        return of(new RedirectCommand(router.parseUrl('/not-found'), { state, replaceUrl: true }));
      }),
    );
};
