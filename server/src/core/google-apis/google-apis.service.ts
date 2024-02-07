import { admin, auth } from '@googleapis/admin';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config';
import { JWT_SCOPES, JWT_SUBJECT } from './google-apis.config';
import { Person } from './google-apis.types';

@Injectable()
export class GoogleApisService {
  private logger = new Logger('GoogleApisService');

  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  private jwt = new auth.JWT(
    this.serviceAccount.clientEmail,
    undefined,
    this.serviceAccount.privateKey,
    JWT_SCOPES,
    JWT_SUBJECT,
  );

  private accessToken = '';

  private accessTokenExpiryDate = 0;

  constructor(private configService: ConfigService<AppConfig>) {}

  async searchPersons(query: string, pageToken?: string): Promise<{ persons: Person[]; nextPageToken?: string }> {
    try {
      const accessToken = await this.getAccessToken();

      const { data } = await admin('directory_v1').users.list({
        access_token: accessToken,
        fields: 'users(primaryEmail, name, thumbnailPhotoUrl), nextPageToken',
        viewType: 'domain_public',
        domain: 'zenika.com',
        pageToken,
        query,
      });

      if (!data.users) {
        throw new Error('No users found');
      }

      const persons = data.users.reduce((_persons, user) => {
        if (user.primaryEmail) {
          _persons.push({
            email: user.primaryEmail,
            displayName: user.name?.fullName ?? undefined,
            photoUrl: user.thumbnailPhotoUrl ?? undefined,
          });
        }
        return _persons;
      }, [] as Person[]);

      const nextPageToken = data.nextPageToken ?? undefined;

      return {
        persons,
        nextPageToken,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async getAccessToken() {
    if (this.checkAuthValidity()) {
      return this.accessToken;
    }

    await this.authorize();
    return this.accessToken;
  }

  private checkAuthValidity() {
    const fiveMinutes = 5 * 60 * 1000;

    return this.accessToken && this.accessTokenExpiryDate - Date.now() > fiveMinutes;
  }

  private authorize() {
    return new Promise<void>((resolve, reject) => {
      this.jwt.authorize((error, tokens) => {
        if (error) {
          reject(new Error(error.message));
        } else if (!tokens?.access_token || !tokens?.expiry_date) {
          reject(new Error('Provided service account does not have permission to generate access tokens'));
        } else {
          this.accessToken = tokens.access_token;
          this.accessTokenExpiryDate = tokens.expiry_date;
          resolve();
        }
      });
    });
  }
}
