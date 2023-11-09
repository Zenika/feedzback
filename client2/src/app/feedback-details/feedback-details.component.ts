import { DatePipe, NgIf } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { Feedback } from '../shared/types/feedback.types';
import { AllowedEmailDomainsPipe } from '../shared/validation/allowed-email-domains/allowed-email-domains.pipe';
import { getFeedbackType } from './feedback-details.helpers';
import { FeedbackType } from './feedback-details.types';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MessageComponent,
    AllowedEmailDomainsPipe,
  ],
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDetailsComponent implements OnInit {
  @HostBinding('class.app-feedback-details') hasCss = true;

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  @Input({ required: true }) id!: string;

  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  protected feedback: Feedback | null | undefined;

  protected feedbackType = FeedbackType;

  get colleagueEmail() {
    return this.type === this.feedbackType.received ? this.feedback?.senderEmail : this.feedback?.receverEmail;
  }

  async ngOnInit() {
    const token = await this.authService.getUserTokenId();
    if (!token) {
      return;
    }
    if (this.type) {
      this.graphQLService.getFeedbackById(this.id, token).subscribe((feedback) => (this.feedback = feedback));
    } else {
      this.feedback = null;
    }
  }
}
