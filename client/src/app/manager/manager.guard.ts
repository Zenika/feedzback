import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { EmployeeService, isManager } from '../shared/employee';

export const managerGuard: CanActivateFn = () => inject(EmployeeService).data$.pipe(map(isManager));
