import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { EmployeeService } from '../shared/employee';

// Make sure the `EmployeeService` is ready for use before creating the routed component.
export const settingsGuard: CanActivateFn = () => inject(EmployeeService).data$.pipe(map(() => true));
