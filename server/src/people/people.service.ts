import { Injectable } from '@nestjs/common';
import { PeopleCacheService } from './people-cache.service';
import { searchPersons } from './people-cache.utils';

@Injectable()
export class PeopleService {
  constructor(private peopleCacheService: PeopleCacheService) {}

  searchPersons(query: string) {
    return searchPersons(query, this.peopleCacheService.getSearchablePersons());
  }
}
