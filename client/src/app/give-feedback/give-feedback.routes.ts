import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { canDeactivateGuard } from '../shared/can-deactivate/can-deactivate.guard';
import { GiveFeedbackSuccessComponent } from './give-feedback-success/give-feedback-success.component';
import { GiveFeedbackComponent } from './give-feedback/give-feedback.component';

const giveFeedbackRoutes: Routes = [
  {
    path: '',
    component: GiveFeedbackComponent,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
    title: 'FeedZback - ' + $localize`:@@Feedback.Give: Donner `,
  },
  {
    path: 'success',
    component: GiveFeedbackSuccessComponent,
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.Confirmation:Confirmation`,
  },
];

export default giveFeedbackRoutes;
