import { Routes } from '@angular/router';
import { PreRequestFeedbackEmailSuccessComponent } from './pre-request-feedback-email-success/pre-request-feedback-email-success.component';
import { PreRequestFeedbackEmailComponent } from './pre-request-feedback-email.component';
import { preRequestFeedbackEmailResolver } from './pre-request-feedback-email.resolver';

const preRequestFeedbackEmailRoutes: Routes = [
  {
    path: 'token/:token',
    component: PreRequestFeedbackEmailComponent,
    resolve: { summary: preRequestFeedbackEmailResolver },
  },
  {
    path: 'success',
    component: PreRequestFeedbackEmailSuccessComponent,
  },
];

export default preRequestFeedbackEmailRoutes;
