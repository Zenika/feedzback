import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of, skipWhile, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
import { UpdateManagerDto } from './employee.dto';
import { EmployeeData } from './employee.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  private _data = signal<EmployeeData | null | undefined>(undefined);

  data = this._data.asReadonly();

  data$ = toObservable(this._data).pipe(skipWhile((data) => data === undefined));

  isManager = computed(() => {
    const data = this._data();
    return data ? data.managedEmails.length > 0 : false;
  });

  constructor() {
    this.authService.authenticated$
      .pipe(
        takeUntilDestroyed(),
        switchMap((authenticated) => (authenticated ? this.fetchData() : of(null))),
      )
      .subscribe((data) => this._data.set(data));
  }

  private fetchData() {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<EmployeeData>(`${this.apiBaseUrl}/employee`, { headers }),
    );
  }

  updateManager(managerEmail: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient
        .post<void>(`${this.apiBaseUrl}/employee/manager`, { managerEmail } as UpdateManagerDto, { headers })
        .pipe(tap(() => this._data.update((data) => ({ ...data!, managerEmail })))),
    );
  }
}
