import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { EmployeeDbService } from '../employee/employee-db';
import { FeedbackDbService, TokenObject } from './feedback-db';
import { FeedbackEmailService } from './feedback-email/feedback-email.service';
import { FeedbackRequestDto, GiveFeedbackDto, GiveRequestedFeedbackDto, ManagedFeedbacksDto } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private authService: AuthService,
    private feedbackDbService: FeedbackDbService,
    private feedbackEmailService: FeedbackEmailService,
    private employeeDbService: EmployeeDbService,
  ) {}

  @Get('ping')
  async ping() {
    return { ok: await this.feedbackDbService.ping() };
  }

  @Post('request')
  @UseGuards(AuthGuard)
  async request(@Body() { recipient: giverEmail, message, shared }: FeedbackRequestDto) {
    const receiverEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackDbService.request({ giverEmail, receiverEmail, message, shared });
    await this.feedbackEmailService.requested(giverEmail, receiverEmail, message, tokenId);
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
    const giverEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackDbService.revealRequestTokenId(feedbackId, giverEmail);
    if (!tokenId) {
      throw new BadRequestException();
    }
    return { token: tokenId } as TokenObject;
  }

  @Post('give-requested')
  async giveRequested(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    const infos = await this.feedbackDbService.giveRequested(token, { positive, negative, comment });
    if (!infos) {
      return false;
    }
    await this.feedbackEmailService.given(infos.giverEmail, infos.receiverEmail, infos.feedbackId);
    return true;
  }

  @Post('give')
  @UseGuards(AuthGuard)
  async give(@Body() dto: GiveFeedbackDto) {
    const giverEmail = this.authService.userEmail!;
    const partialIdObject = await this.feedbackDbService.give({ giverEmail, ...dto });
    if (partialIdObject.id) {
      await this.feedbackEmailService.given(giverEmail, dto.receiverEmail, partialIdObject.id);
    }
    return partialIdObject;
  }

  @Get('list-map')
  @UseGuards(AuthGuard)
  getListMap() {
    const viewerEmail = this.authService.userEmail!;
    return this.feedbackDbService.getListMap(viewerEmail);
  }

  @Get('document/:id')
  @UseGuards(AuthGuard)
  async getDocument(@Param('id') id: string) {
    const viewerEmail = this.authService.userEmail!;
    const document = await this.feedbackDbService.getDocument(viewerEmail, id);
    if (!document) {
      throw new BadRequestException();
    }
    return document;
  }

  @Get('managed/:managedEmail')
  @UseGuards(AuthGuard)
  async getManagedFeedbacks(@Param() { managedEmail }: ManagedFeedbacksDto) {
    const managerEmail = this.authService.userEmail!;
    const managedEmails = (await this.employeeDbService.get(managerEmail))?.managedEmails;
    if (!managedEmails?.includes(managedEmail)) {
      throw new BadRequestException();
    }
    return await this.feedbackDbService.getManagedFeedbacks(managedEmail);
  }
}
