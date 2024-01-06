import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { AppConfig } from '../config';

@Injectable()
export class EmailService {
  private clientOptions = this.configService.get('mailgunClientOptions', { infer: true })!;

  private client = new Mailgun(FormData).client(this.clientOptions);

  private domain = this.configService.get('mailgunDomain', { infer: true })!;

  constructor(private configService: ConfigService<AppConfig>) {}

  async send({ from, to, subject, html }: Required<Pick<MailgunMessageData, 'from' | 'to' | 'subject' | 'html'>>) {
    await this.client.messages.create(this.domain, { from, to, subject, html });
  }
}
