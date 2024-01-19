import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PeopleService } from './people.service';

@Injectable()
export class PeopleMiddleware implements NestMiddleware {
  constructor(private peopleService: PeopleService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.substring('Bearer '.length);
    if (!accessToken) {
      throw new BadRequestException();
    }
    this.peopleService.accessToken = accessToken;
    next();
  }
}
