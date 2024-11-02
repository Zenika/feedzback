import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class EmailStubService implements Partial<EmailService> {
  private logger = new Logger('EmailService');

  constructor() {
    this.logger.warn(`Feature disabled (when Firebase running in emulator mode)`);
  }

  async validate() {
    return true;
  }

  async send() {
    return true;
  }
}
