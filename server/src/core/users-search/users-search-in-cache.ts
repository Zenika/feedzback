import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/people/people.types';
import { SearchUsersWithGoogleApis } from './users-search-with-google-apis.service';
import { UserSearch } from './users-search.types';

const CACHE_EXPIRY_HOUR_DELAY = 1;

@Injectable()
export class SearchUsersInMemory implements UserSearch {
  private logger = new Logger('PeopleService');
  private allUsers: User[] = [];
  private expiryTime: number = 0;
  private isFresh = (): boolean => this.expiryTime > Date.now();
  private isCaching = false

  constructor(private googleApi: SearchUsersWithGoogleApis) {}

  private async fillDomainUsersCache() {
    const tmpResult: User[][] = [];
    this.isCaching = true

    let pageToken: string | undefined = '';

    try {
      do {
        const { items, nextPageToken } = await this.googleApi.search('', pageToken);
        tmpResult.push(items);
        pageToken = nextPageToken;
      } while (pageToken);

      this.allUsers = tmpResult.flat();
      this.expiryTime = Date.now() + CACHE_EXPIRY_HOUR_DELAY * 3600 * 1000;
    } catch (err) {
      this.logger.log('Error on loading users cache');
    }
    this.isCaching = false
    return tmpResult.length + ' filled';
  }

  public async search(query: string) {
    if (!this.isFresh() && !this.isCaching) {
      this.fillDomainUsersCache();
      return await this.googleApi.search(query);
    }

    return { items: this.allUsers.filter(({ email }) => email.includes(query)) };
  }
}
