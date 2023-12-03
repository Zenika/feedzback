import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ReplaySubject, of, switchMap } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { Feedback } from '../../types/feedback.types';
import { AllowedEmailDomainsPipe } from '../../validation/allowed-email-domains/allowed-email-domains.pipe';
import { MessageComponent } from '../message/message.component';
import { getFeedbackType } from './feedback.helpers';
import { FeedbackType } from './feedback.types';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
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

  private apiService = inject(ApiService);

  @Input({ required: true }) id!: string;

  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  protected feedbackType = FeedbackType;

  protected geColleagueEmail(feedback: Feedback): string | undefined {
    return this.type === this.feedbackType.received ? feedback.senderEmail : feedback.receiverEmail;
  }

  protected inputs$ = new ReplaySubject<{ id: string; type?: FeedbackType }>(1);

  protected feedback$ = this.inputs$.pipe(
    switchMap(({ id, type }) => (type ? this.apiService.getFeedbackById(id) : of(null))),
  );

  ngOnChanges({ id, type }: SimpleChanges): void {
    if (id || type) {
      this.inputs$.next({ id: this.id, type: this.type });
    }
  }
}
