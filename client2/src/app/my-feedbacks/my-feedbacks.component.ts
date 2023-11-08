import { DatePipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { getFeedbackType } from '../feedback-details/feedback-details.helpers';
import { FeedbackType } from '../feedback-details/feedback-details.types';
import { AuthService } from '../shared/auth/auth.service';
import { BreakpointService } from '../shared/breakpoint';
import { DivisionComponent } from '../shared/division/division.component';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MyFeedbacksTemplateContextDirective } from './my-feedbacks.directive';
import { normalizeReceivedFeedbacks, normalizeSentFeedbacks } from './my-feedbacks.helpers';
import { NormalizedFeedback } from './my-feedbacks.types';

@Component({
  selector: 'app-my-feedbacks',
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule,
    DivisionComponent,
    MyFeedbacksTemplateContextDirective,
  ],
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

  get tabIndex() {
    return this.type === FeedbackType.received ? 0 : 1;
  }

  private router = inject(Router);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  protected receivedFeedbacks: NormalizedFeedback[] = [];

  protected sentFeedbacks: NormalizedFeedback[] = [];

  protected feedbackType = FeedbackType;

  protected fetched = false;

  protected isMobile = false;

  protected columns: (keyof NormalizedFeedback | 'actions' | 'mixed')[] = ['email', 'createdAt', 'actions'];

  constructor() {
    inject(BreakpointService)
      .device$.pipe(takeUntilDestroyed())
      .subscribe((device) => {
        this.isMobile = device === 'mobile';
        this.columns = this.isMobile ? ['mixed', 'actions'] : ['email', 'createdAt', 'actions'];
      });
  }

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
    this.router.navigate([], { queryParams: { type } });
  }

  // "nf" means "normalized feedback"
  protected nf(value: unknown) {
    return value as NormalizedFeedback;
  }
}
