import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export const provideAuth = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => (): Promise<unknown> => {
    return firstValueFrom(authService.isSignedIn$);
  },
  deps: [AuthService],
  multi: true,
});
