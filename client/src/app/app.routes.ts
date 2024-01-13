import { Routes } from '@angular/router';
import { feedbackDetailsResolver } from './feedback-details/feedback-details.resolver';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { managerGuard } from './manager/manager.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { settingsGuard } from './settings/setings.guard';
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
    path: 'feedbacks',
    pathMatch: 'full',
    redirectTo: '/feedbacks/received',
  },
  {
    path: 'feedbacks/:type',
    loadComponent: () => import('./my-feedbacks/my-feedbacks.component'),
    canActivate: [authGuard],
    title: 'FeedZback - ' + $localize`:@@Title.MyFeedbacks:Mes feedZbacks`,
  },
  {
    path: 'feedback/:id',
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
