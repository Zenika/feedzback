import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { EmployeeService } from '../shared/employee/employee.service';

export const managerGuard: CanActivateFn = () => {
  const employeeService = inject(EmployeeService);
  return employeeService.data$.pipe(map(() => employeeService.isManager()));
};
