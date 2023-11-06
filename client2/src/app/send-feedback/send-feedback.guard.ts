import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { authGuard } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';

export const sendFeedbackGuard: CanActivateFn = (route, state) => {
  if (
    route.queryParamMap.has('guest') ||
    route.queryParamMap.has('senderEmail') ||
    route.queryParamMap.has('senderName')
  ) {
    return inject(AuthService).signInAnonymously();
  }

  return authGuard(route, state);
};
