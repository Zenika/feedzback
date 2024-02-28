import { Controller, Get } from '@nestjs/common';
import { FeedbackStatsService } from './feedback-stats.service';

@Controller('feedback-stats')
export class FeedbackStatsController {
  constructor(private feedbackStatsService: FeedbackStatsService) {}

  @Get('')
  getStats() {
    return this.feedbackStatsService.getStats();
  }
}
