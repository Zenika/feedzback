import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/auth';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Get('search/:query')
  @UseGuards(AuthGuard)
  searchDirectoryPeople(@Param('query') query: string) {
    return this.peopleService.searchUsers(query);
  }
}
