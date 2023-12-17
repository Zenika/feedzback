import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { AppConfig } from '../config';

@Injectable()
export class EmailService {
  private options = this.configService.get('mailgunClientOptions', { infer: true })!;

  private mailgunClient = new Mailgun(FormData).client(this.options);

  constructor(private configService: ConfigService<AppConfig>) {}

  async send({ from, to, subject, html }: Required<Pick<MailgunMessageData, 'from' | 'to' | 'subject' | 'html'>>) {
    try {
      await this.mailgunClient.messages.create(this.options.username, { from, to, subject, html });
      return true;
    } catch (err) {
      console.error(err); // TODO: Need an App logger...
      return false;
    }
  }
}
