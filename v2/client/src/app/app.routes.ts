import { Routes } from '@angular/router';
import { AskFeedbackSuccessComponent } from './ask-feedback/ask-feedback-success/ask-feedback-success.component';
import { AskFeedbackComponent } from './ask-feedback/ask-feedback.component';
import { DemoContentComponent } from './demo-content/demo-content.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { FeedbackDialogComponent } from './my-feedbacks/feedback-dialog/feedback-dialog.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SendFeedbackSuccessComponent } from './send-feedback/send-feedback-success/send-feedback-success.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
import { sendFeedbackGuard } from './send-feedback/send-feedback.guard';
import { authGuard } from './shared/auth/auth.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { signInGuard } from './sign-in/sign-in.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ask',
    component: AskFeedbackComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Demander',
  },
  {
    path: 'ask/success',
    component: AskFeedbackSuccessComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Demande réussie',
  },
  {
    path: 'send',
    component: SendFeedbackComponent,
    canActivate: [sendFeedbackGuard],
    title: 'FeedZback - Donner',
  },
  {
    path: 'send/success',
    component: SendFeedbackSuccessComponent,
    title: 'FeedZback - Envoi réussi',
  },
  {
    path: 'feedbacks',
    pathMatch: 'full',
    redirectTo: '/feedbacks/received',
  },
  {
    path: 'feedbacks/:type',
    loadComponent: () => import('./my-feedbacks/my-feedbacks.component'),
    canActivate: [authGuard],
    title: 'FeedZback - Mes feedZbacks',
    children: [
      {
        path: ':id',
        component: FeedbackDialogComponent,
        title: 'FeedZback - Détails',
      },
    ],
  },
  {
    path: 'feedback/:type/:id',
    component: FeedbackDetailsComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Détails',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [signInGuard],
    title: 'FeedZback - Se connecter',
  },
  {
    path: 'guide',
    component: GuideComponent,
    title: 'FeedZback - Guide',
  },
  {
    path: 'demo',
    component: DemoContentComponent,
    title: 'FeedZback - Demo content',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'FeeddZback - Page introuvable',
  },
];
