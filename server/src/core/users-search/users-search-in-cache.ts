import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/people/people.types';
import { AppConfig } from '../config';
import { SearchUsersWithGoogleApis } from './users-search-with-google-apis.service';
import { UserSearch } from './users-search.types';

@Injectable()
export class SearchUsersInMemory implements UserSearch {
  private logger = new Logger('PeopleService');
  private allUsers: User[] = [];
  private expiryTime: number = 0;
  private isFresh = (): boolean => this.expiryTime > Date.now();
  private isCaching = false;
  private cacheConfig = this.configService.get('cache', { infer: true })!;

  constructor(
    private configService: ConfigService<AppConfig>,
    private googleApi: SearchUsersWithGoogleApis,
  ) {}

  private async fillDomainUsersCache() {
    const tmpResult: User[][] = [];
    this.isCaching = true;

    let pageToken: string | undefined = '';
    this.logger.log('Refreshing user list cache');
    try {
      do {
        const { items, nextPageToken } = await this.googleApi.search('', pageToken);
        tmpResult.push(items);
        pageToken = nextPageToken;
      } while (pageToken);

      this.allUsers = tmpResult.flat();
      this.expiryTime = Date.now() + this.cacheConfig.userListExpiryHour * 3600 * 1000;
    } catch (err) {
      this.logger.error('Error on loading users cache');
    }
    this.isCaching = false;
    const message = `User list cache refreshed with ${this.allUsers.length} items`;
    this.logger.log(message);

    return message;
  }

  public async search(query: string) {
    const queryLowerCase = query.toLocaleLowerCase();
    if (!this.isFresh()) {
      if (!this.isCaching) {
        this.fillDomainUsersCache();
      }
      return await this.googleApi.search(queryLowerCase);
    }

    return {
      /**
       * Match with the beginig of email OR each part of the email.
       * parts are splitted by - or . or _
       */
      
      items: this.allUsers.filter(
        ({ email }) =>
          email.startsWith(queryLowerCase) ||
          email.split(/\.|-|_/gm).some((namePart) => namePart.toLocaleLowerCase().startsWith(queryLowerCase)),
      ),
    };
  }
}
