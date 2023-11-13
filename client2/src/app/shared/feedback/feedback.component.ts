import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ReplaySubject, combineLatestWith, of, switchMap } from 'rxjs';
import { AuthService } from '../../shared/auth/auth.service';
import { GraphQLService } from '../../shared/graphql/graphql.service';
import { MessageComponent } from '../../shared/message/message.component';
import { Feedback } from '../../shared/types/feedback.types';
import { AllowedEmailDomainsPipe } from '../../shared/validation/allowed-email-domains/allowed-email-domains.pipe';
import { getFeedbackType } from './feedback.helpers';
import { FeedbackType } from './feedback.types';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MessageComponent,
    AllowedEmailDomainsPipe,
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackComponent implements OnChanges {
  @HostBinding('class.app-feedback') hasCss = true;

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  @Input({ required: true }) id!: string;

  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  protected feedbackType = FeedbackType;

  protected geColleagueEmail(feedback: Feedback): string | undefined {
    return this.type === this.feedbackType.received ? feedback.senderEmail : feedback.receverEmail;
  }

  protected inputs$ = new ReplaySubject<{ id: string; type?: FeedbackType }>(1);

  protected feedback$ = this.inputs$.pipe(
    combineLatestWith(this.authService.getUserTokenId()),
    switchMap(([{ id, type }, token]) => (type && token ? this.graphQLService.getFeedbackById(id, token) : of(null))),
  );

  ngOnChanges({ id, type }: SimpleChanges): void {
    if (id || type) {
      this.inputs$.next({ id: this.id, type: this.type });
    }
  }
}
