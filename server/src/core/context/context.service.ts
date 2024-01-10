import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DEFAULT_LOCALE_ID } from './context.config';
import { LocaleId } from './context.types';

@Injectable()
export class ContextService {
  serverBaseUrl!: string;

  clientLocalId!: LocaleId;

  setFrom(req: Request) {
    const protocol = req.get('x-forwarded-proto') ?? 'http';
    const host = req.get('Host');
    this.serverBaseUrl = `${protocol}://${host}`;

    // Warning:
    //   When the Angular client execute http requests, the cookies are included ONLY if `withCredentials` is set to `true`
    // Example:
    //   `this.httpClient.get('http://localhost:3000/', { withCredentials: true });`
    this.clientLocalId = req.cookies['app-locale-id'] ?? DEFAULT_LOCALE_ID;
  }
}
