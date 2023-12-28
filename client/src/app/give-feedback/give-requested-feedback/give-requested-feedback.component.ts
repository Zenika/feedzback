import { Component, HostBinding, Input, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveRequestedFeedbackData, RequestWithToken } from './give-requested-feedback.types';

@Component({
  selector: 'app-give-requested-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MessageComponent,
    GiveFeedbackDetailsComponent,
  ],
  templateUrl: './give-requested-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackComponent implements GiveRequestedFeedbackData {
  @HostBinding('class.app-give-requested-feedback') hasCss = true;

  @Input({ required: true }) requestWithToken!: RequestWithToken;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  protected isAnonymous = inject(AuthService).userSnapshot?.isAnonymous;

  private feedbackService = inject(FeedbackService);

  form = this.formBuilder.group({
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
  });

  submitInProgress = false;

  showError = false;

  feedbackId?: string;

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.showError = false;
    this.disableForm(true);

    const { positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService
      .giveRequested({ token: this.requestWithToken.token, positive, negative, comment })
      .subscribe((success) => {
        if (!success) {
          this.showError = true;
          this.disableForm(false);
        } else {
          this.feedbackId = this.isAnonymous ? undefined : this.requestWithToken?.id;
          this.navigateToSuccess();
        }
      });
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private navigateToSuccess() {
    const state: GiveFeedbackSuccess = {
      receiverEmail: this.requestWithToken.receiverEmail,
      feedbackId: this.isAnonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['../../success'], { relativeTo: this.activatedRoute, state });
  }
}
