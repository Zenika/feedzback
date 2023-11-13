import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { getFeedbackType } from '../shared/feedback/feedback.helpers';
import { FeedbackType } from '../shared/feedback/feedback.types';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { normalizeReceivedFeedbacks, normalizeSentFeedbacks } from './my-feedbacks.helpers';
import { NormalizedFeedback } from './my-feedbacks.types';

@Component({
  selector: 'app-my-feedbacks',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet, MatTabsModule, MatIconModule, MatInputModule, FeedbackListComponent],
  templateUrl: './my-feedbacks.component.html',
  styleUrls: ['./my-feedbacks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyFeedbacksComponent implements OnInit {
  @HostBinding('class.app-my-feedbacks') hasCss = true;

  @Input({
    transform: (value: string) => getFeedbackType(value) ?? FeedbackType.received,
  })
  type: FeedbackType = FeedbackType.received;

  protected get tabIndex() {
    return this.type === FeedbackType.received ? 0 : 1;
  }

  protected filter = '';

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  protected receivedFeedbacks: NormalizedFeedback[] = [];

  protected sentFeedbacks: NormalizedFeedback[] = [];

  protected feedbackType = FeedbackType;

  protected fetched = false;

  async ngOnInit() {
    const token = await this.authService.getUserTokenId();
    if (!token) {
      return;
    }
    this.graphQLService
      .getFeedbackList(this.authService.userSnapshot?.email ?? '', token)
      .subscribe(({ receivedFeedbacks, sentFeedbacks }) => {
        this.receivedFeedbacks = normalizeReceivedFeedbacks(receivedFeedbacks);
        this.sentFeedbacks = normalizeSentFeedbacks(sentFeedbacks);
        this.fetched = true;
      });
  }

  protected onTabIndexChange(index: number) {
    const type: FeedbackType = index === 0 ? FeedbackType.received : FeedbackType.sent;
    this.router.navigate(['../', type], { relativeTo: this.activatedRoute });
  }
}
