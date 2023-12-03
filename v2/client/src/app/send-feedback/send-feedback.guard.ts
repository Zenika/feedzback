import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, combineLatest, first, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../shared/api/api.service';
import { authFactory } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';
import { SendFeedbackService } from './send-feedback.service';

export const sendFeedbackGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const apiService = inject(ApiService);
  const sendFeedbackService = inject(SendFeedbackService);
  const router = inject(Router);

  sendFeedbackService.init();

  return combineLatest([authService.isKnownUser$, authService.isAnonymous$]).pipe(
    first(),
    switchMap(([isKnownUser, isAnonymous]) => {
      // !DEPRECATED
      // if (environment.signInAsGuest && route.queryParamMap.has('guest')) {
      //  return authService.signInAnonymously();
      // }

      const { receiverEmail, recipientToken } = route.queryParams;
      if (receiverEmail && recipientToken) {
        return apiService.checkAskedFeedback({ receiverEmail, recipientToken }).pipe(
          tap((askedFeedback) => {
            console.log(askedFeedback);
            if (askedFeedback?.recipient) {
              sendFeedbackService.set({ senderEmail: askedFeedback.recipient, receiverEmail, recipientToken });
            }
          }),
          switchMap((askedFeedback) => {
            if (!askedFeedback) {
              // TODO: find a way to go somewhere and display something like: "Sorry, bad information given..."
              return of(false);
            }
            if (isKnownUser || isAnonymous) {
              return of(true);
            }
            return authService.signInAnonymously();
          }),
        );
      }

      if (isKnownUser) {
        return of(true);
      }
      return authFactory(authService, router, state.url);
    }),
  );
};
