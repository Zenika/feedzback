import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { EmailModule } from '../core/email';
import { EmployeeModule } from '../employee';
import { FeedbackDbModule } from './feedback-db';
import { FeedbackEmailModule } from './feedback-email';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [AuthModule, EmailModule, FeedbackDbModule, FeedbackEmailModule, EmployeeModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
