import { Routes } from '@angular/router';
import { AskFeedbackComponent } from './ask-feedback/ask-feedback.component';
import { DemoContentComponent } from './demo-content/demo-content.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { GuideComponent } from './guide/guide.component';
import { HomeComponent } from './home/home.component';
import { MyFeedbacksComponent } from './my-feedbacks/my-feedbacks.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SendFeedbackComponent } from './send-feedback/send-feedback.component';
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
    path: 'send',
    component: SendFeedbackComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Envoyer',
  },
  {
    path: 'feedbacks',
    component: MyFeedbacksComponent,
    canActivate: [authGuard],
    title: 'FeedZback - Mes feedZbacks',
  },
  {
    path: 'feedback/:id/:type', // !FIXME: should be 'feedbacks/:id/:type'
    component: FeedbackDetailsComponent,
    canActivate: [authGuard],
    title: 'FeedZback - FeedZback détaillé',
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
