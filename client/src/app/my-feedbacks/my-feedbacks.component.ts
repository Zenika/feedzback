import { NgTemplateOutlet } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { FeedbackType } from '../shared/feedback/feedback.types';
import { getFeedbackType } from '../shared/feedback/feedback.utils';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { NormalizedFeedback } from './my-feedbacks.types';
import {
  normalizeGivenFeedbacks,
  normalizeReceivedFeedbacks,
  normalizeReceivedRequests,
  normalizeSentRequests,
} from './my-feedbacks.utils';

@Component({
  selector: 'app-my-feedbacks',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterOutlet,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FeedbackListComponent,
  ],
  templateUrl: './my-feedbacks.component.html',
  styleUrl: './my-feedbacks.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class MyFeedbacksComponent implements OnInit {
  @HostBinding('class.app-my-feedbacks') hasCss = true;

  @Input({
    transform: (value: string) => getFeedbackType(value) ?? FeedbackType.received,
  })
  type: FeedbackType = FeedbackType.received;

  protected get tabIndex() {
    return this.feedbackTypeToTabIndex(this.type);
  }

  protected filter = '';

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private feedbackService = inject(FeedbackService);

  protected received: NormalizedFeedback[] = [];

  protected given: NormalizedFeedback[] = [];

  protected sentRequest: NormalizedFeedback[] = [];

  protected receivedRequest: NormalizedFeedback[] = [];

  protected feedbackType = FeedbackType;

  protected fetched = false;

  async ngOnInit() {
    this.feedbackService.getList().subscribe(({ received, given, sentRequest, receivedRequest }) => {
      this.received = normalizeReceivedFeedbacks(received);
      this.given = normalizeGivenFeedbacks(given);
      this.sentRequest = normalizeSentRequests(sentRequest);
      this.receivedRequest = normalizeReceivedRequests(receivedRequest);

      this.fetched = true;
    });
  }

  protected onTabIndexChange(index: number) {
    const type = this.tabIndexToFeedbackType(index);
    this.router.navigate(['../', type], { relativeTo: this.activatedRoute });
  }

  private tabIndexToFeedbackType(index: number) {
    const feedbackTypeMap: Record<number, FeedbackType> = {
      0: FeedbackType.received,
      1: FeedbackType.given,
      2: this.sentRequest.length ? FeedbackType.sentRequest : FeedbackType.receivedRequest,
      3: FeedbackType.receivedRequest,
    };
    return feedbackTypeMap[index];
  }

  private feedbackTypeToTabIndex(type: FeedbackType) {
    const tabIndexMap: Record<FeedbackType, number> = {
      [FeedbackType.received]: 0,
      [FeedbackType.given]: 1,
      [FeedbackType.sentRequest]: 2,
      [FeedbackType.receivedRequest]: this.sentRequest.length ? 3 : 2,
    };
    return tabIndexMap[type];
  }
}
