import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ConsultantService } from '../shared/consultant/consultant.service';

// TODO: move to observables or signals for reactivity...

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  isManager = false;

  consultants: string[] = [];

  private consultantService = inject(ConsultantService);

  init() {
    return this.consultantService.get().pipe(
      tap(({ managedEmails: consultants }) => {
        this.isManager = consultants.length > 0;
        this.consultants = consultants;
      }),
    );
  }

  updateManager(managerEmail: string) {
    return this.consultantService.updateManager(managerEmail).pipe(tap(() => this.init()));
  }
}
