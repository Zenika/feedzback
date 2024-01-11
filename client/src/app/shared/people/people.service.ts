import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Person } from './people.types';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private httpClient = inject(HttpClient);

  private authService = inject(AuthService);

  private apiBaseUrl = environment.apiBaseUrl;

  search(query: string): Observable<Person[]> {
    if (!this.authService.accessToken) {
      return of([]);
    }
    return this.httpClient
      .get<Person[]>(`${this.apiBaseUrl}/people/search/${query}`, {
        headers: { Authorization: `Bearer ${this.authService.accessToken}` },
      })
      .pipe(
        catchError(() => {
          this.authService.setAccessToken(null);
          return of([]);
        }),
      );
  }
}
