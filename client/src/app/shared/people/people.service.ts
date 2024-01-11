import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Person } from './people.types';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private authService = inject(AuthService);

  private httpClient = inject(HttpClient);

  search(query: string): Observable<Person[]> {
    return this.httpClient.post<Person[]>('http://localhost:3000/people', {
      query,
      accessToken: this.authService.accessToken,
    });
  }
}
