import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';

export const signInGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).isLogged$.pipe(
    tap((isLogged) => {
      if (isLogged) {
        router.navigate(['/home']);
      }
    }),
    map((isLogged) => !isLogged),
  );
};
