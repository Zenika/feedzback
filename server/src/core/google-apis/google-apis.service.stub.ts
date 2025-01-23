import { Injectable, Logger } from '@nestjs/common';
import { GoogleApisService } from './google-apis.service';
import { Person } from './google-apis.types';

@Injectable()
export class GoogleApisStubService implements Partial<GoogleApisService> {
  private logger = new Logger('GoogleApisService');

  constructor() {
    this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async searchPersons(): Promise<{ persons: Person[]; nextPageToken?: string }> {
    return { persons: [] };
  }
}
