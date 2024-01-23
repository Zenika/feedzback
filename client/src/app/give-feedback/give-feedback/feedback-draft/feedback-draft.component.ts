import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FeedbackDraft, FeedbackRequestedDraft } from '../../../shared/feedback/feedback.types';
import { FeedbackDraftService } from './feedback-draft.service';

@Component({
  selector: 'app-feedback-draft',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './feedback-draft.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDraftComponent {
  @HostBinding('class.app-feedback-draft') hasCss = true;

  private feedbackDraftService = inject(FeedbackDraftService);

  protected draftList = toSignal(this.feedbackDraftService.draftListMap$, {
    initialValue: { spontaneous: [], requested: [] },
  });

  protected columns = ['receiverEmail', 'actions'];

  // "d" means "draft"
  protected d(element: unknown) {
    return element as FeedbackDraft;
  }

  // "rd" means "requested draft"
  protected rd(element: unknown) {
    return element as FeedbackRequestedDraft;
  }

  protected apply(draft: FeedbackDraft) {
    this.feedbackDraftService.apply(draft);
  }

  protected delete({ receiverEmail }: FeedbackDraft) {
    this.feedbackDraftService.delete(receiverEmail).subscribe();
  }

  protected deleteRequested({ token }: FeedbackRequestedDraft) {
    this.feedbackDraftService.deleteRequested(token).subscribe();
  }
}
