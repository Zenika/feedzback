import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Data, renderFile } from 'ejs';
import { join } from 'path';
import { AppConfig } from '../../../core/config';
import { ContextService } from '../../../core/context';
import { givenContentMap, requestedContentMap, sharedContentMap } from './feedback-email-builder.config';
import {
  GivenContent,
  GivenData,
  RequestedContent,
  RequestedData,
  SharedContent,
  SharedData,
} from './feedback-email-builder.types';
import { mapTextToHtml, uglifyEmail } from './feedback-email-builder.utils';

@Injectable()
export class FeedbackEmailBuilderService {
  private templatesPath = join(__dirname, 'templates');

  constructor(
    private configService: ConfigService<AppConfig>,
    private contextService: ContextService,
  ) {}

  async requested(receiverEmail: string, message: string, tokenId: string) {
    const content: RequestedContent = requestedContentMap[this.contextService.clientLocaleId];
    const data: RequestedData = {
      receiverEmail: uglifyEmail(receiverEmail),
      message: mapTextToHtml(message),
      cta: `${this.configService.get('clientUrl')}/give-requested/token/${tokenId}`,
      serverBaseUrl: this.contextService.serverBaseUrl,
    };
    return {
      subject: content.title,
      html: await this.renderFile('request.ejs', { content, data }),
    };
  }

  async given(giverEmail: string, feedbackId: string) {
    const content: GivenContent = givenContentMap[this.contextService.clientLocaleId];
    const data: GivenData = {
      giverEmail: uglifyEmail(giverEmail),
      cta: `${this.configService.get('clientUrl')}/history/id/${feedbackId}`,
      serverBaseUrl: this.contextService.serverBaseUrl,
    };
    return {
      subject: content.title,
      html: await this.renderFile('given.ejs', { content, data }),
    };
  }

  async shared(managedEmail: string, feedbackId: string) {
    const content: SharedContent = sharedContentMap[this.contextService.clientLocaleId];
    const data: SharedData = {
      managedEmail: uglifyEmail(managedEmail),
      cta: `${this.configService.get('clientUrl')}/manager/document/${feedbackId}`,
      serverBaseUrl: this.contextService.serverBaseUrl,
    };
    return {
      subject: content.title,
      html: await this.renderFile('shared.ejs', { content, data }),
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
