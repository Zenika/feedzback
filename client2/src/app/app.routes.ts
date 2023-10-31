import { Routes } from '@angular/router';
import { AskFeedbackComponent } from './ask-feedback/ask-feedback.component';
import { HomeComponent } from './home/home.component';
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
  },
  {
    path: 'send',
    component: SendFeedbackComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [signInGuard],
  },
  /*{
    path: '**',
    redirectTo: '/home',
  },*/
];
