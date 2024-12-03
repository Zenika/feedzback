import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackListComponent, FeedbackTypeIconPipe } from '../../shared/feedback';
import { MessageComponent } from '../../shared/message';
import { GiveRequestedFeedbackListService } from './give-requested-feedback-list.service';

@Component({
  selector: 'app-give-requested-feedback-list',
  imports: [RouterLink, MatIconModule, FeedbackListComponent, FeedbackTypeIconPipe, MessageComponent],
  templateUrl: './give-requested-feedback-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackListComponent {
  protected list = inject(GiveRequestedFeedbackListService).list;
}
