import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FeedbackDraftListComponent } from '../../../shared/feedback/feedback-draft-list/feedback-draft-list.component';
import { FeedbackDraft } from '../../../shared/feedback/feedback.types';
import { GiveFeedbackDraftService } from './give-feedback-draft.service';

@Component({
  selector: 'app-give-feedback-draft',
  standalone: true,
  imports: [FeedbackDraftListComponent],
  templateUrl: './give-feedback-draft.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackDraftComponent {
  @HostBinding('class.app-give-feedback-draft') hasCss = true;

  protected columns = ['receiverEmail', 'actions'];

  private giveFeedbackDraftService = inject(GiveFeedbackDraftService);

  protected draftList = this.giveFeedbackDraftService.draftList;

  // "d" means "draft"
  protected d(element: unknown) {
    return element as FeedbackDraft;
  }

  protected apply(draft: FeedbackDraft) {
    this.giveFeedbackDraftService.apply(draft);
  }

  protected delete({ receiverEmail }: FeedbackDraft) {
    this.giveFeedbackDraftService.delete(receiverEmail).subscribe();
  }
}
