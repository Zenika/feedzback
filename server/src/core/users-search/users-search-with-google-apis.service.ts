import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { admin_directory_v1, google } from 'googleapis';
import { AppConfig } from 'src/core/config';
import { User } from 'src/people/people.types';
import { AuthService } from '../auth';
import { UserSearch } from './users-search.types';

@Injectable()
export class SearchUsersWithGoogleApis implements UserSearch {
  private logger = new Logger('PeopleService');

  private accessToken: string = '';
  private accessTokenExpiryTime: number = 0;

  private googleApisConfig = this.configService.get('googleApis', { infer: true })!;

  constructor(
    private configService: ConfigService<AppConfig>,
    private authService: AuthService,
  ) {}

  public search = async (query: string, pageToken?: string) => {
    try {
      const accessTokenToUse = await this.getAccessToken();

      const response = await google.admin('directory_v1').users.list({
        access_token: accessTokenToUse,
        fields: 'users(id, name, primaryEmail, thumbnailPhotoUrl), nextPageToken',
        viewType: 'domain_public',
        domain: 'zenika.com',
        pageToken,
        query,
      });

      if (!response.data.users) {
        return { items: [] };
      }

      this.logger.log('Search returns ' + response.data.users.length + ' elements');

      return {
        items: this.tranformApiResultToUserList(response.data.users),
        nextPageToken: response.data?.nextPageToken ?? undefined,
      };
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
  };

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

  private async getAccessToken() {
    if (Date.now() / 1000 >= this.accessTokenExpiryTime) {
      const jwtClient = new google.auth.JWT(
        this.googleApisConfig.serviceAccount,
        undefined,
        this.googleApisConfig.privateKey,
        this.googleApisConfig.scopes,
        'norbert.pointu@zenika.com',
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
          }
          resolve(this.accessToken);
        }),
      );
    } else {
      return this.accessToken;
    }
  }
}
