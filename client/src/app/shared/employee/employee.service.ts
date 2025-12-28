import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
import { BYPASS_LOADING_CONTEXT } from '../loading';
import { NotificationService } from '../notification';
import { UpdateManagerDto } from './employee.dto';
import { EmployeeData, EmployeeManagerEmailSync } from './employee.types';
import { isManager, updateEmployeeData } from './employee.utils';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private notificationService = inject(NotificationService);

  private apiBaseUrl = environment.apiBaseUrl;

  private _data = signal<EmployeeData | null | undefined>(undefined);

  data = this._data.asReadonly();

  isManager = computed(() => {
    const data = this._data();
    return data ? isManager(data) : undefined;
  });

  data$ = toObservable(this._data).pipe(filter((data) => data !== undefined));

  constructor() {
    this.authService.signedIn$
      .pipe(
        takeUntilDestroyed(),
        switchMap((signedIn) => {
          switch (signedIn) {
            case false:
              return of(false);
            case 'previously':
              return of(true);
            case 'now':
              return this.syncManager().pipe(
                tap((managerEmailSync) => {
                  if (managerEmailSync.updated) {
                    this.notificationService.show(
                      $localize`:@@Message.ManagerEmailUpdated:L'email de votre manager a été mis à jour : ${managerEmailSync.managerEmail}`,
                      'success',
                    );
                  }
                }),
                map(() => true),
              );
          }
        }),
        switchMap((authenticated) => (!authenticated ? of(null) : this.fetchData())),
      )
      .subscribe((data) => this._data.set(data));
  }

  private syncManager() {
    return this.httpClient.get<EmployeeManagerEmailSync>(`${this.apiBaseUrl}/employee/sync-manager`, {
      context: BYPASS_LOADING_CONTEXT,
    });
  }

  private fetchData() {
    // This request is executed when the page is loaded and is used initially to control the display of the
    // "Manager" link in the header. This should not block the UI because of the loading spinner.
    return this.httpClient.get<EmployeeData>(`${this.apiBaseUrl}/employee`, { context: BYPASS_LOADING_CONTEXT });
  }

  /** @deprecated */
  updateManager(managerEmail: string) {
    return this.httpClient
      .post<void>(`${this.apiBaseUrl}/employee/manager`, { managerEmail } as UpdateManagerDto)
      .pipe(tap(() => this._data.update((data) => updateEmployeeData(data, { managerEmail }))));
  }
}
