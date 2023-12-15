import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ContextService {
  base!: string;

  path!: string;

  languages!: string[];

  setFrom(req: Request) {
    this.base = `${req.protocol}://${req.get('Host')}`;
    this.path = req.originalUrl;
    this.languages = req.acceptsLanguages();
  }
}
