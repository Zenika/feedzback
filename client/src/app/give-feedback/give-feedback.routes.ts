import { Routes } from '@angular/router';
import { GiveFeedbackSuccessComponent } from './give-feedback-success/give-feedback-success.component';
import { GiveFeedbackComponent } from './give-feedback.component';
import { giveFeedbackGuard } from './give-feedback.guard';

const giveFeedbackRoutes: Routes = [
  {
    path: '',
    component: GiveFeedbackComponent,
    canActivate: [giveFeedbackGuard],
    title: 'FeedZback - Donner',
  },
  {
    path: 'success',
    component: GiveFeedbackSuccessComponent,
    title: 'FeedZback - Envoi réussi',
  },
];

export default giveFeedbackRoutes;
