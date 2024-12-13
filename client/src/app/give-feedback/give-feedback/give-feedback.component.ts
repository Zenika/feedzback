import { Component, OnDestroy, TemplateRef, ViewEncapsulation, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { AuthService } from '../../shared/auth';
import { AutocompleteEmailComponent } from '../../shared/autocomplete-email';
import { BreakpointService } from '../../shared/breakpoint';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';
import { ConfirmBeforeSubmitDirective } from '../../shared/dialog/confirm-before-submit';
import { LeaveForm, LeaveFormService } from '../../shared/dialog/leave-form';
import { FeedbackService } from '../../shared/feedback';
import { IconDirective } from '../../shared/icon';

import { NotificationService } from '../../shared/notification';
import {
  ALLOWED_EMAIL_DOMAINS,
  allowedEmailDomainsValidatorFactory,
} from '../../shared/validation/allowed-email-domains';
import { forbiddenValuesValidatorFactory } from '../../shared/validation/forbidden-values';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveFeedbackDraftComponent } from './give-feedback-draft/give-feedback-draft.component';
import { GiveFeedbackDraftService } from './give-feedback-draft/give-feedback-draft.service';

@Component({
  selector: 'app-give-feedback',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    IconDirective,
    AutocompleteEmailComponent,
    ConfirmBeforeSubmitDirective,
    DialogTooltipDirective,
    GiveFeedbackDetailsComponent,
    GiveFeedbackDraftComponent,
  ],
  providers: [LeaveFormService],
  templateUrl: './give-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackComponent implements LeaveForm, OnDestroy {
  draftDialogTmpl = viewChild.required<TemplateRef<unknown>>('draftDialogTmpl');

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private matDialog = inject(MatDialog);

  private formBuilder = inject(NonNullableFormBuilder);

  private feedbackService = inject(FeedbackService);

  private giveFeedbackDraftService = inject(GiveFeedbackDraftService);

  private notificationService = inject(NotificationService);

  leaveFormService = inject(LeaveFormService);

  protected device = toSignal(inject(BreakpointService).device$);

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  private forbiddenValuesValidator = forbiddenValuesValidatorFactory([inject(AuthService).userEmail()]);

  private draftDialogRef?: MatDialogRef<unknown>;

  protected form = this.formBuilder.group({
    receiverEmail: [
      this.getQueryParam('receiverEmail'),
      [Validators.required, Validators.email, this.allowedEmailDomainsValidator, this.forbiddenValuesValidator],
    ],
    context: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    shared: [true],
  });

  protected submitInProgress = false;

  protected feedbackId?: string;

  protected hasDraft = this.giveFeedbackDraftService.hasDraft;

  constructor() {
    this.leaveFormService.registerForm(this.form);

    this.giveFeedbackDraftService.applyDraft$
      .pipe(
        takeUntilDestroyed(),
        switchMap((draft) => {
          this.closeDraftDialog();
          return this.leaveFormService.canLeave('applyFeedbackDraft').pipe(
            filter((canLeave) => canLeave),
            map(() => draft),
          );
        }),
      )
      .subscribe((draft) => {
        this.form.patchValue(draft);
        this.form.updateValueAndValidity();
        this.leaveFormService.takeSnapshot();
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

  protected openDraftDialog() {
    this.draftDialogRef = this.matDialog.open(this.draftDialogTmpl(), { width: '560px' });
    this.draftDialogRef.afterClosed().subscribe(() => (this.draftDialogRef = undefined));
  }

  protected closeDraftDialog() {
    this.draftDialogRef?.close();
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.disableForm(true);

    const { receiverEmail, context, positive, negative, comment, shared } = this.form.value as Required<
      typeof this.form.value
    >;

    this.feedbackService.give({ receiverEmail, context, positive, negative, comment, shared }).subscribe((result) => {
      if (result.id === undefined) {
        this.disableForm(false);
        if (result.message === 'invalid_email') {
          this.notificationService.show($localize`:@@Message.InvalidEmail:L'adresse email est invalide.`, 'danger');
        } else {
          this.notificationService.showError();
        }
      } else {
        this.feedbackId = result.id;
        this.giveFeedbackDraftService.delete(receiverEmail).subscribe();
        this.leaveFormService.unregisterForm();
        this.navigateToSuccess();
      }
    });
  }

  protected onDraft() {
    this.disableForm(true);

    const { receiverEmail, context, positive, negative, comment, shared } = this.form.value as Required<
      typeof this.form.value
    >;

    this.giveFeedbackDraftService.give({ receiverEmail, context, positive, negative, comment, shared }).subscribe({
      error: () => {
        this.disableForm(false);
        this.notificationService.showError();
      },
      complete: () => {
        this.disableForm(false);
        this.leaveFormService.takeSnapshot();
        this.notificationService.show($localize`:@@Message.DraftSaved:Brouillon sauvegardé.`, 'success');
      },
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
