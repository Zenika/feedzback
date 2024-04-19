import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, filter, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
import { BYPASS_LOADING } from '../loading/loading.config';
import { UpdateManagerDto } from './employee.dto';
import { EmployeeData } from './employee.types';
import { isManager, updateEmployeeData } from './employee.utils';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  private _data = signal<EmployeeData | undefined>(undefined);

  data = this._data.asReadonly();

  isManager = computed(() => {
    const data = this._data();
    return data ? isManager(data) : undefined;
  });

  data$ = toObservable(this._data).pipe(filter((data): data is EmployeeData => data !== undefined));

  constructor() {
    this.authService.authenticated$
      .pipe(
        takeUntilDestroyed(),
        switchMap((authenticated) => (authenticated ? this.fetchData() : EMPTY)),
      )
      .subscribe((data) => this._data.set(data));
  }

  private fetchData() {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient.get<EmployeeData>(`${this.apiBaseUrl}/employee`, {
        headers,
        // This request is executed when the page is loaded and is used initially to control the display of the
        // "Manager" link in the header. This should not block the UI because of the loading spinner.
        context: new HttpContext().set(BYPASS_LOADING, true),
      }),
    );
  }

  updateManager(managerEmail: string) {
    return this.authService.withBearerIdToken((headers) =>
      this.httpClient
        .post<void>(`${this.apiBaseUrl}/employee/manager`, { managerEmail } as UpdateManagerDto, { headers })
        .pipe(tap(() => this._data.update((data) => updateEmployeeData(data, { managerEmail })))),
    );
  }
}
