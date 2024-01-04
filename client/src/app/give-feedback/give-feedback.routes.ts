import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { GiveFeedbackSuccessComponent } from './give-feedback-success/give-feedback-success.component';
import { GiveFeedbackComponent } from './give-feedback/give-feedback.component';
import { GiveRequestedFeedbackComponent } from './give-requested-feedback/give-requested-feedback.component';
import { giveRequestedFeedbackGuard } from './give-requested-feedback/give-requested-feedback.guard';

const giveFeedbackRoutes: Routes = [
  {
    path: '',
    component: GiveFeedbackComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Donner',
  },
  {
    path: 'requested/:token',
    component: GiveRequestedFeedbackComponent,
    canActivate: [giveRequestedFeedbackGuard],
    title: 'FeedZback - Donner',
  },
  {
    path: 'success',
    component: GiveFeedbackSuccessComponent,
    title: 'FeedZback - Confirmation',
  },
];

export default giveFeedbackRoutes;
