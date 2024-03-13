import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { EmployeeService } from '../shared/employee/employee.service';
import { isManager } from '../shared/employee/employee.utils';

export const managerGuard: CanActivateFn = () => inject(EmployeeService).data$.pipe(map(isManager));
