import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ConsultantService } from '../shared/consultant/consultant.service';

export const managerGuard: CanActivateFn = () => inject(ConsultantService).isManager();
