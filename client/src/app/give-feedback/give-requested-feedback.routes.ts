import { Routes } from '@angular/router';
import { GiveFeedbackSuccessComponent } from './give-feedback-success/give-feedback-success.component';
import { GiveRequestedFeedbackComponent } from './give-requested-feedback/give-requested-feedback.component';
import { giveRequestedFeedbackGuard } from './give-requested-feedback/give-requested-feedback.guard';

const giveRequestedFeedbackRoutes: Routes = [
  {
    path: 'token/:token',
    component: GiveRequestedFeedbackComponent,
    canActivate: [giveRequestedFeedbackGuard],
    title: 'FeedZback - ' + $localize`:@@Title.GiveRequestedFeedback: Répondre à la demande de feeZback `,
  },
  {
    path: 'success',
    component: GiveFeedbackSuccessComponent,
    title: 'FeedZback - ' + $localize`:@@Title.Confirmation:Confirmation`,
  },
];

export default giveRequestedFeedbackRoutes;
