import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class EmailStubService implements Partial<EmailService> {
  private logger = new Logger('EmailService');

  constructor() {
    this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async send() {
    return true;
  }
}
