import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from './employee.service';

export const provideEmployee = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService, employeeService: EmployeeService) => (): Promise<unknown> => {
    return firstValueFrom(
      authService.isKnownUser$.pipe(
        switchMap((isKnownUser) => {
          if (!isKnownUser) {
            return of(undefined);
          }
          return employeeService.fetchData();
        }),
      ),
    );
  },
  deps: [AuthService, EmployeeService],
  multi: true,
});
