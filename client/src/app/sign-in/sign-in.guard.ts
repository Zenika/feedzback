import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '../shared/auth';

export const signInGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).authenticated$.pipe(
    tap((authenticated) => {
      if (authenticated) {
        router.navigate(['/home']);
      }
    }),
    map((authenticated) => !authenticated),
  );
};
