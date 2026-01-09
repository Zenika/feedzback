import { Routes } from '@angular/router';
import { PreRequestFeedbackSuccessComponent } from './pre-request-feedback-success/pre-request-feedback-success.component';
import { PreRequestFeedbackComponent } from './pre-request-feedback.component';
import { preRequestFeedbackResolver } from './pre-request-feedback.resolver';

const preRequestFeedbackRoutes: Routes = [
  {
    path: 'token/:token',
    component: PreRequestFeedbackComponent,
    resolve: { summary: preRequestFeedbackResolver },
    title: 'FeedZback - ' + $localize`:@@Title.GiveRequestedFeedback: Répondre à la demande de feedZback `,
  },
  {
    path: 'success',
    component: PreRequestFeedbackSuccessComponent,
    title: 'FeedZback - ' + $localize`:@@Title.Confirmation:Confirmation`,
  },
];

export default preRequestFeedbackRoutes;
