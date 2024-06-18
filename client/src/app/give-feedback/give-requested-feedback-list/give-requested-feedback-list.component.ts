import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackListComponent } from '../../shared/feedback/feedback-list/feedback-list.component';
import { FeedbackTypeIconPipe } from '../../shared/feedback/feedback-type-icon.pipe';
import { MessageComponent } from '../../shared/ui/message';
import { GiveRequestedFeedbackListService } from './give-requested-feedback-list.service';

@Component({
  selector: 'app-give-requested-feedback-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, FeedbackListComponent, FeedbackTypeIconPipe, MessageComponent],
  templateUrl: './give-requested-feedback-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackListComponent {
  protected list = inject(GiveRequestedFeedbackListService).list;
}
