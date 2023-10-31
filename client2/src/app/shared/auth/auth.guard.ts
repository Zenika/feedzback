import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AUTH_REDIRECT_PARAM } from './auth.config';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasSenderEmail = () => route.queryParamMap.get('senderEmail') !== null;

  // !FIXME: use case not clear
  const isNotSendOrResult = () => {
    const urlResult = state.url.split(';')[0]; // !FIXME: not clear why slit ";"
    return authService.isAnonymousSnapshot() && urlResult !== '/send' && urlResult !== '/result';
  };

  if (hasSenderEmail()) {
    // !FIXME: Does not seems to work... We get the following error:
    // !FIXME: FirebaseError: Firebase: This operation is restricted to administrators only. (auth/admin-restricted-operation).
    return authService.signInAnonymously();
  }

  if (isNotSendOrResult()) {
    return authService.signOut().pipe(map(() => false));
  }

  return authService.isLogged$.pipe(
    tap((isLogged) => {
      if (isLogged) {
        return;
      }
      router.navigate(['/sign-in'], { queryParams: { [AUTH_REDIRECT_PARAM]: state.url } });
    }),
  );
};
