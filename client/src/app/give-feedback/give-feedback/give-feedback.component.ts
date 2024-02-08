import { Component, OnDestroy, TemplateRef, ViewChild, ViewEncapsulation, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/auth';
import { AutocompleteEmailComponent } from '../../shared/autocomplete-email';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { FeedbackDraft } from '../../shared/feedback/feedback.types';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../../shared/form/allowed-email-domains';
import { forbiddenValuesValidatorFactory } from '../../shared/form/forbidden-values';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message';
import { DialogTooltipDirective } from '../../shared/ui/dialog-tooltip/dialog-tooltip.directive';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveFeedbackDraftComponent } from './give-feedback-draft/give-feedback-draft.component';
import { GiveFeedbackDraftService } from './give-feedback-draft/give-feedback-draft.service';

@Component({
  selector: 'app-give-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,
    AutocompleteEmailComponent,
    ValidationErrorMessagePipe,
    DialogTooltipDirective,
    MessageComponent,
    GiveFeedbackDetailsComponent,
    GiveFeedbackDraftComponent,
  ],
  templateUrl: './give-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackComponent implements OnDestroy {
  @ViewChild('draftDialogTmpl') draftDialogTmpl!: TemplateRef<unknown>;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private matDialog = inject(MatDialog);

  private formBuilder = inject(NonNullableFormBuilder);

  private feedbackService = inject(FeedbackService);

  private giveFeedbackDraftService = inject(GiveFeedbackDraftService);

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  private forbiddenValuesValidator = forbiddenValuesValidatorFactory([inject(AuthService).userSnapshotEmail!]);

  protected hasManagerFeature = environment.featureFlipping.manager;

  form = this.formBuilder.group({
    receiverEmail: [
      this.getQueryParam('receiverEmail'),
      [Validators.required, Validators.email, this.allowedEmailDomainsValidator, this.forbiddenValuesValidator],
    ],
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    shared: [this.hasManagerFeature ? true : false],
  });

  submitInProgress = false;

  showError = false;

  errorType: null | 'error' | 'invalid_email' = null;

  showDraft = false;

  feedbackId?: string;

  hasDraft = this.giveFeedbackDraftService.hasDraft;

  private draftDialogRef?: MatDialogRef<unknown>;

  constructor() {
    this.giveFeedbackDraftService.applyDraft$.pipe(takeUntilDestroyed()).subscribe((draft: FeedbackDraft) => {
      this.form.setValue(draft);
      this.form.updateValueAndValidity();
      this.closeDraftDialog();
    });

    effect(() => {
      if (!this.giveFeedbackDraftService.hasDraft()) {
        this.closeDraftDialog();
      }
    });
  }

  ngOnDestroy(): void {
    this.closeDraftDialog();
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.showError = false;
    this.errorType = null;
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.give({ receiverEmail, positive, negative, comment, shared }).subscribe((result) => {
      if (result.id === undefined) {
        this.showError = true;
        this.errorType = result.message === 'invalid_email' ? 'invalid_email' : 'error';
        this.disableForm(false);
      } else {
        this.feedbackId = result.id;
        this.giveFeedbackDraftService.delete(receiverEmail).subscribe();
        this.navigateToSuccess();
      }
    });
  }

  protected onDraft() {
    this.showDraft = false;
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    this.giveFeedbackDraftService.give({ receiverEmail, positive, negative, comment, shared }).subscribe(() => {
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

  protected openDraftDialog() {
    this.draftDialogRef = this.matDialog.open(this.draftDialogTmpl, { width: '560px' });
    this.draftDialogRef.afterClosed().subscribe(() => (this.draftDialogRef = undefined));
  }

  protected closeDraftDialog() {
    this.draftDialogRef?.close();
  }
}
