import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BYPASS_LOADING } from '../loading';
import { Person } from './people.types';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private httpClient = inject(HttpClient);

  private apiBaseUrl = environment.apiBaseUrl;

  search(query: string): Observable<Person[]> {
    return this.httpClient
      .get<Person[]>(`${this.apiBaseUrl}/people/search`, {
        params: { query },
        context: new HttpContext().set(BYPASS_LOADING, true),
      })
      .pipe(catchError(() => of([])));
  }
}
