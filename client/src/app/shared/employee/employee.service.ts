import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, ReplaySubject, map, switchMap, tap } from 'rxjs';
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

  dataSnapshot: EmployeeData = { managerEmail: '', managedEmails: [] };

  private _data$ = new ReplaySubject<EmployeeData>(1);

  data$ = this._data$.asObservable();

  isManager$ = this._data$.pipe(map(({ managedEmails }) => managedEmails.length > 0));

  constructor() {
    this.authService.isKnownUser$
      .pipe(
        takeUntilDestroyed(),
        switchMap((isKnownUser) => {
          if (!isKnownUser) {
            return EMPTY;
          }
          return this.fetchData();
        }),
      )
      .subscribe();
  }

  private fetchData() {
    return this.authService.withBearerToken((headers) =>
      this.httpClient.get<EmployeeData>(`${this.apiBaseUrl}/employee`, { headers }).pipe(
        tap((data) => {
          this.dataSnapshot = data;
          this._data$.next(data);
        }),
      ),
    );
  }

  updateManager(managerEmail: string) {
    return this.authService.withBearerToken((headers) =>
      this.httpClient
        .post<void>(`${this.apiBaseUrl}/employee/manager`, { managerEmail } as UpdateManagerDto, { headers })
        .pipe(
          tap(() => {
            this.dataSnapshot = { ...this.dataSnapshot, managerEmail };
            this._data$.next(this.dataSnapshot);
          }),
        ),
    );
  }
}
