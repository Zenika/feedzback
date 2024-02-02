import { people } from '@googleapis/people';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { AppConfig } from 'src/core/config';
import { Person } from './people.types';

@Injectable()
export class PeopleService {
  private logger = new Logger('PeopleService');
  private serviceAccount = this.configService.get('firebaseServiceAccount', { infer: true })!;

  accessToken!: string;

  constructor(private configService: ConfigService<AppConfig>) {}

  async searchDirectoryPeople(query: string): Promise<Person[]> {
    try {
      const response = await people('v1').people.searchDirectoryPeople({
        access_token: this.accessToken,
        sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE'],
        readMask: 'emailAddresses,names,photos',
        query,
      });

      if (!response.data.people) {
        return [];
      }

      return response.data.people.reduce((personList, person) => {
        const email = person.emailAddresses?.[0].value;
        if (email) {
          personList.push({
            email,
            displayName: person.names?.[0].displayName ?? undefined,
            photoUrl: person.photos?.[0].url ?? undefined,
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
    // Define the required scopes.
    const scopes = ['https://www.googleapis.com/auth/admin.directory.user.readonly'];

    // Authenticate a JWT client with the service account.
    const jwtClient = new google.auth.JWT(
      'firebase-adminsdk-kisrh@feedzback-v2-staging.iam.gserviceaccount.com',
      undefined,
      this.serviceAccount.privateKey,
      scopes,
      undefined,
      this.serviceAccount.projectId,

    );
    console.log('JWT', jwtClient)


    // Use the JWT client to generate an access token.
    jwtClient.authorize(function (error, tokens) {
      if (error) {
        console.log('Error making request to generate access token:', error);
      } else if (tokens?.access_token === null) {
        console.log('Provided service account does not have permission to generate access tokens');
      } else {
        const accessToken = tokens?.access_token;

        // See the "Using the access token" section below for information
        // on how to use the access token to send authenticated requests to
        // the Realtime Database REST API.
        console.log(tokens);
        return accessToken;
      }
    });
  }
}
