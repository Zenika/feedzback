import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { SendFeedbackDto } from './dto/send-feedback.dto';
import { FeedzbackService } from './feedzback.service';

@Controller('feedzback')
@UseGuards(AuthGuard)
export class FeedzbackController {
  constructor(
    private authService: AuthService,
    private feedzbackService: FeedzbackService,
  ) {}

  @Get()
  get() {
    return { feedzback: true };
  }

  @Get('list')
  getFeedbacks() {
    const senderEmail = this.authService.user?.email ?? '';

    return this.feedzbackService.getFeedbacks(senderEmail);
  }

  @Post('send')
  sendFeedback(@Body() sendFeedbackDto: SendFeedbackDto) {
    const senderEmail = this.authService.user?.email ?? '';

    return this.feedzbackService.sendFeedback({ senderEmail, ...sendFeedbackDto });
  }
}
