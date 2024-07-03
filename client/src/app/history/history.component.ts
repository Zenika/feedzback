import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeedbackListComponent, FeedbackService, FeedbackTypeIconPipe } from '../shared/feedback';
import { FeedbackType, NormalizedFeedback } from '../shared/feedback/feedback.types';
import {
  getFeedbackType,
  normalizeGivenList,
  normalizeReceivedList,
  normalizeSentRequestList,
} from '../shared/feedback/feedback.utils';

@Component({
  selector: 'app-history',
  host: { class: 'app-history' },
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FeedbackListComponent,
    FeedbackTypeIconPipe,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class HistoryComponent implements OnInit {
  type = input(FeedbackType.received, {
    transform: (value: string) => getFeedbackType(value) ?? FeedbackType.received,
  });

  protected get tabIndex() {
    return this.feedbackTypeToTabIndex(this.type());
  }

  protected filter = '';

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private feedbackService = inject(FeedbackService);

  protected received: NormalizedFeedback[] = [];

  protected given: NormalizedFeedback[] = [];

  protected sentRequest: NormalizedFeedback[] = [];

  protected feedbackType = FeedbackType;

  protected fetched = false;

  ngOnInit() {
    this.feedbackService
      .getListMap(['received', 'given', 'sentRequest'])
      .subscribe(({ received, given, sentRequest }) => {
        this.received = normalizeReceivedList(received);
        this.given = normalizeGivenList(given);
        this.sentRequest = normalizeSentRequestList(sentRequest);

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
      2: FeedbackType.sentRequest,
    };
    return feedbackTypeMap[index];
  }

  private feedbackTypeToTabIndex(type: FeedbackType) {
    const tabIndexMap: Record<FeedbackType, number> = {
      [FeedbackType.received]: 0,
      [FeedbackType.given]: 1,
      [FeedbackType.sentRequest]: 2,

      // Note: The `receivedRequest` are not displayed in this page.
      // In this case, we display the first tab, as if the `type` input, coming from the URL, had any random value.
      [FeedbackType.receivedRequest]: 0,
    };
    return tabIndexMap[type];
  }
}
