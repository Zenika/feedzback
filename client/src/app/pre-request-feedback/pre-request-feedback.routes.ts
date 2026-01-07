import { Routes } from '@angular/router';
import { PreRequestFeedbackSuccessComponent } from './pre-request-feedback-success/pre-request-feedback-success.component';
import { PreRequestFeedbackComponent } from './pre-request-feedback.component';
import { preRequestFeedbackResolver } from './pre-request-feedback.resolver';

const preRequestFeedbackRoutes: Routes = [
  {
    path: 'token/:token',
    component: PreRequestFeedbackComponent,
    resolve: { summary: preRequestFeedbackResolver },
  },
  {
    path: 'success',
    component: PreRequestFeedbackSuccessComponent,
  },
];

export default preRequestFeedbackRoutes;
