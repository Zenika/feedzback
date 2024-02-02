import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDraft, FeedbackRequestDraft } from '../../feedback/feedback.types';

@Component({
  selector: 'app-feedback-draft-view',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './feedback-draft-view.component.html',
  styleUrl: './feedback-draft-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDraftViewComponent<T extends FeedbackDraft | FeedbackRequestDraft> {
  @HostBinding('class.app-feedback-draft-view') hasCss = true;

  @Input({ required: true }) draftList!: T[];

  @Output() edit = new EventEmitter<T>();

  @Output() delete = new EventEmitter<T>();

  protected columns = ['receiverEmail', 'actions'];

  // "d" means "draft"
  protected d(element: unknown) {
    return element as T;
  }
}
