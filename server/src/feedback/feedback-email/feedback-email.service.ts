import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../core/config';
import { EmailService } from '../../core/email';
import { FeedbackEmailBuilderService } from './feedback-email-builder';
import { EMAIL_DEFAULT_FROM_FIELD, EMAIL_DEV_TO_FIELD } from './feedback-email.config';

@Injectable()
export class FeedbackEmailService {
  private appEnv = this.configService.get('appEnv', { infer: true })!;

  constructor(
    private configService: ConfigService<AppConfig>,
    private feedbackEmailBuilderService: FeedbackEmailBuilderService,
    private emailService: EmailService,
  ) {}

  async requested(giverEmail: string, receiverEmail: string, message: string, tokenId: string) {
    const { subject, html } = await this.feedbackEmailBuilderService.requested(receiverEmail, message, tokenId);

    this.emailService.send({
      from: EMAIL_DEFAULT_FROM_FIELD,
      to: this.getToField(giverEmail),
      subject,
      html,
    });
  }

  async given(giverEmail: string, receiverEmail: string, feedbackId: string) {
    const { subject, html } = await this.feedbackEmailBuilderService.given(giverEmail, feedbackId);

    this.emailService.send({
      from: EMAIL_DEFAULT_FROM_FIELD,
      to: this.getToField(receiverEmail),
      subject,
      html,
    });
  }

  private getToField(toField: string | string[]): string | string[] {
    return this.appEnv === 'production' ? toField : EMAIL_DEV_TO_FIELD;
  }
}
