import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ManagerService } from './manager.service';

export const managerGuard: CanActivateFn = () => inject(ManagerService).isManager;
