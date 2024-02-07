import { Injectable, Logger } from '@nestjs/common';
import { ReplaySubject, tap } from 'rxjs';
import { GoogleApisService, Person } from '../core/google-apis';
import { SearchablePerson } from './people-cache.types';
import { mapToSearchablePerson } from './people-cache.utils';

@Injectable()
export class PeopleCacheService {
  private logger = new Logger('PeopleCacheService');

  private _searchablePersons$ = new ReplaySubject<SearchablePerson[]>(1);

  searchablePersons$ = this._searchablePersons$.pipe(tap(() => this.checkExpiryTime()));

  private searchablePersonsExpiryDate = 0;

  private cachingInProgress = false;

  constructor(private googleApis: GoogleApisService) {
    this.fetchPeople();
  }

  private async fetchPeople() {
    const allPersons: Person[] = [];

    const startNow = Date.now();
    this.cachingInProgress = true;
    let pageToken: string | undefined = undefined;
    do {
      const { persons, nextPageToken } = await this.googleApis.searchPersons('', pageToken);
      allPersons.push(...persons);
      pageToken = nextPageToken;
    } while (pageToken);
    this.cachingInProgress = false;
    const duration = Math.round((Date.now() - startNow) / 100) / 10;

    this._searchablePersons$.next(allPersons.map(mapToSearchablePerson));

    // TODO: improve timings...
    this.searchablePersonsExpiryDate = allPersons.length ? Date.now() + 3600 * 1000 * 2 : Date.now() + 3600 * 1000;

    this.logger.log(`Cache refreshed with ${allPersons.length} persons in ${duration}s`);
  }

  private checkExpiryTime() {
    if (!this.cachingInProgress && Date.now() > this.searchablePersonsExpiryDate) {
      this.fetchPeople();
    }
  }
}
