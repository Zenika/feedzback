import { Module } from '@nestjs/common';
import { EmailModule } from 'src/core/email';
import { FeedbackEmailBuilderModule } from './feedback-email-builder';
import { FeedbackEmailService } from './feedback-email.service';

@Module({
  imports: [FeedbackEmailBuilderModule, EmailModule],
  providers: [FeedbackEmailService],
  exports: [FeedbackEmailService],
})
export class FeedbackEmailModule {}
