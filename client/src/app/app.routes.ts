import { Routes } from '@angular/router';
import { feedbackDetailsResolver } from './feedback-details/feedback-details.resolver';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { managerGuard } from './manager/manager.guard';
import { NotFoundComponent } from './not-found/not-found.component';
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
    loadChildren: () => import('./request-feedback/request-feedback.routes'),
  },
  {
    path: 'give',
    loadChildren: () => import('./give-feedback/give-feedback.routes'),
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
    title: 'FeedZback - FeedZbacks',
  },
  {
    path: 'feedback/:id',
    loadComponent: () => import('./feedback-details/feedback-details.component'),
    canActivate: [authGuard],
    resolve: { feedbackDetails: feedbackDetailsResolver },
    title: 'FeedZback - Vue détaillée',
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./settings/settings.component'),
    title: 'FeedZback - Paramètres',
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
    loadComponent: () => import('./demo-content/demo-content.component'),
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
