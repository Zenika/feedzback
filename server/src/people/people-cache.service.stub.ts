import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import { PeopleCacheService } from './people-cache.service';
import { SearchablePerson } from './people-cache.types';

@Injectable()
export class PeopleCacheStubService implements Partial<PeopleCacheService> {
  private logger = new Logger('PeopleCacheService');

  isReady$ = new BehaviorSubject(true);
  isReady = true;

  searchablePersons: SearchablePerson[] = [];

  constructor() {
    this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
  }

  checkExpiryDateAndRefreshPeople() {}
}
