import { Injectable, Logger } from '@nestjs/common';
import { PeopleCacheService } from './people-cache.service';
import { SearchablePerson } from './people-cache.types';

@Injectable()
export class PeopleCacheStubService implements Partial<PeopleCacheService> {
  private logger = new Logger('PeopleCacheService');

  searchablePersons: SearchablePerson[] = [];

  isReady = true;

  constructor() {
    this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
  }

  checkExpiryDateAndRefreshPeople() {}
}
