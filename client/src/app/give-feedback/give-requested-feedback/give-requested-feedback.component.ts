import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, ViewEncapsulation, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../shared/auth';
import { ConfirmBeforeSubmitDirective } from '../../shared/confirm-before-submit';
import { DialogComponent, DialogData } from '../../shared/dialog';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';
import { FeedbackService, FeedbackTypeIconPipe } from '../../shared/feedback';
import { FeedbackRequest, FeedbackRequestDraft } from '../../shared/feedback/feedback.types';
import { MessageComponent } from '../../shared/message';
import { NotificationService } from '../../shared/notification';
import { UnsavedFormGuard, UnsavedFormService } from '../../shared/unsaved-form';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveRequestedFeedbackListService } from '../give-requested-feedback-list/give-requested-feedback-list.service';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveRequestedFeedbackData } from './give-requested-feedback.types';

@Component({
  selector: 'app-give-requested-feedback',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    ConfirmBeforeSubmitDirective,
    FeedbackTypeIconPipe,
    DialogTooltipDirective,
    MessageComponent,
    GiveFeedbackDetailsComponent,
  ],
  providers: [UnsavedFormService],
  templateUrl: './give-requested-feedback.component.html',
  styleUrl: './give-requested-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackComponent implements GiveRequestedFeedbackData, UnsavedFormGuard {
  token = input.required<string>();

  request = input.required<FeedbackRequest>();

  draft = input<Pick<FeedbackRequestDraft, 'context' | 'positive' | 'negative' | 'comment'>>();

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private matDialog = inject(MatDialog);

  private formBuilder = inject(NonNullableFormBuilder);

  protected anonymous = inject(AuthService).userStatus().anonymous;

  private feedbackService = inject(FeedbackService);

  private giveRequestedFeedbackListService = inject(GiveRequestedFeedbackListService);

  private notificationService = inject(NotificationService);

  unsavedFormService = inject(UnsavedFormService);

  form = this.formBuilder.group({
    context: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
  });

  submitInProgress = false;

  feedbackId?: string;

  constructor() {
    this.unsavedFormService.register({
      form: this.form,
      storageKey: 'giveRequestedFeedback',
      saveWhenLeaving: true,
    });

    const effectRef = effect(
      () => {
        const draft = this.draft();

        if (!draft) {
          this.unsavedFormService.restoreFromLocalStorage(); // restore from local storage if any...
        } else {
          const applyDraft = () => {
            this.form.patchValue(draft);
            this.form.updateValueAndValidity();
            this.unsavedFormService.markAsPristine();
          };

          if (this.unsavedFormService.hasLocalStorage()) {
            const data: DialogData = {
              title: $localize`:@@Component.GiveRequestedFeedback.RestoreTitle:Restaurer ?`,
              content: $localize`:@@Component.GiveRequestedFeedback.RestoreContent:Nous avons trouvé des modifications non sauvegardées dans votre stockage local.`,
              cancel: { label: $localize`:@@Action.Discard:Abandonner` },
              confirm: { label: $localize`:@@Action.Restore:Restaurer`, icon: 'restore_page' },
            };

            this.matDialog
              .open(DialogComponent, {
                data,
                width: '480px',

                // WARNING: using the default `BlockScrollStrategy` crashes the entire UI!
                //  - more infos: https://github.com/angular/components/issues/28066#issuecomment-2188088705
                scrollStrategy: new NoopScrollStrategy(),
              })
              .afterClosed()
              .pipe(map((useStorage?: boolean) => (useStorage === undefined ? false : useStorage)))
              .subscribe((useStorage) => {
                if (useStorage) {
                  this.unsavedFormService.restoreFromLocalStorage();
                } else {
                  applyDraft();
                }
              });
          } else {
            applyDraft();
          }
        }

        effectRef.destroy();
      },
      { manualCleanup: true },
    );
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.disableForm(true);

    const { context, positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService
      .giveRequested({ token: this.token(), context, positive, negative, comment })
      .subscribe((success) => {
        if (!success) {
          this.disableForm(false);
          this.notificationService.showError();
        } else {
          this.giveRequestedFeedbackListService.refresh();
          this.feedbackId = this.anonymous ? undefined : this.request()?.id;
          this.navigateToSuccess();
        }
      });
  }

  protected onDraft() {
    this.disableForm(true);

    const { context, positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.giveRequestedDraft({ token: this.token(), context, positive, negative, comment }).subscribe({
      error: () => this.notificationService.showError(),
      complete: () => {
        this.disableForm(false);
        this.unsavedFormService.markAsPristine();
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
      receiverEmail: this.request().receiverEmail,
      feedbackId: this.anonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['../../success'], { relativeTo: this.activatedRoute, state });
  }
}
