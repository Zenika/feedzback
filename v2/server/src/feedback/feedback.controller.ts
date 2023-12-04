import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { AskFeedbackDto, SendAskedFeedbackDto, SendFeedbackDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private authService: AuthService,
    private feedbackService: FeedbackService,
  ) {}

  @Post('ask')
  @UseGuards(AuthGuard)
  ask(@Body() { recipient: senderEmail, message, shared }: AskFeedbackDto) {
    const receiverEmail = this.authService.user?.email as string;
    return this.feedbackService.ask({ senderEmail, receiverEmail, message, shared });
  }

  @Get('asked/:id')
  async checkAsked(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const feedback = await this.feedbackService.checkAsked(id);
    if (!feedback) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    return feedback;
  }

  @Post('send-asked')
  sendAsked(@Body() { id, positive, negative, comment }: SendAskedFeedbackDto) {
    return this.feedbackService.sendAsked(id, { positive, negative, comment });
  }

  @Post('send')
  @UseGuards(AuthGuard)
  send(@Body() dto: SendFeedbackDto) {
    const senderEmail = this.authService.user?.email as string;
    return this.feedbackService.send({ senderEmail, ...dto });
  }

  @Get('list')
  @UseGuards(AuthGuard)
  getList() {
    const userEmail = this.authService.user?.email as string;
    return this.feedbackService.getList(userEmail);
  }

  @Get('item/:id')
  @UseGuards(AuthGuard)
  getItem(@Param('id') id: string) {
    const userEmail = this.authService.user?.email as string;
    return this.feedbackService.getItem(userEmail, id);
  }
}
