import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { FeedbackService } from '../../shared/feedback';
import { Feedback, FeedbackRequest } from '../../shared/feedback/feedback.types';

export const managerDocumentResolver: ResolveFn<Feedback | FeedbackRequest> = (route) => {
  const { feedbackId } = route.params;
  const router = inject(Router);
  return inject(FeedbackService)
    .getSharedFeedbackDocument(feedbackId)
    .pipe(
      catchError(() => {
        router.navigate(['/not-found']);
        return EMPTY;
      }),
    );
};
