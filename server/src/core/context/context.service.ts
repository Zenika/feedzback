import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DEFAULT_LOCALE_ID } from './context.config';
import { LocaleId } from './context.types';
import { isLocaleId } from './context.utils';

@Injectable()
export class ContextService {
  serverBaseUrl!: string;

  hasValidClientLocaleIdCookie!: boolean;

  clientLocaleId!: LocaleId;

  setFrom(req: Request) {
    this.setServerBaseUrl(req);
    this.setClientLocaleId(req);
  }

  private setServerBaseUrl(req: Request) {
    const protocol = req.get('x-forwarded-proto') ?? 'http';
    const host = req.get('Host');
    this.serverBaseUrl = `${protocol}://${host}`;
  }

  private setClientLocaleId(req: Request) {
    const clientLocaleIdCookie = req.cookies['app-locale-id'];

    this.hasValidClientLocaleIdCookie = isLocaleId(clientLocaleIdCookie);

    // Warning:
    //   When the Angular client execute http requests, the cookies are included ONLY if `withCredentials` is set to `true`
    // Example:
    //   `this.httpClient.get('http://localhost:3000/', { withCredentials: true });`
    this.clientLocaleId = this.hasValidClientLocaleIdCookie ? clientLocaleIdCookie : DEFAULT_LOCALE_ID;
  }
}
