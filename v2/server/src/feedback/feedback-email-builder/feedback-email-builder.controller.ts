import { Controller, Get } from '@nestjs/common';
import { FeedbackEmailBuilderService } from './feedback-email-builder.service';

@Controller('feedback-email-builder')
export class FeedbackEmailBuilderController {
  constructor(private feedbackEmailBuilderService: FeedbackEmailBuilderService) {}

  @Get('requested')
  async requested() {
    return (await this.feedbackEmailBuilderService.requested('paul@zenika.com', 'coucou', 'kdCyWyhgkhA8GTXWDAu1')).html;
  }

  @Get('given')
  async given() {
    return (await this.feedbackEmailBuilderService.given('paul@zenika.com', 'Mtjp2Xxp1KXT7CjJ8wCh')).html;
  }
}
