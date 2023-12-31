import { AsyncPipe } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FeedbackDraftData } from '../../shared/feedback/feedback.types';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../../shared/form/allowed-email-domains';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveFeedbackService } from './give-feedback.service';

@Component({
  selector: 'app-give-feedback',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ValidationErrorMessagePipe,
    MessageComponent,
    GiveFeedbackDetailsComponent,
  ],
  templateUrl: './give-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackComponent {
  @HostBinding('class.app-give-feedback') hasCss = true;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  private giveFeedbackService = inject(GiveFeedbackService);

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  protected hasManagerFeature = environment.featureFlipping.manager;

  form = this.formBuilder.group({
    receiverEmail: [
      this.getQueryParam('receiverEmail'),
      [Validators.required, Validators.email, this.allowedEmailDomainsValidator],
    ],
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    shared: [this.hasManagerFeature ? true : false],
  });

  submitInProgress = false;

  showError = false;

  showDraft = false;

  feedbackId?: string;

  filteredDraftDataList$ = this.giveFeedbackService.filteredDraftDataList$;

  constructor() {
    this.form.controls.receiverEmail.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (receiverEmail) => this.giveFeedbackService.receiverEmail$.next(receiverEmail),
      complete: () => this.giveFeedbackService.receiverEmail$.next(''),
    });
  }

  protected applyDraft(draftData?: FeedbackDraftData) {
    this.form.setValue(draftData ?? { receiverEmail: '', positive: '', negative: '', comment: '', shared: true });
    this.form.updateValueAndValidity();
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.showError = false;
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    this.giveFeedbackService.give({ receiverEmail, positive, negative, comment, shared }).subscribe(({ id }) => {
      this.showError = !id;
      if (!id) {
        this.disableForm(false);
      } else {
        this.feedbackId = id;
        this.navigateToSuccess();
      }
    });
  }

  protected onDraft() {
    this.showError = false;
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    this.giveFeedbackService.giveDraft({ receiverEmail, positive, negative, comment, shared }).subscribe(() => {
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
      receiverEmail: this.form.value.receiverEmail as string,
      feedbackId: this.feedbackId,
    };
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }
}
