import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthService } from '../core/auth';
import { EmailService } from '../core/email';
import { EmployeeDbService } from '../employee/employee-db';
import { FeedbackDbService, FeedbackDraftType, FeedbackRequestDraftType, TokenObject } from './feedback-db';
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
    private emailService: EmailService,
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
    const isGiverEmailValid = await this.emailService.validate(giverEmail);
    if (!isGiverEmailValid) {
      throw new BadRequestException('invalid_email');
    }
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
    const draft = await this.feedbackDbService.getDraft(request.giverEmail, FeedbackRequestDraftType, tokenId);

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

  @UseGuards(AuthGuard)
  @Get('give-requested/draft')
  getRequestedDraftList() {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.getDraftList(giverEmail, FeedbackRequestDraftType);
  }

  @Post('give-requested/draft')
  async giveRequestedDraft(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    const success = await this.feedbackDbService.giveRequestedDraft(token, { positive, negative, comment });
    if (!success) {
      throw new BadRequestException();
    }
  }

  @Post('give-requested')
  async giveRequested(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    const infos = await this.feedbackDbService.giveRequested(token, { positive, negative, comment });
    if (!infos) {
      throw new BadRequestException();
    }
    await this.sendEmailsOnGiven(infos.giverEmail, infos.receiverEmail, infos.feedbackId, infos.shared);
  }

  // ----- Give spontaneous feedback -----

  @UseGuards(AuthGuard)
  @Get('give/draft')
  getDraftList() {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.getDraftList(giverEmail, FeedbackDraftType);
  }

  @UseGuards(AuthGuard)
  @Post('give/draft')
  giveDraft(@Body() dto: GiveFeedbackDto) {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.giveDraft({ giverEmail, ...dto });
  }

  @UseGuards(AuthGuard)
  @Post('give')
  async give(@Body() dto: GiveFeedbackDto) {
    const isReceiverEmailValid = await this.emailService.validate(dto.receiverEmail);
    if (!isReceiverEmailValid) {
      throw new BadRequestException('invalid_email');
    }
    const giverEmail = this.authService.userEmail!;
    if (giverEmail === dto.receiverEmail) {
      throw new BadRequestException();
    }
    const idObject = await this.feedbackDbService.give({ giverEmail, ...dto });
    await this.sendEmailsOnGiven(giverEmail, dto.receiverEmail, idObject.id, dto.shared);
    return idObject;
  }

  // ----- feedback draft (common tasks) -----

  @UseGuards(AuthGuard)
  @Delete('draft/:type/:receiverEmailOrToken')
  deleteDraft(@Param() { type, receiverEmailOrToken }: DeleteFeedbackDraftDto) {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.deleteDraft(giverEmail, type, receiverEmailOrToken);
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
    const success = await this.feedbackEmailService.given(giverEmail, receiverEmail, feedbackId);

    if (shared) {
      const managerEmail = (await this.employeeDbService.get(receiverEmail))?.managerEmail;
      if (managerEmail) {
        // Note: even if the email to the manager fails, the process is considered successful.
        await this.feedbackEmailService.shared(managerEmail, receiverEmail, feedbackId);
      }
    }

    return success;
  }
}
