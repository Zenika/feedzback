import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_REDIRECT_PARAM } from './auth.config';
import { AuthService } from './auth.service';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isKnownUser$.pipe(
    tap((isKnownUser) => {
      if (isKnownUser) {
        return;
      }
      const redirectUrlAfterSignIn = state.url;
      router.navigate(['/sign-in'], { queryParams: { [AUTH_REDIRECT_PARAM]: redirectUrlAfterSignIn } });
    }),
  );
};
