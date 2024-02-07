import { Routes } from '@angular/router';
import { FeedbackDetailsTemporaryRedirectComponent } from './feedback-details-temporary-redirect/feedback-details-temporary-redirect.component';
import { feedbackDetailsResolver } from './feedback-details/feedback-details.resolver';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { managerGuard } from './manager/manager.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { settingsGuard } from './settings/setings.guard';
import { authGuard } from './shared/auth';
import { canDeactivateGuard } from './shared/can-deactivate/can-deactivate.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { signInGuard } from './sign-in/sign-in.guard';
import { GiveFeedbackComponent } from './give-feedback/give-feedback/give-feedback.component';

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
    title: 'FeedZback',
  },
  {
    path: 'request',
    loadChildren: () => import('./request-feedback/request-feedback.routes'),
  },
  {
    path: 'give',
    component : GiveFeedbackComponent,
    // loadChildren: () => import('./give-feedback/give-feedback.routes'),
    canDeactivate: [canDeactivateGuard],

  },
  {
    path: 'give-requested',
    loadChildren: () => import('./give-feedback/give-requested-feedback.routes'),
  },
  {
    path: 'history',
    pathMatch: 'full',
    redirectTo: '/history/type/received',
  },
  {
    path: 'history/type/:type',
    loadComponent: () => import('./history/history.component'),
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.History:Historique des feedZbacks`,
  },
  {
    // ---------------------
    // ----- TEMPORARY -----
    path: 'feedback/:id', // This is an OLD path (which is now replaced by `history/id/:id`)...
    component: FeedbackDetailsTemporaryRedirectComponent,
    // ----- TEMPORARY -----
    // ---------------------
  },
  {
    path: 'history/id/:id',
    loadComponent: () => import('./feedback-details/feedback-details.component'),
    canActivate: [authGuard],
    resolve: { feedbackDetails: feedbackDetailsResolver },
    title: 'FeedZback - FeedZback',
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component'),
    canActivate: [authGuard, settingsGuard],
    title: 'FeedZback - ' + $localize`:@@Title.Settings:Paramètres`,
  },
  {
    path: 'manager',
    loadComponent: () => import('./manager/manager.component'),
    canActivate: [authGuard, managerGuard],
    title: 'FeedZback - ' + $localize`:@@Action.Manager: Manager `,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [signInGuard],
    title: 'FeedZback - ' + $localize`:@@Title.SignIn:Connexion`,
  },
  {
    path: 'guide',
    component: GuideComponent,
    title: 'FeedZback - ' + $localize`:@@Title.Guide:Guide du feedZback`,
  },
  {
    path: 'demo',
    loadComponent: () => import('./demo-content/demo-content.component'),
    title: 'FeedZback - Demo content',
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    title: 'FeedZback - ' + $localize`:@@PageNotFound.Title:Page introuvable`,
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
