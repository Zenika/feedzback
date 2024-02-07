import { Controller, Get, Param, ServiceUnavailableException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/auth';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @UseGuards(AuthGuard)
  @Get('search/:query')
  searchPersons(@Param('query') query: string) {
    try {
      return this.peopleService.searchPersons(query);
    } catch (err) {
      throw new ServiceUnavailableException();
    }
  }
}
