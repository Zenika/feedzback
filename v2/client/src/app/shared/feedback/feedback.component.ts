import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { ReplaySubject, map, of, switchMap } from 'rxjs';
import { MessageComponent } from '../ui/message/message.component';
import { AskedFeedbackComponent } from './asked-feedback/asked-feedback.component';
import { FeedbackService } from './feedback.service';
import { FeedbackType } from './feedback.types';
import { getFeedbackType } from './feedback.utils';
import { GivenFeedbackComponent } from './given-feedback/given-feedback.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [AsyncPipe, MessageComponent, AskedFeedbackComponent, GivenFeedbackComponent],
  templateUrl: './feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackComponent implements OnChanges {
  private feedbackService = inject(FeedbackService);

  @Input({ required: true }) id!: string;

  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  protected inputs$ = new ReplaySubject<{ id: string; type?: FeedbackType }>(1);

  protected feedback$ = this.inputs$.pipe(
    switchMap(({ id, type }) => (type ? this.feedbackService.getItem(id) : of(null))),
    map((feedback) => (feedback ? feedback : { status: 'unknown' as const })),
  );

  ngOnChanges({ id, type }: SimpleChanges): void {
    if (id || type) {
      this.inputs$.next({ id: this.id, type: this.type });
    }
  }
}
