import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ContextService {
  serverBaseUrl!: string;

  languages!: string[];

  setFrom(req: Request) {
    this.serverBaseUrl = `${req.protocol}://${req.get('Host')}`;

    this.languages = req.acceptsLanguages();
  }
}
