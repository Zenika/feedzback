import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackListComponent } from '../../shared/feedback/feedback-list/feedback-list.component';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveRequestedFeedbackListService } from './give-requested-feedback-list.service';

@Component({
  selector: 'app-give-requested-feedback-list',
  host: { class: 'app-give-requested-feedback-list' },
  standalone: true,
  imports: [RouterLink, MatIconModule, FeedbackListComponent, MessageComponent],
  templateUrl: './give-requested-feedback-list.component.html',
  styleUrl: './give-requested-feedback-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackListComponent {
  protected receivedRequest = inject(GiveRequestedFeedbackListService).receivedRequest;
}
