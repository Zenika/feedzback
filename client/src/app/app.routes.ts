import { Routes } from '@angular/router';
import { feedbackDetailsResolver } from './feedback-details/feedback-details.resolver';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { managerGuard } from './manager/manager.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { settingsGuard } from './settings/settings.guard';
import { authGuard } from './shared/auth';
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
    title: 'FeedZback',
  },
  {
    path: 'request',
    loadChildren: () => import('./request-feedback/request-feedback.routes'),
  },
  {
    path: 'give',
    loadChildren: () => import('./give-feedback/give-feedback.routes'),
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
    title: 'FeedZback - ' + $localize`:@@Title.History:Historique de mes feedZbacks`,
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
    loadChildren: () => import('./manager/manager.routes'),
    canActivate: [authGuard, managerGuard],
    title: 'FeedZback - ' + $localize`:@@Action.Manager: Manager `,
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [signInGuard],
    title: 'FeedZback - ' + $localize`:@@Title.SignIn:Se connecter`,
  },
  {
    path: 'guide',
    component: GuideComponent,
    title: 'FeedZback - ' + $localize`:@@Title.Guide:Guide du feedZback`,
  },
  {
    path: 'stats',
    loadChildren: () => import('./stats/stats.routes'),
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.routes'),
    title: 'FeedZback - Demo',
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
