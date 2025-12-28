import { Injectable, Logger } from '@nestjs/common';
import { GoogleApisService } from './google-apis.service';
import { Person } from './google-apis.types';

// NOTE: the Google API Stub is used to set the `managerEmail` in E2E tests.
// For details, see:
//  - ../../../../client/firebase-emulators-data/auth_export/accounts.json
//  - ../../../../client/e2e/pages/settings.page

const PERSONS_MOCK: Record<string, Person> = {
  'alfred.demo@zenika.com': {
    email: 'alfred.demo@zenika.com',
    managerEmail: 'daniel.demo@zenika.com',
    displayName: 'Daniel Demo',
  },
};

@Injectable()
export class GoogleApisStubService implements Partial<GoogleApisService> {
  private logger = new Logger('GoogleApisService');

  constructor() {
    this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async searchPersons(query: string): Promise<{ persons: Person[]; nextPageToken?: string }> {
    const personMock = PERSONS_MOCK[query];
    return {
      persons: personMock ? [personMock] : [],
    };
  }
}
