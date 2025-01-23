import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const idToken = req.headers.authorization?.substring('Bearer '.length);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.authService.authenticateUser(idToken).then(next);
  }
}
