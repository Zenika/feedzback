import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { EmployeeModule } from '../employee';
import { FeedbackDbModule } from './feedback-db';
import { FeedbackEmailModule } from './feedback-email';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [AuthModule, FeedbackDbModule, FeedbackEmailModule, EmployeeModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
