import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, OnInit, ViewEncapsulation, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LARGE_MAX_LENGTH, MEDIUM_MAX_LENGTH } from '../../../shared/feedback/feedback.config';
import { isNotBlankValidator } from '../../../shared/validation/is-not-blank';
import { ValidationErrorMessagePipe } from '../../../shared/validation/validation-error-message';

@Component({
  selector: 'app-give-feedback-details',
  imports: [TextFieldModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ValidationErrorMessagePipe],
  templateUrl: './give-feedback-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackDetailsComponent implements OnInit {
  protected feedbackMaxLength = LARGE_MAX_LENGTH;

  protected commentMaxLength = MEDIUM_MAX_LENGTH;

  positive = input.required<FormControl<string>>();

  negative = input.required<FormControl<string>>();

  comment = input.required<FormControl<string>>();

  ngOnInit(): void {
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
