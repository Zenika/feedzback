import { Injectable } from '@nestjs/common';
import { GoogleApisService } from 'src/core/google-apis';
import { PeopleCacheService } from './people-cache.service';
import { searchPersons } from './people-cache.utils';

@Injectable()
export class PeopleService {
  constructor(
    private peopleCacheService: PeopleCacheService,
    private googleApisService: GoogleApisService,
  ) {}

  async searchPersons(query: string) {
    this.peopleCacheService.checkExpiryDateAndRefreshPeople();

    if (this.peopleCacheService.isReady) {
      return searchPersons(query, this.peopleCacheService.searchablePersons);
    } else {
      return (await this.googleApisService.searchPersons(query)).persons;
    }
  }
}
