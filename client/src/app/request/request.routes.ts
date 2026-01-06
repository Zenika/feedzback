import { Routes } from '@angular/router';
import { authGuard } from '../shared/auth';
import { PreRequestFeedbackTokenSuccessComponent } from './pre-request-feedback-token-success/pre-request-feedback-token-success.component';
import { RequestFeedbackSuccessComponent } from './request-feedback-success/request-feedback-success.component';
import { RequestComponent } from './request.component';

const requestRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/request/send',
  },
  {
    path: ':method',
    component: RequestComponent,
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.RequestFeedback:Demander du feedZback`,
  },
  {
    path: 'send/success',
    component: RequestFeedbackSuccessComponent,
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.Confirmation:Confirmation`,
  },
  {
    path: 'generate/success',
    component: PreRequestFeedbackTokenSuccessComponent,
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.Confirmation:Confirmation`,
  },
];

export default requestRoutes;
