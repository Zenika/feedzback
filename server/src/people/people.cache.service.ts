import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReplaySubject } from 'rxjs';
import { AppConfig } from '../core/config';
import { GoogleApisService } from '../core/google-apis';
import { PersonWithSearchTokens } from './people.types';

@Injectable()
export class PeopleCacheService {
  constructor(
    private googleApi: GoogleApisService,
    private configService: ConfigService<AppConfig>,
  ) {
    this.fetchPeople();
  }
  private expiryTime: number = 0;
  private cacheConfig = this.configService.get('cache', { infer: true })!;

  private _personList$ = new ReplaySubject<PersonWithSearchTokens[]>(1);
  private logger = new Logger('PeopleService');
  private cachingInProgress = false;

  public personList$ = this._personList$.asObservable();

  public async fetchPeople() {
    const tmpResult: PersonWithSearchTokens[][] = [];
    this.cachingInProgress = true;

    let pageToken: string | undefined = '';
    try {
      do {
        const { items, nextPageToken } = await this.googleApi.getUserList('', pageToken);
        tmpResult.push(items);
        pageToken = nextPageToken;
      } while (pageToken);

      const finalResult = tmpResult.flat();
      this._personList$.next(finalResult);
      this.expiryTime = Date.now() + this.cacheConfig.userListExpiryHour * 3600 * 1000;

      const message = `User list cache refreshed with ${finalResult.length} items`;
      this.logger.log(message);
      return message;
    } catch (err) {
      this.logger.error('Error on loading users cache');
    }
    this.cachingInProgress = false;
  }

  public checkExpiryTime() {
    if (Date.now() > this.expiryTime && !this.cachingInProgress) {
      this.fetchPeople();
    }
  }
}
