import { Injectable } from '@nestjs/common';
import { Observable, first, map } from 'rxjs';
import { Person } from '../core/google-apis';
import { PeopleCacheService } from './people-cache.service';
import { findPersons } from './people-cache.utils';

@Injectable()
export class PeopleService {
  constructor(private peopleCacheService: PeopleCacheService) {}

  public searchPersons(query: string): Observable<Person[]> {
    return this.peopleCacheService.searchablePersons$.pipe(
      first(),
      map((searchablePersons) => findPersons(query, searchablePersons)),
    );
  }
}
