import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { PreRequestFeedbackTokenComponent } from './pre-request-feedback-token.component';
import { PreRequestFeedbackTokenSuccessComponent } from './pre-request-success/pre-request-success.component';

const preRequestFeedbackTokenRoutes: Routes = [
  {
    path: '',
    component: PreRequestFeedbackTokenComponent,
    canActivate: [authGuard],
  },
  {
    path: 'success',
    component: PreRequestFeedbackTokenSuccessComponent,
    canActivate: [authGuard],
  },
];

export default preRequestFeedbackTokenRoutes;
