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

  private autocompleteEmail = environment.featureFlipping.autocompleteEmail;

  search(query: string): Observable<Person[]> {
    if (!this.autocompleteEmail) {
      return of([]);
    }
    return this.authService
      .withBearerAccessToken((headers) =>
        this.httpClient.get<Person[]>(`${this.apiBaseUrl}/people/search/${query}`, { headers }),
      )
      .pipe(catchError(() => of([])));
  }
}
