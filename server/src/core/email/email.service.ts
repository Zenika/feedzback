import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { AppConfig } from '../config';
import { SendParams } from './email.params';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');

  private clientOptions = this.configService.get('mailgunClientOptions', { infer: true })!;

  private client = new Mailgun(FormData).client(this.clientOptions);

  private domain = this.configService.get('mailgunDomain', { infer: true })!;

  private appEnv = this.configService.get('appEnv', { infer: true })!;

  constructor(private configService: ConfigService<AppConfig>) {}

  async validate(email: string, allowRoleAdress = false) {
    // Email validation is only available in the Mailgun production environment.
    if (this.appEnv === 'developement') {
      return true;
    }
    try {
      // API reference: https://documentation.mailgun.com/en/latest/api-email-validation.html#single-validation
      const validation = await this.client.validate.get(email);
      this.logger.log(validation);

      return (
        validation.result === 'deliverable' &&
        validation.is_disposable_address === false &&
        (allowRoleAdress || validation.is_role_address === false)
      );
    } catch (err) {
      this.logger.error(err);

      // If something went wrong validate anyway (to avoid denial of service).
      return true;
    }
  }

  async send(params: SendParams) {
    try {
      await this.client.messages.create(this.domain, params);

      return true;
    } catch (err) {
      this.logger.error(err);

      return false;
    }
  }
}
