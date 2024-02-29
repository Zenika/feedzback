import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthService } from '../core/auth';
import { EmailService } from '../core/email';
import { EmployeeDbService } from '../employee/employee-db';
import { FeedbackDbService, FeedbackDraftType, FeedbackRequestDraftType, TokenObject } from './feedback-db';
import { FeedbackEmailService } from './feedback-email/feedback-email.service';
import {
  DeleteFeedbackDraftDto,
  FeedbackCancelRequestDto,
  FeedbackListMapDto,
  FeedbackRequestAgainDto,
  FeedbackRequestDto,
  GiveFeedbackDto,
  GiveRequestedFeedbackDto,
  SharedFeedbackDocumentDto,
  SharedFeedbackListDto,
} from './feedback.dto';

@ApiBearerAuth()
@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private feedbackDbService: FeedbackDbService,
    private feedbackEmailService: FeedbackEmailService,
    private employeeDbService: EmployeeDbService,
  ) {}

  // #############################################################################
  // #############################################################################
  // PATCH FEEDBACK COLLECTION ADDING "archived: 0" FIELD FOR ALL EXISTING ENTRIES
  // ---- REMOVE THIS CODE AFTER THE COLLECTION HAS BEEN PATCHED IN PRODUCTION ---
  private patchDone = false;

  @Get('patch')
  async PATCH_FEEDBACK_COLLECTION() {
    if (this.patchDone) {
      return { patchExecuted: 'no (already executed)' };
    }

    await this.feedbackDbService.PATCH_FEEDBACK_COLLECTION();
    this.patchDone = true;
    return { patchExecuted: 'yes' };
  }
  // #############################################################################
  // #############################################################################

  @ApiOperation({ summary: 'Ping the server and database connections' })
  @Get('ping')
  async ping() {
    return { ok: await this.feedbackDbService.ping() };
  }

  // ----- Request feedback and give requested feedback -----

  @ApiOperation({ summary: 'Request feedback from one or more people' })
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

  @ApiOperation({ summary: 'Send a reminder email about a requested feedback' })
  @UseGuards(AuthGuard)
  @Post('request-again')
  async requestAgain(@Body() { feedbackId }: FeedbackRequestAgainDto) {
    const receiverEmail = this.authService.userEmail!;

    const requestWithToken = await this.feedbackDbService.requestAgain(feedbackId, receiverEmail);
    if (!requestWithToken) {
      throw new BadRequestException();
    }

    if (requestWithToken.updatedAt > requestWithToken.createdAt) {
      // Only one reminder can be sent
      throw new ForbiddenException();
    }

    const { giverEmail, message, token } = requestWithToken;
    await this.feedbackEmailService.requested(giverEmail, receiverEmail, message, token);
  }

  @ApiOperation({ summary: 'Cancel a feedback request' })
  @UseGuards(AuthGuard)
  @Post('cancel-request')
  async cancelRequest(@Body() { feedbackId }: FeedbackCancelRequestDto) {
    const receiverEmail = this.authService.userEmail!;

    const result = await this.feedbackDbService.cancelRequest(feedbackId, receiverEmail);
    if (result === null) {
      throw new BadRequestException();
    }
    if (result === false) {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({
    summary: 'Get the details of a requested feedback from the secret token ID',
    description: 'Note that this endpoint is public and does not require authentication.',
  })
  @Get('check-request/:token')
  async checkRequest(@Param('token') tokenId: string) {
    const request = await this.feedbackDbService.checkRequest(tokenId);
    if (!request) {
      throw new BadRequestException();
    }
    const draft = await this.feedbackDbService.getDraft(request.giverEmail, FeedbackRequestDraftType, tokenId);

    return { request, draft };
  }

  @ApiOperation({ summary: 'Reveal the secret token ID from the feedback ID for the authenticated user' })
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

  @ApiOperation({ summary: 'Get drafts of the responses to requested feedbacks' })
  @UseGuards(AuthGuard)
  @Get('give-requested/draft')
  getRequestedDraftList() {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.getDraftList(giverEmail, FeedbackRequestDraftType);
  }

  @ApiOperation({ summary: 'Save the response to a requested feedback as a draft' })
  @Post('give-requested/draft')
  async giveRequestedDraft(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    const success = await this.feedbackDbService.giveRequestedDraft(token, { positive, negative, comment });
    if (!success) {
      throw new BadRequestException();
    }
  }

  @ApiOperation({ summary: 'Give requested feedback' })
  @Post('give-requested')
  async giveRequested(@Body() { token, positive, negative, comment }: GiveRequestedFeedbackDto) {
    const infos = await this.feedbackDbService.giveRequested(token, { positive, negative, comment });
    if (!infos) {
      throw new BadRequestException();
    }
    await this.sendEmailsOnGiven(infos.giverEmail, infos.receiverEmail, infos.feedbackId, infos.shared);
  }

  // ----- Give spontaneous feedback -----

  @ApiOperation({ summary: 'Get drafts of spontaneous feedbacks' })
  @UseGuards(AuthGuard)
  @Get('give/draft')
  getDraftList() {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.getDraftList(giverEmail, FeedbackDraftType);
  }

  @ApiOperation({ summary: 'Save a spontaneous feedback as a draft' })
  @UseGuards(AuthGuard)
  @Post('give/draft')
  giveDraft(@Body() dto: GiveFeedbackDto) {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.giveDraft({ giverEmail, ...dto });
  }

  @ApiOperation({ summary: 'Give spontaneous feedback' })
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

  @ApiOperation({ summary: 'Delete a feedback draft' })
  @UseGuards(AuthGuard)
  @Delete('draft/:type/:receiverEmailOrToken')
  deleteDraft(@Param() { type, receiverEmailOrToken }: DeleteFeedbackDraftDto) {
    const giverEmail = this.authService.userEmail!;
    return this.feedbackDbService.deleteDraft(giverEmail, type, receiverEmailOrToken);
  }

  // ----- View feedbacks (requested and given) -----

  @ApiOperation({ summary: 'Get the list of feedback mapped by type' })
  @UseGuards(AuthGuard)
  @Get('list-map')
  getListMap(@Query() { types }: FeedbackListMapDto) {
    const viewerEmail = this.authService.userEmail!;
    return this.feedbackDbService.getListMap(viewerEmail, types);
  }

  @ApiOperation({ summary: 'Get feedback by ID' })
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

  @ApiOperation({ summary: 'Get the list of feedback shared with the authenticated user viewed as manager' })
  @UseGuards(AuthGuard)
  @Get('shared/list/:managedEmail')
  async getSharedFeedbackList(@Param() { managedEmail }: SharedFeedbackListDto) {
    const managerEmail = this.authService.userEmail!;
    const managedEmails = (await this.employeeDbService.get(managerEmail))?.managedEmails;
    if (!managedEmails?.includes(managedEmail)) {
      throw new BadRequestException();
    }
    return await this.feedbackDbService.getSharedFeedbackList(managedEmail);
  }

  @ApiOperation({ summary: 'Get feedback by ID shared with the authenticated user viewed as manager' })
  @UseGuards(AuthGuard)
  @Get('shared/document/:feedbackId')
  async getSharedFeedbackDocument(@Param() { feedbackId }: SharedFeedbackDocumentDto) {
    const document = await this.feedbackDbService.getSharedFeedbackDocument(feedbackId);
    if (!document) {
      throw new BadRequestException();
    }

    const managerEmail = this.authService.userEmail!;
    const managedEmails = (await this.employeeDbService.get(managerEmail))?.managedEmails;
    const managedEmail = document.receiverEmail;
    if (!managedEmails?.includes(managedEmail)) {
      throw new BadRequestException();
    }

    return document;
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
