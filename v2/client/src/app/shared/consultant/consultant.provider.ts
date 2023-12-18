import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ConsultantService } from './consultant.service';

export const provideConsultant = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService, consultantService: ConsultantService) => (): Promise<unknown> => {
    return firstValueFrom(
      authService.isKnownUser$.pipe(
        switchMap((isKnownUser) => {
          if (!isKnownUser) {
            return of(undefined);
          }
          return consultantService.fetchData();
        }),
      ),
    );
  },
  deps: [AuthService, ConsultantService],
  multi: true,
});
