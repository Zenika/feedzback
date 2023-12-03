import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { AskFeedbackDto, SendFeedbackDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
@UseGuards(AuthGuard)
export class FeedbackController {
  constructor(
    private authService: AuthService,
    private feedbackService: FeedbackService,
  ) {}

  @Post('ask')
  ask(@Body() { recipient: senderEmail, message, shared }: AskFeedbackDto) {
    const receiverEmail = this.authService.user?.email ?? '';
    return this.feedbackService.ask({ senderEmail, receiverEmail, message, shared });
  }

  @Get()
  get() {
    return { feedback: true };
  }

  @Get('list')
  getFeedbacks() {
    const senderEmail = this.authService.user?.email ?? '';

    return this.feedbackService.getFeedbacks(senderEmail);
  }

  @Post('send')
  sendFeedback(@Body() sendFeedbackDto: SendFeedbackDto) {
    const senderEmail = this.authService.user?.email ?? '';

    return this.feedbackService.sendFeedback({ senderEmail, ...sendFeedbackDto });
  }
}
