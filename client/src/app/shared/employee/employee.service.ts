import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, first, skipWhile, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
import { UpdateManagerDto } from './employee.dto';
import { EmployeeData } from './employee.types';

const DUMMY_EMPLOYEE_DATA: EmployeeData = Object.freeze({ managerEmail: '', managedEmails: [] });

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  private _data = signal<EmployeeData>(DUMMY_EMPLOYEE_DATA);

  data = this._data.asReadonly();

  data$ = toObservable(this._data).pipe(skipWhile((data) => data === DUMMY_EMPLOYEE_DATA));

  isManager = computed(() => this._data().managedEmails.length > 0);

  constructor() {
    this.authService.isKnownUser$
      .pipe(
        switchMap((isKnownUser) => {
          if (!isKnownUser) {
            return EMPTY;
          }
          return this.fetchData();
        }),
        first(),
      )
      .subscribe();
  }

  private fetchData() {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient
        .get<EmployeeData>(`${this.apiBaseUrl}/employee`, { headers })
        .pipe(tap((data) => this._data.set(data))),
    );
  }

  updateManager(managerEmail: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient
        .post<void>(`${this.apiBaseUrl}/employee/manager`, { managerEmail } as UpdateManagerDto, { headers })
        .pipe(tap(() => this._data.update((data) => ({ ...data, managerEmail })))),
    );
  }
}
