import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { FeedbackRequest, FeedbackRequestDraft } from 'src/app/shared/feedback/feedback.types';
import { AuthService } from '../../shared/auth';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveRequestedFeedbackData } from './give-requested-feedback.types';

@Component({
  selector: 'app-give-requested-feedback',
  standalone: true,
  imports: [
    RouterLinkWithHref,
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
export class GiveRequestedFeedbackComponent implements GiveRequestedFeedbackData, OnInit {
  @HostBinding('class.app-give-requested-feedback') hasCss = true;

  @Input({ required: true }) token!: string;

  @Input({ required: true }) request!: FeedbackRequest;

  @Input({ required: true }) draft?: Pick<FeedbackRequestDraft, 'positive' | 'negative' | 'comment'>;

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

  showDraft = false;

  feedbackId?: string;

  ngOnInit(): void {
    if (this.draft) {
      this.form.setValue(this.draft);
      this.form.updateValueAndValidity();
    }
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.showError = false;
    this.disableForm(true);

    const { positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.giveRequested({ token: this.token, positive, negative, comment }).subscribe((success) => {
      if (!success) {
        this.showError = true;
        this.disableForm(false);
      } else {
        this.feedbackId = this.isAnonymous ? undefined : this.request?.id;
        this.navigateToSuccess();
      }
    });
  }

  protected onDraft() {
    this.showError = false;
    this.disableForm(true);

    const { positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.giveRequestedDraft({ token: this.token, positive, negative, comment }).subscribe(() => {
      this.showDraft = true;
      this.disableForm(false);
    });
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private navigateToSuccess() {
    const state: GiveFeedbackSuccess = {
      receiverEmail: this.request.receiverEmail,
      feedbackId: this.isAnonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['../../success'], { relativeTo: this.activatedRoute, state });
  }
}
