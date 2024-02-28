import { Module } from '@nestjs/common';
import { FeedbackDbModule } from '../feedback-db';
import { FeedbackStatsController } from './feedback-stats.controller';
import { FeedbackStatsService } from './feedback-stats.service';

@Module({
  imports: [FeedbackDbModule],
  providers: [FeedbackStatsService],
  exports: [FeedbackStatsService],
  controllers: [FeedbackStatsController],
})
export class FeedbackStatsModule {}
