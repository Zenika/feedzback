import { Component, DOCUMENT, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreRequestFeedbackService } from '../../shared/feedback';
import { FeedbackPreRequestDetails } from '../../shared/feedback/feedback.types';

@Component({
  selector: 'app-feedback-pre-request-list',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './feedback-pre-request-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackPreRequestListComponent {
  private document = inject(DOCUMENT);

  protected preRequestFeedbackService = inject(PreRequestFeedbackService);

  list = input.required<FeedbackPreRequestDetails[]>();

  protected copiedMagicLink = signal<string>('');

  protected columns = ['expiresInHours', 'remainingUses', 'shared', 'actions'];

  // "d" means "details"
  protected d(element: unknown) {
    return element as FeedbackPreRequestDetails;
  }

  protected toClipboard(magicLink: string) {
    this.copiedMagicLink.set(magicLink);
    this.document.defaultView?.navigator.clipboard.writeText(magicLink);
  }
}
