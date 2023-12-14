import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { AppConfig } from 'src/config';
import { EMAIL_FROM, EMAIL_TO_DEV } from './email.config';
import { emailBuilders } from './templates/templates.fr';

@Injectable()
export class EmailService {
  private readonly environment = this.configService.get('environment', { infer: true })!;

  private readonly options = this.configService.get('mailgunClientOptions', { infer: true })!;

  private readonly mailgunClient = new Mailgun(FormData).client(this.options);

  constructor(private configService: ConfigService<AppConfig>) {}

  async sendFeedbackRequest(senderEmail: string, receiverEmail: string, message: string, tokenId: string) {
    try {
      await this.send({
        to: senderEmail,
        ...emailBuilders.buildRequestFeedback(receiverEmail, message, tokenId),
      });
      return true;
    } catch (err) {
      console.error(err); // TODO: need a logger...
      return false;
    }
  }

  send({ to, subject, html }: Required<Pick<MailgunMessageData, 'to' | 'subject' | 'html'>>) {
    return this.mailgunClient.messages.create(this.options.username, {
      from: EMAIL_FROM,
      to: this.buildTo(to),
      subject,
      html,
    });
  }

  private buildTo(to: string | string[]): string | string[] {
    return this.environment === 'production' ? to : EMAIL_TO_DEV;
  }
}
