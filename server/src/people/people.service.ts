import { people } from '@googleapis/people';
import { Injectable } from '@nestjs/common';
import { Person } from './people.types';

@Injectable()
export class PeopleService {
  async search(searchInput: string, access_token: string): Promise<Person[]> {
    const response = await people('v1').people.searchDirectoryPeople({
      access_token,
      mergeSources: 'DIRECTORY_MERGE_SOURCE_TYPE_CONTACT',
      sources: 'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE',
      readMask: 'emailAddresses,names,photos',
      query: searchInput,
    } as any);

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
  }
}
