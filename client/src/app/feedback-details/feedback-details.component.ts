import { AsyncPipe } from '@angular/common';
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Observable, ReplaySubject, map, switchMap, withLatestFrom } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { GivenFeedbackComponent } from '../shared/feedback/given-feedback/given-feedback.component';
import { RequestedFeedbackComponent } from '../shared/feedback/requested-feedback/requested-feedback.component';
import { MessageComponent } from '../shared/ui/message/message.component';
import { FeedbackDetails } from './feedback-details.types';
import { inferFeedbackType } from './feedback-details.utils';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatIconModule, MessageComponent, GivenFeedbackComponent, RequestedFeedbackComponent],
  templateUrl: './feedback-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDetailsComponent {
  private feedbackService = inject(FeedbackService);

  private authService = inject(AuthService);

  @Input({ required: true }) set id(id: string) {
    this.id$.next(id);
  }

  protected id$ = new ReplaySubject<string>(1);

  protected feedbackDetails$: Observable<FeedbackDetails | null> = this.id$.pipe(
    switchMap((id) => this.feedbackService.getItem(id)),
    withLatestFrom(this.authService.user$),
    map(([feedback, user]) => {
      if (feedback && user?.email) {
        return {
          feedback,
          type: inferFeedbackType(feedback, user.email)!,
        };
      }
      return null;
    }),
  );
}
