import { Injectable } from '@nestjs/common';
import { first, map } from 'rxjs';
import { PeopleCacheService } from './people.cache.service';

@Injectable()
export class PeopleService {
  constructor(private peopleCacheService: PeopleCacheService) {}

  public searchUsers(query: string) {
    this.peopleCacheService.checkExpiryTime();
    const queryLowerCase = query.toLowerCase();
    return this.peopleCacheService.personList$.pipe(
      first(),
      map((persons) =>
        persons.filter(({ searchTokens }) =>
          searchTokens.some((searchToken) => searchToken.startsWith(queryLowerCase)),
        ),
      ),
    );
  }
}
