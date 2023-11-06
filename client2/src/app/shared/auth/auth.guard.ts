import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AUTH_REDIRECT_PARAM } from './auth.config';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isKnownUser$.pipe(
    tap((isKnownUser) => {
      if (isKnownUser) {
        return;
      }
      router.navigate(['/sign-in'], { queryParams: { [AUTH_REDIRECT_PARAM]: state.url } });
    }),
  );
};
