import { Module } from '@nestjs/common';
import { AuthModule } from '../core/auth';
import { ContextModule } from '../core/context';
import { EmailModule } from '../core/email';
import { EmployeeModule } from '../employee';
import { FeedbackDbModule } from './feedback-db';
import { FeedbackEmailModule } from './feedback-email';
import { FeedbackStatsModule } from './feedback-stats';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [
    AuthModule,
    ContextModule,
    EmailModule,
    EmployeeModule,
    FeedbackDbModule,
    FeedbackEmailModule,
    FeedbackStatsModule,
  ],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
