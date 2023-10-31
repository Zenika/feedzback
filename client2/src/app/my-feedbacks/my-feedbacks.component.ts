import { DatePipe, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { getFeedbackType } from '../feedback-details/feedback-details.helpers';
import { FeedbackType } from '../feedback-details/feedback-details.types';
import { AuthService } from '../shared/auth/auth.service';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { ReceivedFeedback, SentFeedback } from '../shared/types/feedback.types';

@Component({
  selector: 'app-my-feedbacks',
  standalone: true,
  imports: [NgIf, DatePipe, RouterLink, MatIconModule, MatTableModule, MatTabsModule],
  templateUrl: './my-feedbacks.component.html',
  styleUrls: ['./my-feedbacks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyFeedbacksComponent implements OnInit {
  @Input({
    transform: (value: string) => getFeedbackType(value) ?? FeedbackType.received,
  })
  type: FeedbackType = FeedbackType.received;

  get tabIndex() {
    return this.type === FeedbackType.received ? 0 : 1;
  }

  private router = inject(Router);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  protected receivedFeedbacks: ReceivedFeedback[] = [];

  protected sentFeedbacks: SentFeedback[] = [];

  protected receivedColumns: (keyof ReceivedFeedback | 'actions')[] = [
    'senderName',
    'senderEmail',
    'createdAt',
    'actions',
  ];

  protected sentColumns: (keyof SentFeedback | 'actions')[] = ['receverName', 'receverEmail', 'createdAt', 'actions'];

  protected feedbackType = FeedbackType;

  ngOnInit(): void {
    this.graphQLService
      .getFeedbackList(this.authService.userSnapshot?.email ?? '')
      .subscribe(({ receivedFeedbacks, sentFeedbacks }) => {
        this.receivedFeedbacks = receivedFeedbacks;
        this.sentFeedbacks = sentFeedbacks;
      });
  }

  onTabIndexChange(index: number) {
    const type: FeedbackType = index === 0 ? FeedbackType.received : FeedbackType.sent;
    this.router.navigate([], { queryParams: { type } });
  }
}
