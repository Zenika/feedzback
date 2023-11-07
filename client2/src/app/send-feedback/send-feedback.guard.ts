import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { environment } from '../../environments/environment';
import { authGuard } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';

export const sendFeedbackGuard: CanActivateFn = (route, state) => {
  if (
    (environment.signInAsGuest && route.queryParamMap.has('guest')) ||
    // TODO: use a hash stored in database to allow anonymous sign-in...
    route.queryParamMap.has('senderEmail') ||
    route.queryParamMap.has('senderName')
  ) {
    return inject(AuthService).signInAnonymously();
  }

  return authGuard(route, state);
};
