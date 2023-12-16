import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderFile } from 'ejs';
import { join } from 'path';
import { AppConfig } from '../../../config';
import { ContextService } from '../../../core/context';
import { givenContentMap, requestedContentMap } from './feedback-email-builder.config';
import { GivenContent, GivenData, RequestedContent, RequestedData } from './feedback-email-builder.types';
import { matchLanguage } from './feedback-email-builder.utils';

@Injectable()
export class FeedbackEmailBuilderService {
  private templatesPath = join(__dirname, 'templates');

  private get language() {
    return matchLanguage(this.contextService.languages);
  }

  constructor(
    private configService: ConfigService<AppConfig>,
    private contextService: ContextService,
  ) {}

  async requested(receiverEmail: string, message: string, tokenId: string) {
    const content: RequestedContent = requestedContentMap[this.language];
    const data: RequestedData = {
      receiverEmail,
      message,
      cta: `${this.configService.get('clientUrl')}/give?token=${tokenId}`,
    };
    return {
      subject: content.title,
      html: await renderFile(join(this.templatesPath, 'request.ejs'), { content, data }, { async: true }),
    };
  }

  async given(senderEmail: string, feedbackId: string) {
    const content: GivenContent = givenContentMap[this.language];
    const data: GivenData = {
      senderEmail,
      cta: `${this.configService.get('clientUrl')}/feedback/received/${feedbackId}`,
    };
    return {
      subject: content.title,
      html: await renderFile(join(this.templatesPath, 'given.ejs'), { content, data }, { async: true }),
    };
  }
}
