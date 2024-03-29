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
    return this.authService
      .withBearerIdToken((headers) =>
        this.httpClient.get<Person[]>(`${this.apiBaseUrl}/people/search`, { headers, params: { query } }),
      )
      .pipe(catchError(() => of([])));
  }
}
