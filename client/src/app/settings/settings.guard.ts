import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { EmployeeService } from '../shared/employee/employee.service';

// Make sure the `EmployeeService` is ready for use before creating the routed component.
export const settingsGuard: CanActivateFn = () => inject(EmployeeService).next$;
