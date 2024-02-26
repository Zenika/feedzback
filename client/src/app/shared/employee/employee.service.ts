import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, ReplaySubject, switchMap, tap } from 'rxjs';
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

  private _data = signal<EmployeeData>({ managerEmail: '', managedEmails: [] });

  data = this._data.asReadonly();

  isManager = computed(() => this._data().managedEmails.length > 0);

  private _next$ = new ReplaySubject<true>();

  next$ = this._next$.asObservable();

  constructor() {
    this.authService.authenticated$
      .pipe(
        takeUntilDestroyed(),
        switchMap((authenticated) => (authenticated ? this.fetchData() : EMPTY)),
      )
      .subscribe((data) => {
        this._data.set(data);
        this._next$.next(true);
      });
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
        .pipe(
          tap(() => {
            this._data.update((data) => ({ ...data, managerEmail }));
            this._next$.next(true);
          }),
        ),
    );
  }
}
