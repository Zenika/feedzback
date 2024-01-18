import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Person } from './people.types';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search(query: string): Observable<Person[]> {
    return of([]);
  }
}
