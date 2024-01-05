import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { AppConfig } from '../config';

@Injectable()
export class EmailService {
  private mailgunOptions = this.configService.get('mailgunClientOptions', { infer: true })!;

  private mailgunDomain = this.configService.get('mailgunDomain', { infer: true })!;

  private mailgunClient = new Mailgun(FormData).client(this.mailgunOptions);

  constructor(private configService: ConfigService<AppConfig>) {}

  async send({ from, to, subject, html }: Required<Pick<MailgunMessageData, 'from' | 'to' | 'subject' | 'html'>>) {
    await this.mailgunClient.messages.create(this.mailgunDomain, { from, to, subject, html });
  }
}
