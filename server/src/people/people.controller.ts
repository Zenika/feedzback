import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/auth';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @UseGuards(AuthGuard)
  @Get('search/:query')
  searchPersons(@Param('query') query: string) {
    return this.peopleService.searchPersons(query);
  }
}
