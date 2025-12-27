import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { GoogleApisService, Person } from '../core/google-apis';
import { PEOPLE_CACHE_RETRY_DURATION, PEOPLE_CACHE_VALIDITY_DURATION } from './people-cache.config';
import { SearchablePerson } from './people-cache.types';
import { mapToSearchablePerson } from './people-cache.utils';

@Injectable()
export class PeopleCacheService {
  private logger = new Logger('PeopleCacheService');

  private _isReady$ = new BehaviorSubject(false);
  isReady$ = this._isReady$.asObservable();
  get isReady() {
    return this._isReady$.value;
  }

  private cachingInProgress = false;

  private searchablePersonsExpiryDate = 0;

  searchablePersons: SearchablePerson[] = [];

  constructor(private googleApis: GoogleApisService) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.refreshPeople();
  }

  checkExpiryDateAndRefreshPeople() {
    if (Date.now() <= this.searchablePersonsExpiryDate) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.refreshPeople();
  }

  private async refreshPeople() {
    if (this.cachingInProgress) {
      return;
    }
    this.cachingInProgress = true;

    try {
      const allPersons: Person[] = [];
      const cachingStartDate = Date.now();
      let pageToken: string | undefined = undefined;
      do {
        const { persons, nextPageToken } = await this.googleApis.searchPersons('', pageToken);
        allPersons.push(...persons);
        pageToken = nextPageToken;
      } while (pageToken);

      this.searchablePersons = allPersons.map(mapToSearchablePerson);
      this.searchablePersonsExpiryDate = Date.now() + PEOPLE_CACHE_VALIDITY_DURATION;
      this._isReady$.next(true);

      const cachingDuration = Math.round((Date.now() - cachingStartDate) / 100) / 10;
      this.logger.log(`Cache refreshed with ${allPersons.length} persons in ${cachingDuration}s`);
    } catch {
      this.searchablePersonsExpiryDate = Date.now() + PEOPLE_CACHE_RETRY_DURATION;

      this.logger.error(`Unable to cache people. Retry in ${Math.round(PEOPLE_CACHE_RETRY_DURATION / 60_000)}mn...`);
    }

    this.cachingInProgress = false;
  }
}
