import { NgTemplateOutlet } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { getFeedbackType } from '../shared/ui/feedback/feedback.helpers';
import { FeedbackType } from '../shared/ui/feedback/feedback.types';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { normalizeReceivedFeedbacks, normalizeSentFeedbacks } from './my-feedbacks.helpers';
import { NormalizedFeedback } from './my-feedbacks.types';

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
  styleUrls: ['./my-feedbacks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export default class MyFeedbacksComponent implements OnInit {
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

  private feedbackService = inject(FeedbackService);

  protected received: NormalizedFeedback[] = [];

  protected sent: NormalizedFeedback[] = [];

  protected feedbackType = FeedbackType;

  protected fetched = false;

  async ngOnInit() {
    this.feedbackService.getList().subscribe(({ received, sent }) => {
      this.received = normalizeReceivedFeedbacks(received);
      this.sent = normalizeSentFeedbacks(sent);
      this.fetched = true;
    });
  }

  protected onTabIndexChange(index: number) {
    const type: FeedbackType = index === 0 ? FeedbackType.received : FeedbackType.sent;
    this.router.navigate(['../', type], { relativeTo: this.activatedRoute });
  }
}
