import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { RequestFeedbackSuccessComponent } from './request-feedback-success/request-feedback-success.component';
import { RequestFeedbackComponent } from './request-feedback.component';

const requestFeedbackRoutes: Routes = [
  {
    path: '',
    component: RequestFeedbackComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Demander',
  },
  {
    path: 'success',
    component: RequestFeedbackSuccessComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Confirmation',
  },
];

export default requestFeedbackRoutes;
