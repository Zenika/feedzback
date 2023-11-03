import { DatePipe, NgIf } from '@angular/common';
import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { Feedback } from '../shared/types/feedback.types';
import { getFeedbackType } from './feedback-details.helpers';
import { FeedbackType } from './feedback-details.types';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [NgIf, DatePipe, RouterLink, MatCardModule, MatIconModule, MessageComponent],
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDetailsComponent implements OnInit {
  @HostBinding('class.app-feedback-details') hasCss = true;

  private graphQLService = inject(GraphQLService);

  @Input({ required: true }) id!: string;

  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  protected feedback: Feedback | null | undefined;

  protected feedbackType = FeedbackType;

  ngOnInit() {
    if (this.type) {
      this.graphQLService.getFeedbackById(this.id).subscribe((feedback) => (this.feedback = feedback));
    } else {
      this.feedback = null;
    }
  }
}
