import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../core/config';
import { GoogleApisService, Person } from '../core/google-apis';
import { PEOPLE_CACHE_RETRY_DURATION, PEOPLE_CACHE_VALIDITY_DURATION } from './people-cache.config';
import { SearchablePerson } from './people-cache.types';
import { mapToSearchablePerson } from './people-cache.utils';

@Injectable()
export class PeopleCacheService {
  private logger = new Logger('PeopleCacheService');

  // In reality, this service could be enabled even when Firebase is running in emulator mode (as it does not depend on Firebase).
  // But when using Firebase emulators, the aim is to run the application in isolation from the network.
  // And this service depends on the network to retrieve its data.
  private readonly featureDisabled = this.configService.get('firebaseEmulatorMode', { infer: true })!;

  private state: 'notAvailable' | 'ready' = 'notAvailable';

  private cachingInProgress = false;

  private searchablePersonsExpiryDate = 0;

  searchablePersons: SearchablePerson[] = [];

  get isReady() {
    return this.state === 'ready';
  }

  constructor(
    private configService: ConfigService<AppConfig>,
    private googleApis: GoogleApisService,
  ) {
    if (this.featureDisabled) {
      this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
    }

    this.refreshPeople();
  }

  checkExpiryDateAndRefreshPeople() {
    if (Date.now() <= this.searchablePersonsExpiryDate) {
      return;
    }
    this.refreshPeople();
  }

  private async refreshPeople() {
    if (this.featureDisabled) {
      return;
    }

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
      this.state = 'ready';

      const cachingDuration = Math.round((Date.now() - cachingStartDate) / 100) / 10;
      this.logger.log(`Cache refreshed with ${allPersons.length} persons in ${cachingDuration}s`);
    } catch {
      this.searchablePersonsExpiryDate = Date.now() + PEOPLE_CACHE_RETRY_DURATION;

      this.logger.error(`Unable to cache people. Retry in ${Math.round(PEOPLE_CACHE_RETRY_DURATION / 60_000)}mn...`);
    }

    this.cachingInProgress = false;
  }
}
