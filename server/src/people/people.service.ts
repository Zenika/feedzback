import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { admin_directory_v1, google } from 'googleapis';
import { AppConfig } from 'src/core/config';
import { User } from './people.types';

@Injectable()
export class PeopleService {
  private logger = new Logger('PeopleService');
  private googleApisConfig = this.configService.get('googleApis', { infer: true })!;

  private accessToken: string = '';
  private accessTokenExpiryTime: number = 0;
  private allUsers: User[] = [];

  constructor(private configService: ConfigService<AppConfig>) {}

  private tranformApiResultToUserList = (apiUsers: admin_directory_v1.Schema$User[]) => {
    return apiUsers.reduce((acc, user) => {
      const email = user.primaryEmail;
      if (email) {
        acc.push({
          email,
          displayName: user.name?.fullName ?? undefined,
          photoUrl: user.thumbnailPhotoUrl ?? undefined,
        });
      }
      return acc;
    }, [] as User[]);
  };

  async searchDomainUsers(query: string, searchOnCache = true): Promise<User[]> {
    if (searchOnCache) {
      if (this.allUsers.length === 0) {
        await this.fillDomainUsersCache();
      }
      return Promise.resolve(this.allUsers.filter(({ email }) => email.includes(query)));
    } else {
      try {
        const response = await google.admin('directory_v1').users.list({
          access_token: await this.getAccessToken(),
          fields: 'users(id, name, primaryEmail, thumbnailPhotoUrl), nextPageToken',
          viewType: 'domain_public',
          domain: 'zenika.com',
          query,
        });
        // console.log('response', response.data);

        if (!response.data.users) {
          return [];
        }

        return this.tranformApiResultToUserList(response.data.users);
      } catch (err) {
        this.logger.error(err);
        throw new BadRequestException();
      }
    }
  }

  private async getAccessToken() {
    if (Date.now() / 1000 >= this.accessTokenExpiryTime) {
      const jwtClient = new google.auth.JWT(
        this.googleApisConfig.serviceAccount,
        undefined,
        this.googleApisConfig.privateKey,
        this.googleApisConfig.scopes,
        this.googleApisConfig.impersonate,
      );

      // Use the JWT client to generate an access token.
      return new Promise<string>((resolve, reject) =>
        jwtClient.authorize((error, tokens) => {
          if (error) {
            reject(new Error('Error making request to generate access token:'));
          } else if (tokens?.access_token === null || tokens?.access_token === undefined) {
            reject(new Error('Provided service account does not have permission to generate access tokens'));
          } else {
            this.accessToken = tokens.access_token;
            this.accessTokenExpiryTime = tokens.expiry_date ?? 0;
            this.logger.log('Get new Token 🔑 for googleApis');
            resolve(tokens.access_token);
          }
        }),
      );
    } else {
      return this.accessToken;
    }
  }

  public async fillDomainUsersCache() {
    const tmpResult: User[][] = [];

    const getResultForPakeToken = async (pageToken?: string) => {
      const response = await google.admin('directory_v1').users.list({
        access_token: await this.getAccessToken(),
        fields: 'users(id, name, primaryEmail, thumbnailPhotoUrl), nextPageToken',
        viewType: 'domain_public',
        domain: 'zenika.com',
        pageToken,
        query: '',
      });

      if (response?.data.users) {
        Logger.log('Fill User cache : ', response?.data.users?.length);

        tmpResult.push(this.tranformApiResultToUserList(response.data.users));
        if (response.data.nextPageToken) {
          await getResultForPakeToken(response.data.nextPageToken);
        }
      }
    };
    await getResultForPakeToken();
    this.allUsers = tmpResult.flat();
    return this.allUsers;
  }
}
