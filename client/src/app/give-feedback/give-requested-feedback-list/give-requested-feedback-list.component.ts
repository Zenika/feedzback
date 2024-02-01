import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { normalizeReceivedRequestList } from '../../my-feedbacks/my-feedbacks.utils';
import { FeedbackListComponent } from '../../shared/feedback/feedback-list/feedback-list.component';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { MessageComponent } from '../../shared/ui/message/message.component';

@Component({
  selector: 'app-give-requested-feedback-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, FeedbackListComponent, MessageComponent],
  templateUrl: './give-requested-feedback-list.component.html',
  styleUrl: './give-requested-feedback-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackListComponent {
  @HostBinding('class.app-give-requested-feedback-list') hasCss = true;

  private feedbackService = inject(FeedbackService);

  protected receivedRequest = toSignal(
    this.feedbackService
      .getListMap(['receivedRequest'])
      .pipe(map(({ receivedRequest }) => normalizeReceivedRequestList(receivedRequest))),
  );
}
