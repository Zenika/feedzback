import { Component, HostBinding, OnDestroy, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AutocompleteEmailComponent } from '../../shared/autocomplete-email';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { FeedbackSpontaneousDraft } from '../../shared/feedback/feedback.types';
import { ALLOWED_EMAIL_DOMAINS, allowedEmailDomainsValidatorFactory } from '../../shared/form/allowed-email-domains';
import { ValidationErrorMessagePipe } from '../../shared/form/validation-error-message';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { FeedbackDraftComponent } from './feedback-draft/feedback-draft.component';
import { FeedbackDraftService } from './feedback-draft/feedback-draft.service';

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
    MessageComponent,
    GiveFeedbackDetailsComponent,
    FeedbackDraftComponent,
  ],
  templateUrl: './give-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackComponent implements OnDestroy {
  @HostBinding('class.app-give-feedback') hasCss = true;

  @ViewChild('draftDialogTmpl') draftDialogTmpl!: TemplateRef<unknown>;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private matDialog = inject(MatDialog);

  private formBuilder = inject(NonNullableFormBuilder);

  private feedbackService = inject(FeedbackService);

  private feedbackDraftService = inject(FeedbackDraftService);

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

  hasDraftDialog = toSignal(
    this.feedbackDraftService.draftListMap$.pipe(
      map(({ spontaneous, requested }) => spontaneous.length > 0 || requested.length > 0),
      tap((hasDraftDialog) => hasDraftDialog || this.closeDraftDialog()),
    ),
    {
      initialValue: false,
    },
  );

  private draftDialogRef?: MatDialogRef<unknown>;

  constructor() {
    this.feedbackDraftService.applyDraft$.pipe(takeUntilDestroyed()).subscribe((draft: FeedbackSpontaneousDraft) => {
      this.form.setValue(draft);
      this.form.updateValueAndValidity();
      this.closeDraftDialog();
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
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.give({ receiverEmail, positive, negative, comment, shared }).subscribe(({ id }) => {
      this.showError = !id;
      if (!id) {
        this.disableForm(false);
      } else {
        this.feedbackId = id;
        this.feedbackDraftService.delete(receiverEmail).subscribe();
        this.navigateToSuccess();
      }
    });
  }

  protected onDraft() {
    this.showDraft = false;
    this.disableForm(true);

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    this.feedbackDraftService.save({ receiverEmail, positive, negative, comment, shared }).subscribe(() => {
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
