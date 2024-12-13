import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, OnInit, ViewEncapsulation, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH } from '../../../shared/feedback/feedback.config';
import { FeedbackGuideModule } from '../../../shared/guide';
import { isNotBlankValidator } from '../../../shared/validation/is-not-blank';
import { ValidationErrorMessagePipe } from '../../../shared/validation/validation-error-message';

@Component({
  selector: 'app-give-feedback-details',
  imports: [
    TextFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FeedbackGuideModule,
    ValidationErrorMessagePipe,
  ],
  templateUrl: './give-feedback-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackDetailsComponent implements OnInit {
  protected matDialog = inject(MatDialog);

  protected contextMaxLength = MEDIUM_MAX_LENGTH;

  protected feedbackMaxLength = LARGE_MAX_LENGTH;

  protected commentMaxLength = MEDIUM_MAX_LENGTH;

  // WARNING:
  // The `context` field may not be present in the `draft` object, because it was added to the feedback type later.
  context = input.required<FormControl<string | undefined>>();

  positive = input.required<FormControl<string>>();

  negative = input.required<FormControl<string>>();

  comment = input.required<FormControl<string>>();

  ngOnInit(): void {
    this.context().addValidators([Validators.maxLength(this.contextMaxLength)]);
    this.context().updateValueAndValidity();

    this.positive().addValidators([
      Validators.required,
      isNotBlankValidator,
      Validators.maxLength(this.feedbackMaxLength),
    ]);
    this.positive().updateValueAndValidity();

    this.negative().addValidators([
      Validators.required,
      isNotBlankValidator,
      Validators.maxLength(this.feedbackMaxLength),
    ]);
    this.negative().updateValueAndValidity();

    this.comment().addValidators([Validators.maxLength(this.commentMaxLength)]);
    this.comment().updateValueAndValidity();
  }
}
