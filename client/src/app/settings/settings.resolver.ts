import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { EmployeeData, EmployeeService } from '../shared/employee';

export const settingsResolver: ResolveFn<EmployeeData> = () => {
  const router = inject(Router);

  return inject(EmployeeService).data$.pipe(
    map((data) => {
      if (data === null) {
        return new RedirectCommand(router.parseUrl('/'));
      }
      return data;
    }),
  );
};
