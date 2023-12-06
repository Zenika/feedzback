import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { FeedbackRequestDto, GiveFeedbackDto, GiveRequestedFeedbackDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';
import { TokenObject } from './feedback.types';

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

  @Post('request')
  @UseGuards(AuthGuard)
  async request(@Body() { recipient: senderEmail, message, shared }: FeedbackRequestDto) {
    const receiverEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackService.request({ senderEmail, receiverEmail, message, shared });

    // TODO: Send the secret `tokenId` by email to the `recipient`

    return !!tokenId;
  }

  @Get('check-request/:token')
  async checkRequest(@Param('token') tokenId: string) {
    const feedback = await this.feedbackService.checkRequest(tokenId);
    if (!feedback) {
      throw new BadRequestException();
    }
    return feedback;
  }

  @Get('reveal-request-token/:id')
  @UseGuards(AuthGuard)
  async revealRequestTokenId(@Param('id') feedbackId: string) {
    const senderEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackService.revealRequestTokenId(feedbackId, senderEmail);
    if (!tokenId) {
      throw new BadRequestException();
    }
    return { token: tokenId } as TokenObject;
  }

  @Post('give-requested')
  giveRequested(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    return this.feedbackService.giveRequested(token, { positive, negative, comment });
  }

  @Post('give')
  @UseGuards(AuthGuard)
  give(@Body() dto: GiveFeedbackDto) {
    const senderEmail = this.authService.userEmail!;
    return this.feedbackService.give({ senderEmail, ...dto });
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

  @Get('manager/consultants')
  @UseGuards(AuthGuard)
  getManagerConsultants() {
    const managerEmail = this.authService.userEmail!;
    return this.feedbackService.getManagerConsultants(managerEmail);
  }

  @Get('manager/consultants/:email')
  @UseGuards(AuthGuard)
  getManagerConsultantFeedbacks(@Param('email') consultantEmail: string) {
    const managerEmail = this.authService.userEmail!;
    return this.feedbackService.getManagerConsultantFeedbacks(managerEmail, consultantEmail);
  }
}
