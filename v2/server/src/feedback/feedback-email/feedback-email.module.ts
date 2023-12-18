import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../core/config';
import { EmailModule } from '../../core/email';
import { FeedbackEmailBuilderModule } from './feedback-email-builder';
import { FeedbackEmailService } from './feedback-email.service';

@Module({
  imports: [AppConfigModule, FeedbackEmailBuilderModule, EmailModule],
  providers: [FeedbackEmailService],
  exports: [FeedbackEmailService],
})
export class FeedbackEmailModule {}
