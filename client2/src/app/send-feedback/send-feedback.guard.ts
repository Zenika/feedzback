import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, first, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { authFactory } from '../shared/auth/auth.guard';
import { AuthService } from '../shared/auth/auth.service';

export const sendFeedbackGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAnonymous$.pipe(
    first(),
    switchMap((isAnonymous) => {
      if (isAnonymous) {
        return of(true);
      }
      if (
        (environment.signInAsGuest && route.queryParamMap.has('guest')) ||
        // TODO: use a hash stored in database to allow anonymous sign-in...
        route.queryParamMap.has('senderEmail')
      ) {
        return authService.signInAnonymously();
      }
      return authFactory(authService, router, state.url);
    }),
  );
};
