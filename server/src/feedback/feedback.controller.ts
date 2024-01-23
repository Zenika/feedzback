import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { EmployeeDbService } from '../employee/employee-db';
import { FeedbackDbService, TokenObject } from './feedback-db';
import { FeedbackEmailService } from './feedback-email/feedback-email.service';
import {
  DeleteFeedbackDraftDto,
  FeedbackRequestDto,
  GiveFeedbackDto,
  GiveRequestedFeedbackDto,
  ManagedFeedbacksDto,
} from './feedback.dto';

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

  // ----- Request feedback and give requested feedback -----

  @UseGuards(AuthGuard)
  @Post('request')
  async request(@Body() { recipient: giverEmail, message, shared }: FeedbackRequestDto) {
    const receiverEmail = this.authService.userEmail!;
    if (receiverEmail === giverEmail) {
      throw new BadRequestException();
    }
    const tokenId = await this.feedbackDbService.request({ giverEmail, receiverEmail, message, shared });
    await this.feedbackEmailService.requested(giverEmail, receiverEmail, message, tokenId);
  }

  @UseGuards(AuthGuard)
  @Post('request-again')
  async requestAgain(@Body() { feedbackId }: { feedbackId: string }) {
    const receiverEmail = this.authService.userEmail!;

    const requestWithToken = await this.feedbackDbService.requestAgain(feedbackId, receiverEmail);
    if (!requestWithToken) {
      throw new BadRequestException();
    }

    const { giverEmail, message, token } = requestWithToken;
    await this.feedbackEmailService.requested(giverEmail, receiverEmail, message, token);
  }

  @Get('check-request/:token')
  async checkRequest(@Param('token') tokenId: string) {
    const request = await this.feedbackDbService.checkRequest(tokenId);
    if (!request) {
      throw new BadRequestException();
    }
    const draft = await this.feedbackDbService.getRequestedDraft(request.giverEmail, tokenId);

    return { request, draft };
  }

  @UseGuards(AuthGuard)
  @Get('reveal-request-token/:id')
  async revealRequestTokenId(@Param('id') feedbackId: string) {
    const giverEmail = this.authService.userEmail!;
    const tokenId = await this.feedbackDbService.revealRequestTokenId(feedbackId, giverEmail);
    if (!tokenId) {
      throw new BadRequestException();
    }
    return { token: tokenId } as TokenObject;
  }

  @Post('give-requested/draft')
  giveRequestedDraft(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    return this.feedbackDbService.giveRequestedDraft(token, { positive, negative, comment });
  }

  @Post('give-requested')
  async giveRequested(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    const infos = await this.feedbackDbService.giveRequested(token, { positive, negative, comment });
    if (!infos) {
      return false;
    }
    await this.sendEmailsOnGiven(infos.giverEmail, infos.receiverEmail, infos.feedbackId, infos.shared);
    return true;
  }

  // ----- Give spontaneous feedback -----

  @UseGuards(AuthGuard)
  @Post('give/draft')
  giveDraft(@Body() dto: GiveFeedbackDto) {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.giveDraft({ giverEmail, ...dto });
  }

  @UseGuards(AuthGuard)
  @Post('give')
  async give(@Body() dto: GiveFeedbackDto) {
    const giverEmail = this.authService.userEmail!;
    if (giverEmail === dto.receiverEmail) {
      throw new BadRequestException();
    }
    const idObject = await this.feedbackDbService.give({ giverEmail, ...dto });
    await this.sendEmailsOnGiven(giverEmail, dto.receiverEmail, idObject.id, dto.shared);
    return idObject;
  }

  // ----- Manage feedback draft -----

  @UseGuards(AuthGuard)
  @Delete('draft/:type/:receiverEmailOrToken')
  deleteDraftByType(@Param() { type, receiverEmailOrToken }: DeleteFeedbackDraftDto) {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.deleteDraftByType(type, giverEmail, receiverEmailOrToken);
  }

  @UseGuards(AuthGuard)
  @Get('draft/list-map')
  getDraftListMap() {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.getDraftListMap(giverEmail);
  }

  // ----- View feedbacks (requested and given) -----

  @UseGuards(AuthGuard)
  @Get('list-map')
  getListMap() {
    const viewerEmail = this.authService.userEmail!;
    return this.feedbackDbService.getListMap(viewerEmail);
  }

  @UseGuards(AuthGuard)
  @Get('document/:id')
  async getDocument(@Param('id') id: string) {
    const viewerEmail = this.authService.userEmail!;
    const document = await this.feedbackDbService.getDocument(viewerEmail, id);
    if (!document) {
      throw new BadRequestException();
    }
    return document;
  }

  @UseGuards(AuthGuard)
  @Get('managed/:managedEmail')
  async getManagedFeedbacks(@Param() { managedEmail }: ManagedFeedbacksDto) {
    const managerEmail = this.authService.userEmail!;
    const managedEmails = (await this.employeeDbService.get(managerEmail))?.managedEmails;
    if (!managedEmails?.includes(managedEmail)) {
      throw new BadRequestException();
    }
    return await this.feedbackDbService.getManagedFeedbacks(managedEmail);
  }

  // ----- Shared tasks -----

  private async sendEmailsOnGiven(giverEmail: string, receiverEmail: string, feedbackId: string, shared: boolean) {
    await this.feedbackEmailService.given(giverEmail, receiverEmail, feedbackId);
    if (!shared) {
      return;
    }
    const managerEmail = (await this.employeeDbService.get(receiverEmail))?.managerEmail;
    if (!managerEmail) {
      return;
    }
    await this.feedbackEmailService.shared(managerEmail, receiverEmail, feedbackId);
  }
}
