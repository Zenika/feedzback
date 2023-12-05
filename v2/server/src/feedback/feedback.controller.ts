import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { AskFeedbackDto, SendAskedFeedbackDto, SendFeedbackDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';
import { TokenIdObj } from './feedback.types';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly authService: AuthService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Get('ping')
  async ping() {
    return { ok: await this.feedbackService.ping() };
  }

  @Post('ask')
  @UseGuards(AuthGuard)
  async ask(@Body() { recipient: senderEmail, message, shared }: AskFeedbackDto) {
    const receiverEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackService.ask({ senderEmail, receiverEmail, message, shared });

    // TODO: Send the secret `tokenId` by email to the `recipient`

    return !!tokenId;
  }

  @Get('asked/:token')
  async checkAsked(@Param('token') tokenId: string, @Res({ passthrough: true }) res: Response) {
    const feedback = await this.feedbackService.checkAsked(tokenId);
    if (!feedback) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    return feedback;
  }

  @Get('reveal-token/:id')
  @UseGuards(AuthGuard)
  async revealTokenId(@Param('id') feedbackId: string, @Res({ passthrough: true }) res: Response) {
    const senderEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackService.revealTokenId(senderEmail, feedbackId);
    if (!tokenId) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    return { token: tokenId } as TokenIdObj;
  }

  @Post('send-asked')
  sendAsked(@Body() { token, positive, negative, comment }: SendAskedFeedbackDto) {
    return this.feedbackService.sendAsked(token, { positive, negative, comment });
  }

  @Post('send')
  @UseGuards(AuthGuard)
  send(@Body() dto: SendFeedbackDto) {
    const senderEmail = this.authService.userEmail!;
    return this.feedbackService.send({ senderEmail, ...dto });
  }

  @Get('list')
  @UseGuards(AuthGuard)
  getList() {
    const userEmail = this.authService.userEmail!;
    return this.feedbackService.getList(userEmail);
  }

  @Get('item/:id')
  @UseGuards(AuthGuard)
  getItem(@Param('id') id: string) {
    const userEmail = this.authService.userEmail!;
    return this.feedbackService.getItem(userEmail, id);
  }
}
