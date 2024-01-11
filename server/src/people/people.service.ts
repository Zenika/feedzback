import { people } from '@googleapis/people';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Person } from './people.types';

@Injectable()
export class PeopleService {
  private logger = new Logger('PeopleService');

  accessToken!: string;

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
}
