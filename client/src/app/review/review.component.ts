import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../shared/auth';
import { ValidationErrorMessagePipe } from '../shared/form/validation-error-message';
import { ReviewService } from '../shared/review/review.service';

export const NoteValidator = (control: AbstractControl): ValidationErrors | null =>
  control.value > 0 && control.value <= 5 ? null : { required: 'Une note est requise.' };

@Component({
  selector: 'app-review',
  standalone: true,
  host: { class: 'app-review' },
  imports: [
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    ValidationErrorMessagePipe,
  ],

  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent {
  @ViewChild('reviewStep1') reviewStep1Tmpl!: TemplateRef<unknown>;

  private matDialog = inject(MatDialog);

  private formBuilder = inject(NonNullableFormBuilder);

  protected authService = inject(AuthService);
  
  protected reviewService = inject(ReviewService);

  protected iconSentiments = [
    'sentiment_extremely_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_neutral',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
  ];

  protected form = this.formBuilder.group({
    note: [0, [Validators.required, NoteValidator]],
    comment: [],
  });

  protected get canReview() {
    return this.authService.userSnapshotEmail;
  }

  protected onSubmit() {
    this.reviewService
      .setReview({
        reviewerEmail: this.authService.userSnapshotEmail!,
        note: this.form.controls.note.value!,
        comment: this.form.controls.comment.value,
      })
      .subscribe();
  }

  protected open() {
    this.matDialog.open(this.reviewStep1Tmpl, { width: '50%' });
  }

  protected chooseNote(newNote: number) {
    this.form.controls.note.setValue(newNote);
  }
}
