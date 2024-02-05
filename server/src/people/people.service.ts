import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { join, resolve } from 'node:path';
import { AppConfig } from 'src/core/config';
import { Person } from './people.types';

@Injectable()
export class PeopleService {
  private logger = new Logger('PeopleService');
  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  public accessToken: string = '';

  constructor(private configService: ConfigService<AppConfig>) {}

  async searchDirectoryPeople(query: string): Promise<Person[]> {
    try {
      console.log('ICI');

      const response = await google.admin('directory_v1').users.list({
        access_token: this.accessToken,
        customFieldMask: query,
        viewType:'domain_public',
        domain: 'zenika.com',
      });
      console.log('response');

      if (!response.data.users) {
        return [];
      }

      return response.data.users.reduce((personList, person) => {
        const email = person.emails?.[0].value;
        if (email) {
          personList.push({
            email,
            displayName: person.name?.displayName ?? undefined,
            photoUrl: person.thumbnailPhotoUrl ?? undefined,
          });
        }
        return personList;
      }, [] as Person[]);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
  }

  async testWithJWT() {
    const secretPath = join(resolve('./'), 'SECRET.json');

    // Define the required scopes.
    const scopes = ['https://www.googleapis.com/auth/admin.directory.user.readonly'];

    // Authenticate a JWT client with the service account.
    const jwtClient = new google.auth.JWT(
      'firebase-adminsdk-kisrh@feedzback-v2-staging.iam.gserviceaccount.com',
      secretPath,
      undefined,
      scopes,
    );
    console.log('JWT', jwtClient);

    // Use the JWT client to generate an access token.
    jwtClient.authorize((error, tokens) => {
      if (error) {
        console.log('Error making request to generate access token:', error);
      } else if (tokens?.access_token === null) {
        console.log('Provided service account does not have permission to generate access tokens');
      } else {
        const accessToken = tokens?.access_token;

        // See the "Using the access token" section below for information
        // on how to use the access token to send authenticated requests to
        // the Realtime Database REST API.
        console.log(accessToken);

        this.accessToken = tokens?.access_token ?? '';
        return accessToken;
      }
    });
  }
}
