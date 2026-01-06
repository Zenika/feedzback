import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';
import { SMALL_MAX_LENGTH } from '../../shared/feedback/feedback.config';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { MessageComponent } from '../../shared/message/message.component';
import { PreRequestSuccessState } from '../pre-request-feedback-token-success/pre-request-feedback-token-success.types';
import { REQUEST_TEMPLATES } from '../request-feedback/request-feedback.config';

@Component({
  selector: 'app-pre-request-feedback-token',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    DialogTooltipDirective,
    MessageComponent,
  ],
  templateUrl: './pre-request-feedback-token.component.html',
})
export class PreRequestFeedbackTokenComponent {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  private feedbackService = inject(FeedbackService);

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

    this.feedbackService.preRequestToken(this.form.getRawValue()).subscribe(({ token }) => {
      const state: PreRequestSuccessState = {
        token,
      };
      this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
    });
  }
}
