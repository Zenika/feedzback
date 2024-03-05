import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { leaveFormGuardFactory } from '../shared/dialogs/leave-form';
import { GiveFeedbackSuccessComponent } from './give-feedback-success/give-feedback-success.component';
import { GiveRequestedFeedbackListComponent } from './give-requested-feedback-list/give-requested-feedback-list.component';
import { GiveRequestedFeedbackComponent } from './give-requested-feedback/give-requested-feedback.component';
import { giveRequestedFeedbackGuard } from './give-requested-feedback/give-requested-feedback.guard';

const giveRequestedFeedbackRoutes: Routes = [
  {
    path: '',
    component: GiveRequestedFeedbackListComponent,
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.RequestedFeedbackList: Répondre aux demandes de feedZback `,
  },
  {
    path: 'token/:token',
    component: GiveRequestedFeedbackComponent,
    canActivate: [giveRequestedFeedbackGuard],
    canDeactivate: [leaveFormGuardFactory('quitFeedback')],
    title: 'FeedZback - ' + $localize`:@@Title.GiveRequestedFeedback: Répondre à une demande de feedZback `,
  },
  {
    path: 'success',
    component: GiveFeedbackSuccessComponent,
    title: 'FeedZback - ' + $localize`:@@Title.Confirmation:Confirmation`,
  },
];

export default giveRequestedFeedbackRoutes;
