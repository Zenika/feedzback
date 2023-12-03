import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { AskFeedzbackDto } from './dto/ask-feedzback.dto';
import { SendFeedzbackDto } from './dto/send-feedzback.dto';
import { FeedzbackService } from './feedzback.service';

@Controller('feedzback')
@UseGuards(AuthGuard)
export class FeedzbackController {
  constructor(
    private authService: AuthService,
    private feedzbackService: FeedzbackService,
  ) {}

  @Post('ask')
  ask(@Body() { recipient: senderEmail, message, shared }: AskFeedzbackDto) {
    const receiverEmail = this.authService.user?.email ?? '';
    return this.feedzbackService.ask({ senderEmail, receiverEmail, message, shared });
  }

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
  sendFeedback(@Body() sendFeedbackDto: SendFeedzbackDto) {
    const senderEmail = this.authService.user?.email ?? '';

    return this.feedzbackService.sendFeedback({ senderEmail, ...sendFeedbackDto });
  }
}
