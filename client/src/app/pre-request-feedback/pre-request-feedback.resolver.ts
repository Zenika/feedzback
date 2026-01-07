import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NotFoundNavigationState } from '../not-found/not-found.types';
import { FeedbackService } from '../shared/feedback';
import { FeedbackPreRequestSummary } from '../shared/feedback/feedback.types';
import { getPreRequestFeedbackErrMsg } from './pre-request-feedback.constants';

export const preRequestFeedbackResolver: ResolveFn<FeedbackPreRequestSummary> = (route) => {
  const router = inject(Router);

  return inject(FeedbackService)
    .checkPreRequest(route.params['token'])
    .pipe(
      catchError((response: HttpErrorResponse) => {
        const state: NotFoundNavigationState = {
          details: getPreRequestFeedbackErrMsg(response) ?? '',
        };
        return of(new RedirectCommand(router.parseUrl('/not-found'), { state, replaceUrl: true }));
      }),
    );
};
