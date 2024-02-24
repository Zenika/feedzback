import { Pipe, PipeTransform } from '@angular/core';
import { FeedbackType } from './feedback.types';

@Pipe({
  name: 'feedbackTypeIcon',
  standalone: true,
})
export class FeedbackTypeIconPipe implements PipeTransform {
  transform(type: FeedbackType): string {
    return (
      {
        received: 'move_to_inbox',
        given: 'outgoing_mail',
        sentRequest: 'schedule',
        receivedRequest: 'comment',
      } satisfies Record<FeedbackType, string>
    )[type];
  }
}
