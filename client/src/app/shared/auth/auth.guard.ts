import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_REDIRECT_PARAM } from './auth.config';
import { AuthService } from './auth.service';

export const authFactory = (authService: AuthService, router: Router, redirectAfterSignIn: string) => {
  return authService.isKnownUser$.pipe(
    tap((isKnownUser) => {
      if (isKnownUser) {
        return;
      }
      router.navigate(['/sign-in'], { queryParams: { [AUTH_REDIRECT_PARAM]: redirectAfterSignIn } });
    }),
  );
};

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authFactory(authService, router, state.url);
};
