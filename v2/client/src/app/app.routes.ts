import { Routes } from '@angular/router';
import { DemoContentComponent } from './demo-content/demo-content.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { GiveFeedbackSuccessComponent } from './give-feedback/give-feedback-success/give-feedback-success.component';
import { GiveFeedbackComponent } from './give-feedback/give-feedback.component';
import { giveFeedbackGuard } from './give-feedback/give-feedback.guard';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { managerGuard } from './manager/manager.guard';
import { FeedbackDialogComponent } from './my-feedbacks/feedback-dialog/feedback-dialog.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RequestFeedbackSuccessComponent } from './request-feedback/request-feedback-success/request-feedback-success.component';
import { RequestFeedbackComponent } from './request-feedback/request-feedback.component';
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
    path: 'request',
    component: RequestFeedbackComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Demander',
  },
  {
    path: 'request/success',
    component: RequestFeedbackSuccessComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Demande réussie',
  },
  {
    path: 'give',
    component: GiveFeedbackComponent,
    canActivate: [giveFeedbackGuard],
    title: 'FeedZback - Donner',
  },
  {
    path: 'give/success',
    component: GiveFeedbackSuccessComponent,
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
    path: 'manager',
    loadComponent: () => import('./manager/manager.component'),
    canActivate: [authGuard, managerGuard],
    title: 'FeedZback - Manager',
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
    path: 'not-found',
    component: NotFoundComponent,
    title: 'FeeddZback - Page introuvable',
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
