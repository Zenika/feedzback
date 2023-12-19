import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ContextService } from './context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private contextService: ContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.contextService.setFrom(req);
    next();
  }
}
