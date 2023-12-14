import { Controller, Get } from '@nestjs/common';

@Controller('feedback-email')
export class FeedbackEmailController {
  @Get()
  get() {
    return { ok: true };
  }
}
