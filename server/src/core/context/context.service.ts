import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ContextService {
  serverBaseUrl!: string;

  languages!: string[];

  setFrom(req: Request) {
    const protocol = req.get('x-forwarded-proto') ?? 'http';
    const host = req.get('Host');
    this.serverBaseUrl = `${protocol}://${host}`;

    this.languages = req.acceptsLanguages();
  }
}
