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

  private hasEmailValidation = this.configService.get('featureFlipping.emailValidation', { infer: true })!;

  constructor(private configService: ConfigService<AppConfig>) {}

  // NOTE:
  // Mailgun email validation is an expensive option that we don't have on this project.
  // We'll probably have to turn to other providers...
  async validate(email: string, allowRoleAdress = false) {
    if (!this.hasEmailValidation) {
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
