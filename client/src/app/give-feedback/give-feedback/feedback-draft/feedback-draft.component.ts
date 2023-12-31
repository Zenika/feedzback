import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDraft } from '../../../shared/feedback/feedback.types';
import { FeedbackDraftService } from './feedback-draft.service';

@Component({
  selector: 'app-feedback-draft',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './feedback-draft.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDraftComponent {
  @HostBinding('class.app-feedback-draft') hasCss = true;

  private feedbackDraftService = inject(FeedbackDraftService);

  protected draftList = toSignal(this.feedbackDraftService.draftList$, { initialValue: [] });

  protected columns = ['receiverEmail', 'actions'];

  // "d" means "draft"
  protected d(element: unknown) {
    return element as FeedbackDraft;
  }

  protected apply(draft: FeedbackDraft) {
    this.feedbackDraftService.apply(draft);
  }

  protected delete(draft: FeedbackDraft) {
    this.feedbackDraftService.delete(draft.receiverEmail).subscribe();
  }
}
