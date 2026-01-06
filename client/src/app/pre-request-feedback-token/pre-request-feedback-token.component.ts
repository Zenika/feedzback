import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { REQUEST_TEMPLATES } from '../request-feedback/request-feedback.config';
import { DialogTooltipDirective } from '../shared/dialog-tooltip';
import { SMALL_MAX_LENGTH } from '../shared/feedback/feedback.config';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { MessageComponent } from '../shared/message/message.component';
import { PreRequestSuccessState } from './pre-request-success/pre-request-success.types';

@Component({
  selector: 'app-pre-request-feedback-token',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatMenuModule,
    MessageComponent,
    DialogTooltipDirective,
  ],
  templateUrl: './pre-request-feedback-token.component.html',
})
export class PreRequestFeedbackTokenComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private feedbackService = inject(FeedbackService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  protected messageMaxLength = SMALL_MAX_LENGTH;

  protected form = this.formBuilder.group({
    message: ['', [Validators.maxLength(this.messageMaxLength)]],
    shared: [true],
  });

  protected requestTemplates = REQUEST_TEMPLATES;

  protected applyTemplate(message: string | undefined) {
    this.form.controls.message.setValue(message ?? '');
    this.form.controls.message.updateValueAndValidity();
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();

    const { message, shared } = this.form.getRawValue();

    this.feedbackService.preRequestToken(message, shared).subscribe({
      next: ({ token }) => {
        this.router.navigate(['success'], {
          relativeTo: this.activatedRoute,
          state: { token } satisfies PreRequestSuccessState,
        });
      },
      error: () => {
        this.form.enable();
      },
    });
  }
}
