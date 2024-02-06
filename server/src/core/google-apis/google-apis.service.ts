import { admin, admin_directory_v1, auth } from '@googleapis/admin';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PersonWithSearchTokens } from '../../people/index';
import { AppConfig } from '../config';
import { IMPERSONATE_EMAIL, USER_LIST_SCOPES } from './google-apis.config';

@Injectable()
export class GoogleApisService {
  constructor(private configService: ConfigService<AppConfig>) {}

  private logger = new Logger('PeopleService');

  private accessToken: string = '';
  private accessTokenExpiryTime: number = 0;

  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  public getUserList = async (query: string, pageToken?: string) => {
    try {
      const accessTokenToUse = await this.getAccessToken();

      const response = await admin('directory_v1').users.list({
        access_token: accessTokenToUse,
        fields: 'users(id, name, primaryEmail, thumbnailPhotoUrl), nextPageToken',
        viewType: 'domain_public',
        domain: 'zenika.com',
        pageToken,
        query,
      });

      if (!response.data.users) {
        return { items: [] as PersonWithSearchTokens[] };
      }

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
    return apiUsers.reduce<PersonWithSearchTokens[]>((acc, user) => {
      const email = user.primaryEmail;
      if (email) {
        const displayName = user.name?.fullName ?? '';
        acc.push({
          email,
          displayName,
          photoUrl: user.thumbnailPhotoUrl ?? undefined,
          /**
           * Match with the begining of email/fullname OR each part of them.
           * parts are splitted by - or . or _ or space
           */
          searchTokens: [
            email,
            displayName.toLowerCase(),
            `${email} ${displayName.toLowerCase()}`
              .split(/\.|-|\s/gm)
              .reduce<string[]>((acc, part) => (acc.includes(part) ? acc : [...acc, part]), []),
          ].flat(),
        });
      }
      return acc;
    }, []);
  };

  private async getAccessToken() {
    if (Date.now() - 5 * 60 * 1000 >= this.accessTokenExpiryTime) {
      const jwtClient = new auth.JWT(
        this.serviceAccount.clientEmail,
        undefined,
        this.serviceAccount.privateKey,
        USER_LIST_SCOPES,
        IMPERSONATE_EMAIL,
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
