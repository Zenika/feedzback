import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { FeedbackDbService, TokenObject } from './feedback-db';
import { FeedbackEmailService } from './feedback-email/feedback-email.service';
import { FeedbackRequestDto, GiveFeedbackDto, GiveRequestedFeedbackDto } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private authService: AuthService,
    private feedbackDbService: FeedbackDbService,
    private feedbackEmailService: FeedbackEmailService,
  ) {}

  @Get('ping')
  async ping() {
    return { ok: await this.feedbackDbService.ping() };
  }

  @Post('request')
  @UseGuards(AuthGuard)
  async request(@Body() { recipient: senderEmail, message, shared }: FeedbackRequestDto) {
    const receiverEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackDbService.request({ senderEmail, receiverEmail, message, shared });
    if (!tokenId) {
      return false;
    }
    return await this.feedbackEmailService.requested(senderEmail, receiverEmail, message, tokenId);
  }

  @Get('check-request/:token')
  async checkRequest(@Param('token') tokenId: string) {
    const feedback = await this.feedbackDbService.checkRequest(tokenId);
    if (!feedback) {
      throw new BadRequestException();
    }
    return feedback;
  }

  @Get('reveal-request-token/:id')
  @UseGuards(AuthGuard)
  async revealRequestTokenId(@Param('id') feedbackId: string) {
    const senderEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackDbService.revealRequestTokenId(feedbackId, senderEmail);
    if (!tokenId) {
      throw new BadRequestException();
    }
    return { token: tokenId } as TokenObject;
  }

  @Post('give-requested')
  giveRequested(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    return this.feedbackDbService.giveRequested(token, { positive, negative, comment });
  }

  @Post('give')
  @UseGuards(AuthGuard)
  give(@Body() dto: GiveFeedbackDto) {
    const senderEmail = this.authService.userEmail!;
    return this.feedbackDbService.give({ senderEmail, ...dto });
  }

  @Get('list')
  @UseGuards(AuthGuard)
  getList() {
    const userEmail = this.authService.userEmail!;
    return this.feedbackDbService.getList(userEmail);
  }

  @Get('item/:id')
  @UseGuards(AuthGuard)
  getItem(@Param('id') id: string) {
    const userEmail = this.authService.userEmail!;
    return this.feedbackDbService.getItem(userEmail, id);
  }

  @Get('manager/consultants')
  @UseGuards(AuthGuard)
  getManagerConsultants() {
    const managerEmail = this.authService.userEmail!;
    return this.feedbackDbService.getManagerConsultants(managerEmail);
  }

  @Get('manager/consultants/:email')
  @UseGuards(AuthGuard)
  getManagerConsultantFeedbacks(@Param('email') consultantEmail: string) {
    const managerEmail = this.authService.userEmail!;
    return this.feedbackDbService.getManagerConsultantFeedbacks(managerEmail, consultantEmail);
  }
}
