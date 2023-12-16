import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { EmailModule } from '../core/email/email.module';
import { FirebaseModule } from '../core/firebase';
import { FeedbackDbService } from './feedback-db/feedback-db.service';
import { FeedbackEmailBuilderModule } from './feedback-email-builder/feedback-email-builder.module';
import { FeedbackEmailController } from './feedback-email/feedback-email.controller';
import { FeedbackEmailService } from './feedback-email/feedback-email.service';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [AuthModule, FirebaseModule, EmailModule, FeedbackEmailBuilderModule],
  controllers: [FeedbackController, FeedbackEmailController],
  providers: [FeedbackDbService, FeedbackEmailService],
})
export class FeedbackModule {}
