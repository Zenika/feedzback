import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { FeedbackService } from '../../shared/feedback';
import { FeedbackItem, FeedbackRequestItem } from '../../shared/feedback/feedback.types';
import { MANAGER_LIST_ROOT } from './manager-list.config';

export const managerListResolver: ResolveFn<(FeedbackItem | FeedbackRequestItem)[]> = (route) => {
  const { managedEmail } = route.params;
  if (managedEmail === MANAGER_LIST_ROOT) {
    return [];
  }
  const router = inject(Router);
  return inject(FeedbackService)
    .getSharedFeedbackList(managedEmail)
    .pipe(
      catchError(() => {
        router.navigate(['/not-found']);
        return EMPTY;
      }),
    );
};
