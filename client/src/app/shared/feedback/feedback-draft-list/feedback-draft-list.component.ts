import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDraft, FeedbackRequestDraft } from '../feedback.types';

@Component({
  selector: 'app-feedback-draft-list',
  host: { class: 'app-feedback-draft-list' },
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './feedback-draft-list.component.html',
  styleUrl: './feedback-draft-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDraftListComponent<T extends FeedbackDraft | FeedbackRequestDraft> {
  draftList = input.required<T[]>();

  edit = output<T>();

  delete = output<T>();

  protected columns = ['receiverEmail', 'actions'];

  // "d" means "draft"
  protected d(element: unknown) {
    return element as T;
  }
}
