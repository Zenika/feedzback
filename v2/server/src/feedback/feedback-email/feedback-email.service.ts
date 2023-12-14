import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/core/email';
import { AppConfig } from '../../core/config';
import { EMAIL_DEFAULT_FROM_FIELD, EMAIL_DEV_TO_FIELD } from './feedback-email.config';

@Injectable()
export class FeedbackEmailService {
  private appEnv = this.configService.get('appEnv', { infer: true })!;

  constructor(
    private configService: ConfigService<AppConfig>,
    private emailService: EmailService,
  ) {}

  sendFeedbackRequest(senderEmail: string, receiverEmail: string, message: string, tokenId: string) {
    return this.emailService.send({
      from: EMAIL_DEFAULT_FROM_FIELD,
      to: this.getToField(senderEmail),
      subject: 'Demande de FeedZback',
      html: `${receiverEmail} ${message} ${tokenId}`,
    });
  }

  private getToField(toField: string | string[]): string | string[] {
    return this.appEnv === 'production' ? toField : EMAIL_DEV_TO_FIELD;
  }
}
