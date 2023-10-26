import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './shared/auth/auth.guard';
import { SignInComponent } from './sign-in/sign-in.component';
import { signInGuard } from './sign-in/sign-in.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [signInGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
