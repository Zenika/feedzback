import { Module } from '@nestjs/common';
import { ConsultantModule } from '../consultant';
import { AuthModule } from '../core/auth';
import { FeedbackDbModule } from './feedback-db';
import { FeedbackEmailModule } from './feedback-email';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [AuthModule, FeedbackDbModule, FeedbackEmailModule, ConsultantModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
