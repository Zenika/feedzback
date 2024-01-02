import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { EmployeeService } from '../shared/employee/employee.service';

export const managerGuard: CanActivateFn = () => inject(EmployeeService).isManager$;
