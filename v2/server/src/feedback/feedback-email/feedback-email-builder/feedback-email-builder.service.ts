import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Data, renderFile } from 'ejs';
import { join } from 'path';
import { AppConfig } from '../../../core/config';
import { ContextService } from '../../../core/context';
import { givenContentMap, requestedContentMap } from './feedback-email-builder.config';
import { GivenContent, GivenData, RequestedContent, RequestedData } from './feedback-email-builder.types';
import { matchLanguage, uglifyEmail } from './feedback-email-builder.utils';

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
      receiverEmail: uglifyEmail(receiverEmail),
      message,
      cta: `${this.configService.get('clientUrl')}/give?token=${tokenId}`,
      serverBaseUrl: this.contextService.serverBaseUrl,
    };
    return {
      subject: content.title,
      html: await this.renderFile('request.ejs', { content, data }),
    };
  }

  async given(senderEmail: string, feedbackId: string) {
    const content: GivenContent = givenContentMap[this.language];
    const data: GivenData = {
      senderEmail: uglifyEmail(senderEmail),
      cta: `${this.configService.get('clientUrl')}/feedback/received/${feedbackId}`,
      serverBaseUrl: this.contextService.serverBaseUrl,
    };
    return {
      subject: content.title,
      html: await this.renderFile('given.ejs', { content, data }),
    };
  }

  private renderFile(relativePath: string, data: Data) {
    return new Promise<string>((resolve, reject) => {
      renderFile(join(this.templatesPath, relativePath), data, (err, srt) => {
        if (err) {
          reject(err);
        } else {
          resolve(srt);
        }
      });
    });
  }
}
