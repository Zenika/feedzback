import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FeedbackDraft, FeedbackRequestDraft } from '../feedback/feedback.types';
import { FeedbackDraftViewComponent } from './feedback-draft-view/feedback-draft-view.component';
import { FeedbackDraftService } from './feedback-draft.service';

@Component({
  selector: 'app-feedback-draft',
  standalone: true,
  imports: [FeedbackDraftViewComponent],
  templateUrl: './feedback-draft.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDraftComponent {
  @HostBinding('class.app-feedback-draft') hasCss = true;

  protected columns = ['receiverEmail', 'actions'];

  private feedbackDraftService = inject(FeedbackDraftService);

  protected draftList = this.feedbackDraftService.draftList;

  protected requestDraftList = this.feedbackDraftService.requestDraftList;

  // "d" means "draft"
  protected d(element: unknown) {
    return element as FeedbackDraft;
  }

  // "rd" means "request draft"
  protected rd(element: unknown) {
    return element as FeedbackRequestDraft;
  }

  protected apply(draft: FeedbackDraft) {
    this.feedbackDraftService.apply(draft);
  }

  protected delete({ receiverEmail }: FeedbackDraft) {
    this.feedbackDraftService.delete(receiverEmail).subscribe();
  }

  protected applyRequested({ token }: FeedbackRequestDraft) {
    this.feedbackDraftService.applyRequested(token);
  }

  protected deleteRequested({ token }: FeedbackRequestDraft) {
    this.feedbackDraftService.deleteRequested(token).subscribe();
  }
}
