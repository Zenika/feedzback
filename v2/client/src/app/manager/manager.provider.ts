import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { ManagerService } from './manager.service';

export const provideManager = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService, managerService: ManagerService) => (): Promise<unknown> => {
    return firstValueFrom(
      authService.isKnownUser$.pipe(
        switchMap((isKnownUser) => {
          if (!isKnownUser) {
            return of(null);
          }
          return managerService.init();
        }),
      ),
    );
  },
  deps: [AuthService, ManagerService],
  multi: true,
});
