import { Component, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../shared/form/allowed-email-domains';
import { ValidationErrorMessagePipe } from '../shared/form/validation-error-message';
import { MessageComponent } from '../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from './give-feedback-success/give-feedback-success.types';
import { GiveFeedbackData, RequestWithToken } from './give-feedback.types';

@Component({
  selector: 'app-give-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ValidationErrorMessagePipe,
    MessageComponent,
  ],
  templateUrl: './give-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackComponent implements GiveFeedbackData, OnInit {
  @HostBinding('class.app-give-feedback') hasCss = true;

  @Input() requestWithToken?: RequestWithToken;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  protected isAnonymous = inject(AuthService).userSnapshot?.isAnonymous;

  private feedbackService = inject(FeedbackService);

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  protected feedbackMaxLength = 2000;

  protected commentMaxLength = 500;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  form = this.formBuilder.group({
    receiverEmail: [
      this.getQueryParam('receiverEmail'),
      [Validators.required, Validators.email, this.allowedEmailDomainsValidator],
    ],
    positive: ['', [Validators.required, Validators.maxLength(this.feedbackMaxLength)]],
    negative: ['', [Validators.required, Validators.maxLength(this.feedbackMaxLength)]],
    comment: ['', [Validators.maxLength(this.commentMaxLength)]],
    // shared: [true], // <!-- FEATURE TOGGLE::MANAGER -->
    shared: [false],
  });

  submitInProgress = false;

  hasError = false;

  feedbackId?: string;

  ngOnInit(): void {
    if (this.requestWithToken) {
      this.form.controls.receiverEmail.setValue(this.requestWithToken.receiverEmail);
      this.form.controls.shared.setValue(this.requestWithToken.shared);
      this.form.updateValueAndValidity();
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.hasError = false;
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    if (this.requestWithToken?.token) {
      this.feedbackService
        .giveRequested({ token: this.requestWithToken.token, positive, negative, comment })
        .subscribe((success) => {
          if (!success) {
            this.hasError = true;
            this.disableForm(false);
          } else {
            this.feedbackId = this.isAnonymous ? undefined : this.requestWithToken?.id;
            this.navigateToSuccess();
          }
        });
    } else {
      this.feedbackService.give({ receiverEmail, positive, negative, comment, shared }).subscribe(({ id }) => {
        this.hasError = !id;
        if (!id) {
          this.disableForm(false);
        } else {
          this.feedbackId = id;
          this.navigateToSuccess();
        }
      });
    }
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private navigateToSuccess() {
    const state: GiveFeedbackSuccess = {
      receiverEmail: this.form.value.receiverEmail as string,
      feedbackId: this.isAnonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }
}
